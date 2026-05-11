from fastapi import APIRouter, Query
from typing import Optional
from ..models.transaction import TransactionCreate
from .. import database
from datetime import datetime

router = APIRouter()


@router.post("/")
async def create_transaction(payload: TransactionCreate):
    coll = database.db.get_collection("transactions")
    doc = payload.dict()
    doc["created_at"] = datetime.utcnow()
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def list_transactions(limit: int = Query(50), skip: int = Query(0), category: Optional[str] = None):
    coll = database.db.get_collection("transactions")
    q = {}
    if category:
        q["category"] = category
    cursor = coll.find(q).sort("date", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"transactions": items}
