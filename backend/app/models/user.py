from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserInDB(BaseModel):
    id: Optional[str]
    email: EmailStr
    hashed_password: str

