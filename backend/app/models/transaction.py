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


class TransactionInDB(TransactionCreate):
    id: Optional[str]

