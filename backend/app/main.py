from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import connect_to_mongo, close_mongo_connection
from .routers import auth, transactions, recurring, export
from .services import scheduler
from .config import Settings

settings = Settings()

app = FastAPI(title="Raff_khata API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(recurring.router, prefix="/api/recurring", tags=["recurring"])
app.include_router(export.router, prefix="/api", tags=["export"])


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await scheduler.start()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    await scheduler.shutdown()
