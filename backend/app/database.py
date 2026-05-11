from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConfigurationError
from .config import Settings

settings = Settings()
client = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    try:
        # Use the database from the URI when present.
        db = client.get_default_database()
    except ConfigurationError:
        # Fall back to the app database name when the URI omits one.
        db = client["raff_khata"]


async def close_mongo_connection():
    global client
    if client:
        client.close()
