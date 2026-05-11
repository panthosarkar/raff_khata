from fastapi import APIRouter, Depends
from ..models.recurring import RecurringRuleCreate
from .. import database
from datetime import datetime
from ..middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/")
async def create_rule(payload: RecurringRuleCreate, current_user=Depends(get_current_user)):
    coll = database.db.get_collection("recurring")
    doc = payload.dict()
    if not doc.get("next_run"):
        doc["next_run"] = datetime.utcnow()
    doc["user_id"] = current_user["id"]
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def list_rules(current_user=Depends(get_current_user)):
    coll = database.db.get_collection("recurring")
    items = []
    cursor = coll.find({"user_id": current_user["id"]})
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"rules": items}
