from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId

from ..models.transaction import TransactionCreate, TransactionUpdate
from .. import database
from datetime import datetime
from ..middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/")
async def create_transaction(payload: TransactionCreate, current_user=Depends(get_current_user)):
    coll = database.db.get_collection("transactions")
    doc = payload.dict()
    doc["created_at"] = datetime.utcnow()
    doc["user_id"] = current_user["id"]
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def list_transactions(limit: int = Query(50), skip: int = Query(0), category: Optional[str] = None, folder_id: Optional[str] = None, current_user=Depends(get_current_user)):
    coll = database.db.get_collection("transactions")
    q = {"user_id": current_user["id"]}
    if category:
        q["category"] = category
    if folder_id:
        q["folder_id"] = folder_id
    cursor = coll.find(q).sort("date", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"transactions": items}


@router.put("/{transaction_id}")
async def update_transaction(transaction_id: str, payload: TransactionUpdate, current_user=Depends(get_current_user)):
    if not payload.model_dump(exclude_unset=True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update fields provided")

    coll = database.db.get_collection("transactions")
    try:
        object_id = ObjectId(transaction_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid transaction id")

    existing = await coll.find_one({"_id": object_id, "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    updates = payload.model_dump(exclude_unset=True)
    await coll.update_one(
        {"_id": object_id, "user_id": current_user["id"]},
        {"$set": updates},
    )

    updated = await coll.find_one({"_id": object_id, "user_id": current_user["id"]})
    updated["id"] = str(updated.get("_id"))
    updated.pop("_id", None)
    return {"transaction": updated}
