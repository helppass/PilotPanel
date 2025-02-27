import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi import (
    FastAPI,
    WebSocket,
)
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger

#
from config import config
from xplane12 import XplaneClient
from dcs import DcsBiosClient

api = FastAPI()


@api.websocket("/xp/ws")
# X-Plane
async def xplane_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client: XplaneClient = XplaneClient(websocket)
    await client.run()


@api.websocket("/dcs/ws")
# DCS
async def dcs_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client: DcsBiosClient = DcsBiosClient(websocket)
    await client.run()


# 强制关闭客户端的静态文件缓存
class DisableStaticFileCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # 执行后续中间件和路由处理，获取响应对象
        response = await call_next(request)

        # 排除 node_modules 路径的静态资源请求
        if request.url.path.startswith("/node_modules"):
            return response

        # 设置缓存控制Header
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"  # 兼容HTTP/1.0
        response.headers["Expires"] = "0"  # 立即过期

        return response


app = FastAPI()
app.mount("/api", api)
app.add_middleware(DisableStaticFileCacheMiddleware)
app.mount("/", StaticFiles(directory="web", html=True), name="web")
