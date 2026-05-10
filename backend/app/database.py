from motor.motor_asyncio import AsyncIOMotorClient
from .config import Settings

settings = Settings()
client = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    # if the URI contains a database name, motor sets it as default
    db = client.get_default_database()


async def close_mongo_connection():
    global client
    if client:
        client.close()
