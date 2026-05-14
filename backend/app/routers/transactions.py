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
    folders_coll = database.db.get_collection("transaction_folders")
    # convert pydantic model to dict
    # use model_dump if available, fallback to dict
    try:
        doc = payload.model_dump()
    except Exception:
        doc = payload.dict()
    # if folder_id present as string, store as ObjectId for consistency
    if doc.get("folder_id"):
        try:
            doc["folder_id"] = ObjectId(doc["folder_id"])
        except Exception:
            # leave as-is if conversion fails
            pass
    else:
        # keep transaction-folder relation consistent by assigning default folder
        default_folder = await folders_coll.find_one(
            {"user_id": current_user["id"], "is_default": True}
        )
        if default_folder:
            doc["folder_id"] = default_folder["_id"]
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
        # attempt to match ObjectId stored folder references
        try:
            q["folder_id"] = ObjectId(folder_id)
        except Exception:
            q["folder_id"] = folder_id
    cursor = coll.find(q).sort("date", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        # Ensure folder_id is returned as string when present
        if doc.get("folder_id") is not None:
            try:
                doc["folder_id"] = str(doc.get("folder_id"))
            except Exception:
                pass
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"transactions": items}


@router.get("/summary")
async def transactions_summary(
    category: Optional[str] = None,
    folder_id: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    coll = database.db.get_collection("transactions")
    q = {"user_id": current_user["id"]}
    if category:
        q["category"] = category
    if folder_id:
        try:
            q["folder_id"] = ObjectId(folder_id)
        except Exception:
            q["folder_id"] = folder_id

    pipeline = [
        {"$match": q},
        {
            "$group": {
                "_id": "$is_income",
                "total": {"$sum": "$amount"},
            }
        },
    ]

    income = 0.0
    expense = 0.0
    async for row in coll.aggregate(pipeline):
        amount = float(row.get("total") or 0)
        if bool(row.get("_id")):
            income = amount
        else:
            expense = amount

    return {
        "income": income,
        "expense": expense,
        "balance": income - expense,
    }


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
    # if folder_id is present in updates, convert to ObjectId for storage
    if "folder_id" in updates and updates.get("folder_id"):
        try:
            updates["folder_id"] = ObjectId(updates["folder_id"])
        except Exception:
            pass
    await coll.update_one(
        {"_id": object_id, "user_id": current_user["id"]},
        {"$set": updates},
    )

    updated = await coll.find_one({"_id": object_id, "user_id": current_user["id"]})
    updated["id"] = str(updated.get("_id"))
    # normalize folder_id to string if present
    if updated.get("folder_id") is not None:
        try:
            updated["folder_id"] = str(updated.get("folder_id"))
        except Exception:
            pass
    updated.pop("_id", None)
    return {"transaction": updated}


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user=Depends(get_current_user),
):
    coll = database.db.get_collection("transactions")
    try:
        object_id = ObjectId(transaction_id)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid transaction id",
        )

    res = await coll.delete_one({"_id": object_id, "user_id": current_user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return {"deleted": True}
