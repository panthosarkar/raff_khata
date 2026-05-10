from fastapi import APIRouter
from ..models.recurring import RecurringRuleCreate
from ..database import db
from datetime import datetime

router = APIRouter()


@router.post("/")
async def create_rule(payload: RecurringRuleCreate):
    coll = db.get_collection("recurring")
    doc = payload.dict()
    if not doc.get("next_run"):
        doc["next_run"] = datetime.utcnow()
    res = await coll.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def list_rules():
    coll = db.get_collection("recurring")
    items = []
    cursor = coll.find({})
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        items.append(doc)
    return {"rules": items}
