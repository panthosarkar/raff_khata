from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TransactionCreate(BaseModel):
    amount: float
    currency: str = "BDT"
    category: str
    note: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    is_income: bool = False
    folder_id: Optional[str] = None


class TransactionInDB(TransactionCreate):
    id: Optional[str]


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    note: Optional[str] = None
    date: Optional[datetime] = None
    is_income: Optional[bool] = None
    folder_id: Optional[str] = None

