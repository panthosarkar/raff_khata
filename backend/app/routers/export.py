from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from .. import database
from ..middleware.auth_middleware import get_current_user
import csv
import io

router = APIRouter()


@router.get("/transactions/csv")
async def export_transactions_csv(current_user=Depends(get_current_user)):
    coll = database.db.get_collection("transactions")
    cursor = coll.find({"user_id": current_user["id"]}).sort("date", -1)

    async def generate():
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["id", "amount", "currency", "category", "date", "note", "is_income"])
        yield buf.getvalue()
        buf.seek(0)
        buf.truncate(0)

        async for doc in cursor:
            row = [
                str(doc.get("_id")),
                doc.get("amount"),
                doc.get("currency"),
                doc.get("category"),
                str(doc.get("date")),
                doc.get("note"),
                doc.get("is_income"),
            ]
            writer.writerow(row)
            yield buf.getvalue()
            buf.seek(0)
            buf.truncate(0)

    return StreamingResponse(
        generate(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )
