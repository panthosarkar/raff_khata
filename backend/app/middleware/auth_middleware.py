from fastapi import HTTPException, Request, status
from bson import ObjectId
from bson.errors import InvalidId

from .. import database
from ..services.auth_service import decode_token


async def get_current_user(request: Request):
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
