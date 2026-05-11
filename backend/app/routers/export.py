from fastapi import APIRouter, Response
from fastapi.responses import StreamingResponse
from .. import database
import csv
import io

router = APIRouter()


@router.get("/transactions/csv")
async def export_transactions_csv():
    coll = database.db.get_collection("transactions")
    cursor = coll.find({}).sort("date", -1)

    def generate():
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["id", "amount", "currency", "category", "date", "note", "is_income"])
        yield buf.getvalue()
        buf.seek(0)
        buf.truncate(0)
        import asyncio

        async def drain():
            async for doc in cursor:
                row = [str(doc.get("_id")), doc.get("amount"), doc.get("currency"), doc.get("category"), str(doc.get("date")), doc.get("note"), doc.get("is_income")]
                writer.writerow(row)
                yield buf.getvalue()
                buf.seek(0)
                buf.truncate(0)

        # run the async generator
        loop = asyncio.new_event_loop()
        try:
            for part in loop.run_until_complete(drain()):
                yield part
        finally:
            loop.close()

    return StreamingResponse(generate(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=transactions.csv"})
