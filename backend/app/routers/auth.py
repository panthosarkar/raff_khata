from fastapi import APIRouter, HTTPException, status, Response, Cookie
from datetime import datetime, timedelta
from bson import ObjectId
import os
from ..models.user import UserCreate, ForgotPasswordRequest, ResetPasswordRequest
from ..services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    create_password_reset_token,
    decode_token,
)
from .. import database
from ..config import Settings
import hashlib

router = APIRouter()
settings = Settings()


def _refresh_cookie_kwargs() -> dict:
    # Cross-site frontend/backend deployments require SameSite=None with Secure.
    frontend_url = os.getenv("FRONTEND_URL", "").strip().lower()
    allowed_origins = settings.ALLOWED_ORIGINS.lower()
    secure_cookie = frontend_url.startswith("https://") or "https://" in allowed_origins
    same_site = "none" if secure_cookie else "lax"

    return {
        "httponly": True,
        "secure": secure_cookie,
        "samesite": same_site,
        "path": "/",
        "max_age": settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    }


def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@router.post("/register")
async def register(payload: UserCreate):
    users = database.db.get_collection("users")
    existing = await users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed = hash_password(payload.password)
    doc = {"email": payload.email, "hashed_password": hashed, "created_at": datetime.utcnow()}
    res = await users.insert_one(doc)
    return {"id": str(res.inserted_id), "email": payload.email}


@router.post("/login")
async def login(payload: UserCreate, response: Response):
    users = database.db.get_collection("users")
    user = await users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user_id = str(user.get("_id"))
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)
    # set refresh token as httpOnly cookie
    response.set_cookie("refresh_token", refresh, **_refresh_cookie_kwargs())
    return {"access_token": access, "token_type": "bearer"}


@router.post("/refresh")
async def refresh(response: Response, refresh_token: str | None = Cookie(default=None)):
    token = refresh_token
    payload = decode_token(token) if token else None
    if not payload or payload.get("purpose") not in (None, "refresh"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    sub = payload.get("sub")
    new_access = create_access_token(sub)
    new_refresh = create_refresh_token(sub)
    response.set_cookie("refresh_token", new_refresh, **_refresh_cookie_kwargs())
    return {"access_token": new_access, "token_type": "bearer"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token", path="/")
    return {"status": "ok"}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    users = database.db.get_collection("users")
    user = await users.find_one({"email": payload.email})
    if not user:
        return {"message": "If the account exists, a reset token was generated."}

    reset_token = create_password_reset_token(str(user.get("_id")))
    token_hash = _hash_reset_token(reset_token)
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    await users.update_one(
        {"_id": user.get("_id")},
        {
            "$set": {
                "reset_token_hash": token_hash,
                "reset_token_expires_at": expires_at,
            }
        },
    )

    # In production this token should be emailed to the user.
    return {
        "message": "Reset token generated.",
        "reset_token": reset_token,
        "expires_in_minutes": 30,
    }


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    token_payload = decode_token(payload.token)
    if not token_payload or token_payload.get("purpose") != "password_reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    subject = token_payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    users = database.db.get_collection("users")
    user = None
    try:
        user = await users.find_one({"_id": ObjectId(subject)})
    except Exception:
        user = None

    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    token_hash = _hash_reset_token(payload.token)
    stored_hash = user.get("reset_token_hash")
    expires_at = user.get("reset_token_expires_at")
    if not stored_hash or stored_hash != token_hash or (expires_at and expires_at < datetime.utcnow()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    await users.update_one(
        {"_id": user.get("_id")},
        {
            "$set": {"hashed_password": hash_password(payload.new_password)},
            "$unset": {"reset_token_hash": "", "reset_token_expires_at": ""},
        },
    )
    return {"message": "Password updated successfully"}
