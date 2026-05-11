from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import connect_to_mongo, close_mongo_connection
from .routers import auth, transactions, recurring, export
from .services import scheduler
from .config import Settings

settings = Settings()

app = FastAPI(title="Raff_khata API")

# Build allowed origins from environment (supports both dev and production URLs)
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip()
]

# Add any frontend URLs from environment variables (for production deployment)
if "FRONTEND_URL" in os.environ:
    frontend_url = os.environ["FRONTEND_URL"].strip().rstrip("/")
    if frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
