from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from .. import database
from ..middleware.auth_middleware import get_current_user

router = APIRouter()


async def _ensure_default_folder(user_id: str):
    coll = database.db.get_collection("transaction_folders")
    existing_default = await coll.find_one({"user_id": user_id, "is_default": True})
    if existing_default:
        return existing_default

    any_folder = await coll.find_one({"user_id": user_id})
    if any_folder:
        await coll.update_one(
            {"_id": any_folder["_id"], "user_id": user_id},
            {"$set": {"is_default": True}},
        )
        any_folder["is_default"] = True
        return any_folder

    doc = {
        "name": "Default",
        "user_id": user_id,
        "is_default": True,
        "created_at": datetime.utcnow(),
    }
    res = await coll.insert_one(doc)
    doc["_id"] = res.inserted_id
    return doc


@router.post("/")
async def create_folder(payload: dict, current_user=Depends(get_current_user)):
    """Create a transaction folder. Payload expects {"name": "Folder name"}."""
    name = payload.get("name")
    make_default = bool(payload.get("is_default", False))
    if not name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Folder name required")

    coll = database.db.get_collection("transaction_folders")
    existing_count = await coll.count_documents({"user_id": current_user["id"]})
    is_default = make_default or existing_count == 0

    if is_default:
        await coll.update_many(
            {"user_id": current_user["id"], "is_default": True},
            {"$set": {"is_default": False}},
        )

    doc = {
        "name": name,
        "user_id": current_user["id"],
        "is_default": is_default,
        "created_at": datetime.utcnow(),
    }
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id), "name": name, "is_default": is_default}


@router.get("/")
async def list_folders(current_user=Depends(get_current_user)):
    await _ensure_default_folder(current_user["id"])
    coll = database.db.get_collection("transaction_folders")
    cursor = coll.find({"user_id": current_user["id"]}).sort(
        [("is_default", -1), ("created_at", -1)]
    )
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"folders": items}


@router.put("/{folder_id}/default")
async def set_default_folder(folder_id: str, current_user=Depends(get_current_user)):
    try:
        object_id = ObjectId(folder_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid folder id")

    coll = database.db.get_collection("transaction_folders")
    existing = await coll.find_one({"_id": object_id, "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    await coll.update_many(
        {"user_id": current_user["id"], "is_default": True},
        {"$set": {"is_default": False}},
    )
    await coll.update_one(
        {"_id": object_id, "user_id": current_user["id"]},
        {"$set": {"is_default": True}},
    )
    return {"ok": True}


@router.delete("/{folder_id}")
async def delete_folder(folder_id: str, current_user=Depends(get_current_user)):
    try:
        object_id = ObjectId(folder_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid folder id")

    coll = database.db.get_collection("transaction_folders")
    existing = await coll.find_one({"_id": object_id, "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

    res = await coll.delete_one({"_id": object_id, "user_id": current_user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
    # Optionally, unset folder_id from transactions that used this folder
    tx_coll = database.db.get_collection("transactions")
    await tx_coll.update_many({"folder_id": object_id, "user_id": current_user["id"]}, {"$unset": {"folder_id": ""}})

    # Keep exactly one default folder available for each user.
    await _ensure_default_folder(current_user["id"])

    return {"deleted": True}
