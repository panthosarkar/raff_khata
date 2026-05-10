from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RecurringRuleCreate(BaseModel):
    amount: float
    currency: str = "BDT"
    category: str
    note: Optional[str] = None
    interval_days: int = 30
    next_run: Optional[datetime] = None

