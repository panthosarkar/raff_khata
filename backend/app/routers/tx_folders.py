from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from .. import database
from ..middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/")
async def create_folder(payload: dict, current_user=Depends(get_current_user)):
    """Create a transaction folder. Payload expects {"name": "Folder name"}."""
    name = payload.get("name")
    if not name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Folder name required")

    coll = database.db.get_collection("transaction_folders")
    doc = {"name": name, "user_id": current_user["id"], "created_at": datetime.utcnow()}
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id), "name": name}


@router.get("/")
async def list_folders(current_user=Depends(get_current_user)):
    coll = database.db.get_collection("transaction_folders")
    cursor = coll.find({"user_id": current_user["id"]}).sort("created_at", -1)
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"folders": items}


@router.delete("/{folder_id}")
async def delete_folder(folder_id: str, current_user=Depends(get_current_user)):
    try:
        object_id = ObjectId(folder_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid folder id")

    coll = database.db.get_collection("transaction_folders")
    res = await coll.delete_one({"_id": object_id, "user_id": current_user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
    # Optionally, unset folder_id from transactions that used this folder
    tx_coll = database.db.get_collection("transactions")
    await tx_coll.update_many({"folder_id": folder_id, "user_id": current_user["id"]}, {"$unset": {"folder_id": ""}})
    return {"deleted": True}
