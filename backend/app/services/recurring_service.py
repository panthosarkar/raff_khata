from ..database import db
from datetime import datetime, timedelta


async def process_due_rules():
    coll = db.get_collection("recurring")
    tx_coll = db.get_collection("transactions")
    now = datetime.utcnow()
    cursor = coll.find({"next_run": {"$lte": now}})
    async for rule in cursor:
        # create transaction
        tx = {
            "amount": rule.get("amount"),
            "currency": rule.get("currency", "BDT"),
            "category": rule.get("category"),
            "note": rule.get("note"),
            "date": rule.get("next_run") or now,
            "is_income": rule.get("is_income", False),
            "created_at": now,
        }
        await tx_coll.insert_one(tx)
        # compute next run
        interval = int(rule.get("interval_days", 30))
        next_run = (rule.get("next_run") or now) + timedelta(days=interval)
        await coll.update_one({"_id": rule.get("_id")}, {"$set": {"next_run": next_run}})
