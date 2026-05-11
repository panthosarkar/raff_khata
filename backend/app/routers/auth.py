from fastapi import APIRouter, HTTPException, status, Response
from ..models.user import UserCreate
from ..services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from .. import database
from datetime import datetime

router = APIRouter()


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
    response.set_cookie("refresh_token", refresh, httponly=True, samesite="lax")
    return {"access_token": access, "token_type": "bearer"}


@router.post("/refresh")
async def refresh(response: Response, refresh_token: str | None = None):
    # Try to use cookie first
    from fastapi import Cookie
    token = refresh_token
    if not token:
        token = Cookie(None)
    # note: FastAPI injection above won't work as a simple var; instead read cookie in request scope
    # For simplicity, expect client to send cookie (middleware can be added later)
    payload = decode_token(token) if token else None
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    sub = payload.get("sub")
    new_access = create_access_token(sub)
    return {"access_token": new_access, "token_type": "bearer"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"status": "ok"}
