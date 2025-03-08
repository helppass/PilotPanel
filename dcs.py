from loguru import logger
import asyncio
import websockets
import requests
import json
import base64
import traceback
from config import config
from fastapi import WebSocket
import traceback
import struct


class DataItem:
    def __init__(self, node: dict = None):
        self.name: str = None
        self.value = None

        self.type: str = None
        self.address = None
        self.maxLength = None
        self.maxValue = None
        self.mask = None
        self.shift = None

        if node != None:
            self.type = node.get("type")
            self.address = node.get("address")
            self.maxLength = node.get("maxLength")
            self.maxValue = node.get("maxValue")
            self.mask = node.get("mask")
            self.shift = node.get("shift")

    def __str__(self):
        return self.__dict__.__str__()


class DcsBiosClient:
    def __init__(self, clientWs: WebSocket):
        self.clientWs = clientWs
        self.clientConnected = True
        self.image = bytearray(0xFFFF + 1)
        self.dcsReader = None
        self.dcsWriter = None
        #
        self.subscribes = []
        self.aircraft = None

    async def run(self):
        cfg = config.get("dcs")
        host = cfg.get("host", "127.0.0.1")
        port = cfg.get("port", 7778)

        asyncio.create_task(self.clientHeartbeat())
        while self.clientConnected == True:
            try:
                reader, writer = await asyncio.wait_for(
                    asyncio.open_connection(host, port), timeout=5
                )
                self.dcsReader = reader
                self.dcsWriter = writer
                await asyncio.gather(
                    self.clientReceive(),
                    self.dcsReceive(),
                    self.watchSubscribe(),
                    # , self.testButton(),
                )
                #
            except Exception as ex:
                if self.dcsWriter != None:
                    self.dcsWriter.close()
                exc_info = traceback.format_exc()
                logger.error("{}", exc_info)
                await asyncio.sleep(1)

    async def testButton(self):
        while self.clientConnected == True:
            try:
                if self.dcsWriter == None:
                    await asyncio.sleep(1)
                    continue
                #
                command = "action UFC_1 TOGGLE\n"
                command = "set_state UFCP_BTN_3 1\n"
                command = "fixed_step UFCP_BTN_3 DEC\n"
                command = "UFC_1 TOGGLE\n"
                command = "UFC_1 1\n"
                self.dcsWriter.write(command.encode("utf-8"))
                await self.dcsWriter.drain()
                logger.info("send command: {}", command)
                await asyncio.sleep(1)

                command = "action UFC_1 TOGGLE\n"
                command = "set_state UFCP_BTN_3 0\n"
                command = "fixed_step UFCP_BTN_3 INC\n"
                command = "UFC_1 TOGGLE\n"
                command = "UFC_1 0\n"
                self.dcsWriter.write(command.encode("utf-8"))
                await self.dcsWriter.drain()
                logger.info("send command: {}", command)
                await asyncio.sleep(1)
            except Exception as ex:
                exc_info = traceback.format_exc()
                logger.error("{}", exc_info)
                await asyncio.sleep(1)

    async def clientHeartbeat(self):
        if self.clientConnected == False:
            return
        try:
            await asyncio.sleep(15)
            await self.clientWs.send_text(json.dumps({"type": "heartbeat"}))
            asyncio.create_task(self.clientHeartbeat())
        except Exception as e:
            self.clientConnected = False
            logger.error("clientHeartbeat exception: {}", e)

    async def clientReceive(self):
        while self.clientConnected == True:
            try:
                message = await self.clientWs.receive_text()
                logger.info("clientReceive: {}", message)
                req = json.loads(message)
                cmd = req.get("cmd")
                if cmd == "subscribe":
                    name = req.get("name")
                    item = DataItem(req.get("item"))
                    item.name = name
                    self.subscribes.append(item)
                    logger.info("subscribe: {}", item)
                # elif cmd == "click":
                #     op = req.get("op")
                #     if op == None:
                #         continue
                #     cmdId = self.commandsByName.get(op)
                #     if cmdId != None:
                #         await self.sendCommand(xplaneWs, cmdId, req.get("down", 1))
                elif cmd == "command":
                    command = req.get("command") + "\n"
                    logger.info("send command: {}", command)
                    self.dcsWriter.write(command.encode("utf-8"))
                    await self.dcsWriter.drain()
                #     if command == None:
                #         continue
                #     cmdId = self.commandsByName.get(command)
                #     if cmdId != None:
                #         await self.sendCommand(
                #             xplaneWs,
                #             cmdId,
                #             req.get("down", 1),
                #             req.get("duration", None),
                #         )
                # elif cmd == "dataref_set_values":
                #     await self.setDatas(xplaneWs, req.get("data"))
                # else:
                #     logger.info("unknown cmd: {}", cmd)
                # dataref_subscribe_values
            except Exception as e:
                exc_info = traceback.format_exc()
                logger.error("clientReceive exception: {}", exc_info)
                self.clientConnected = False
                self.dcsWriter.close()

    async def dcsReceive(self):
        while self.clientConnected == True:
            try:
                data = await self.dcsReader.read(4)
                if not data:
                    self.clientConnected = False
                    break
                #
                address, lens = struct.unpack("<HH", data)
                if address == 0x5555 and lens == 0x5555:
                    continue
                data = await self.dcsReader.read(lens)
                if not data:
                    self.clientConnected = False
                    break
                self.image[address : address + lens] = data
            except Exception as e:
                logger.error("xplaneReceive exception: {}", e)
                break
        logger.info("dcs receive end")

    async def watchSubscribe(self):
        while self.clientConnected == True:
            try:
                await asyncio.sleep(0.01)
                #
                for item in self.subscribes:
                    if item.type == "string":
                        value = self.readString(
                            item.address,
                            item.maxLength,
                            True,
                        )
                        if item.value != value:
                            item.value = value
                            await self.sendUpdateNotice(item)
                            logger.info(
                                "update: {}, >>{}<<, {}",
                                item.name,
                                value,
                                value.encode("utf-8").hex(),
                            )
                    if item.type == "integer":
                        value = self.readInteger(item.address, item.mask, item.shift)
                        if item.value != value:
                            item.value = value
                            await self.sendUpdateNotice(item)
                            logger.info("update: {}, {}", item.name, value)

            except Exception as e:
                logger.error("watchSubscribe exception: {}", e)

    def readString(self, address, length, trim: bool = False) -> str:
        data = self.image[address : address + length]
        # data截取
        idx = data.find(b"\x00")
        if idx != -1:
            data = data[:idx]
        text = data.decode()
        # if trim == True:
        # text = text.strip()
        # text = text.strip("\x00")
        # text = text.strip()
        # text = text.strip("\x00")
        return text

    def readInteger(self, address, mask=None, shift=None) -> int:
        data = self.image[address : address + 2]
        v = struct.unpack("<H", data)[0]
        if mask != None:
            v = v & mask
        if shift != None:
            v = v >> shift
        return v

    async def sendUpdateNotice(self, item):
        await self.clientWs.send_json(
            {
                "type": "update_values",
                "data": [{"name": item.name, "value": item.value}],
            }
        )
