from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    email: str
    password: str


class UserInDB(BaseModel):
    id: Optional[str]
    email: str
    hashed_password: str

