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


class DataRef:
    def __init__(self, node: dict = None):
        self.writable: bool = False
        self.id: int = None
        self.name: str = None
        self.valueType: str = None
        self.value = None

        if node != None:
            v = node.get("is_writable")
            if v != None:
                self.writable = v
            self.id: int = node.get("id")
            self.name: str = node.get("name")
            self.valueType: str = node.get("value_type")

            v = node.get("value_type")
            if v != None:
                self.valueType = v

            self.value: str = node.get("value")

    def __str__(self):
        return self.__dict__.__str__()


class XplaneClient:
    def __init__(self, clientWs: WebSocket):
        self.clientWs = clientWs

        cfg = config.get("xplane")
        host = cfg.get("host", "127.0.0.1")
        port = cfg.get("port", 8086)
        self.apiHttp = f"http://{host}:{port}/api/v2"
        self.apiWs = f"ws://{host}:{port}/api/v2"
        self.clientConnected: bool = True
        #
        self.dataRefsByName = {}
        self.dataRefsById = {}
        self.dataValues = {}
        self.commandsByName = {}
        self.xplaneSeq = 1000000

    # 加载DataRefs
    def loadDataRefs(self):
        rsp = requests.get(self.apiHttp + "/datarefs")
        if rsp.status_code == 200:
            rspText = rsp.text
            rspJson = json.loads(rspText)
            nodes = rspJson["data"]
            dataRefs = {}
            for node in nodes:
                ref = DataRef(node)
                self.dataRefsByName[ref.name] = ref
                self.dataRefsById[ref.id] = ref
            logger.info("load dataRefs, count: {}", len(self.dataRefsById))
            return dataRefs

    # 加载Commands
    def loadCommands(self):
        rsp = requests.get(self.apiHttp + "/commands")
        if rsp.status_code == 200:
            rspText = rsp.text
            rspJson = json.loads(rspText)
            nodes = rspJson["data"]
            commands = {}
            for node in nodes:
                name = node.get("name")
                id = node.get("id")
                commands[name] = id
                self.commandsByName[name] = id
            logger.info("load commands, count: {}", len(commands))
            return commands

    # 保持客户端websocket连接的心跳包
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

    # 发送Command
    async def sendCommand(
        self, xplaneWs, cmdId: int, down: int = 1, duration: float = None
    ):
        self.xplaneSeq += 1
        active = True if down == 1 else False
        data = {"id": cmdId, "is_active": active}
        req = {
            "req_id": self.xplaneSeq,
            "type": "command_set_is_active",
            "params": {"commands": [data]},
        }
        if duration != None:
            data["duration"] = duration
        reqJson = json.dumps(req)
        logger.info("{}", reqJson)
        await xplaneWs.send(reqJson)

    # 从客户端Websocket读取消息
    async def clientReceive(self, xplaneWs):
        while self.clientConnected == True:
            try:
                message = await self.clientWs.receive_text()
                logger.info("clientReceive: {}", message)
                req = json.loads(message)
                cmd = req.get("cmd")
                if cmd == "subscribe":
                    await self.subDatas(xplaneWs, req.get("names"))
                elif cmd == "click":
                    op = req.get("op")
                    if op == None:
                        continue
                    cmdId = self.commandsByName.get(op)
                    if cmdId != None:
                        await self.sendCommand(xplaneWs, cmdId, req.get("down", 1))
                elif cmd == "command":
                    command = req.get("command")
                    if command == None:
                        continue
                    cmdId = self.commandsByName.get(command)
                    if cmdId != None:
                        await self.sendCommand(
                            xplaneWs,
                            cmdId,
                            req.get("down", 1),
                            req.get("duration", None),
                        )
                elif cmd == "dataref_set_values":
                    await self.setDatas(xplaneWs, req.get("data"))
                else:
                    logger.info("unknown cmd: {}", cmd)
            except Exception as e:
                logger.error("clientReceive exception: {}", e)
                self.clientConnected = False

    # 从Xplane websocket读取消息
    async def xplaneReceive(self, xplaneWs):
        while self.clientConnected == True:
            try:
                message = await xplaneWs.recv()
                # logger.info("xplaneReceive: {}", message)
                req = json.loads(message)
                if req["type"] == "dataref_update_values":
                    datas = req["data"]
                    notices = []
                    for id, value in datas.items():
                        if id.isdigit() == False:
                            continue
                        id = int(id)
                        ref = self.dataRefsById.get(id)
                        if ref == None:
                            continue
                        name = ref.name
                        ref.value = value
                        if name == "sim/aircraft/view/acf_author":
                            value = self.toStr(value)
                        elif name == "sim/aircraft/view/acf_descrip":
                            value = self.toStr(value)
                        elif name == "sim/aircraft/view/acf_ui_name":
                            value = self.toStr(value)
                            notices.append({"name": "aircraft", "value": value})
                        else:
                            pass
                        notices.append({"name": name, "value": value})
                    await self.clientWs.send_json(
                        {"type": "update_values", "data": notices}
                    )
                    logger.info("send update values: {}", len(notices))
                elif req["type"] == "result":
                    logger.info("xplaneResult: {}", message)
            except Exception as e:
                logger.error("xplaneReceive exception: {}", e)
                break

    async def subDatas(self, xplaneWs, names):
        self.xplaneSeq += 1
        refs = []
        req = {
            "req_id": self.xplaneSeq,
            "type": "dataref_subscribe_values",
            "params": {"datarefs": refs},
        }
        for name in names:
            ref = self.dataRefsByName.get(name)
            if ref == None:
                continue
            refs.append({"id": ref.id})
        #
        if len(refs) > 0:
            reqJson = json.dumps(req)
            logger.info("{}", reqJson)
            await xplaneWs.send(reqJson)

    async def setDatas(self, xplaneWs, datas):
        self.xplaneSeq += 1
        refs = []
        req = {
            "req_id": self.xplaneSeq,
            "type": "dataref_set_values",
            "params": {"datarefs": refs},
        }
        for data in datas:
            name = data.get("name")
            value = data.get("value")
            ref = self.dataRefsByName.get(name)
            if ref == None:
                continue
            refs.append({"id": ref.id, "value": value})
        #
        if len(refs) > 0:
            reqJson = json.dumps(req)
            logger.info("{}", reqJson)
            await xplaneWs.send(reqJson)

    def toStr(self, value):
        value = base64.b64decode(value)
        value = value.decode("utf-8")
        value = value.strip("\x00")
        return value

    async def run(self):
        asyncio.create_task(self.clientHeartbeat())
        while self.clientConnected == True:
            try:
                self.loadDataRefs()
                self.loadCommands()
                async with websockets.connect(self.apiWs) as xplaneWs:
                    #
                    await self.subDatas(
                        xplaneWs,
                        [
                            "sim/aircraft/view/acf_author",
                            "sim/aircraft/view/acf_ui_name",
                            "sim/aircraft/view/acf_descrip",
                        ],
                    )
                    #
                    await asyncio.gather(
                        self.clientReceive(xplaneWs), self.xplaneReceive(xplaneWs)
                    )
                #
            except Exception as ex:
                exc_info = traceback.format_exc()
                logger.error("{}", exc_info)
                await asyncio.sleep(1)
