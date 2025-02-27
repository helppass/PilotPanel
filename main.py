import uvicorn
from config import config
import server

#
if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=config.get("port"),
        log_level="info",
        # log_config=None,
        # reload=True,
    )
