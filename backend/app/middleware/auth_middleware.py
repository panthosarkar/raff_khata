import os

from fastapi import HTTPException, Request, status
from bson import ObjectId
from bson.errors import InvalidId

from .. import database
from ..config import Settings
from ..services.auth_service import decode_token

settings = Settings()


def _is_dev_auth_bypass_enabled() -> bool:
    app_env = (os.getenv("APP_ENV") or os.getenv("PYTHON_ENV") or "").lower()
    return settings.DEV_SKIP_AUTH or app_env in {"dev", "development", "local"}


async def _resolve_dev_user():
    users = database.db.get_collection("users")
    email = "dev-user@localhost"
    user = await users.find_one({"email": email})
    if not user:
        inserted = await users.insert_one({"email": email, "hashed_password": "dev-skip-auth"})
        user = {"_id": inserted.inserted_id, "email": email}
    return {"id": str(user.get("_id")), "email": user.get("email")}


async def get_current_user(request: Request):
    if _is_dev_auth_bypass_enabled():
        return await _resolve_dev_user()

    authorization = request.headers.get("authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = authorization.removeprefix("Bearer ").strip()
    payload = decode_token(token)
    if not payload or payload.get("purpose") not in (None, "access"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    users = database.db.get_collection("users")
    user = None
    try:
        user = await users.find_one({"_id": ObjectId(subject)})
    except (InvalidId, TypeError):
        user = await users.find_one({"_id": subject})

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return {"id": str(user.get("_id")), "email": user.get("email")}
