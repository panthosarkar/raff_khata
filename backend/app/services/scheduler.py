from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .recurring_service import process_due_rules
from datetime import datetime
import asyncio

scheduler = AsyncIOScheduler()


async def _process_job():
    # async job to process recurring rules
    try:
        await process_due_rules()
    except Exception as e:
        print(f"Error processing recurring rules: {e}")


async def start():
    if not scheduler.running:
        # check every minute for due recurring rules
        scheduler.add_job(_process_job, "interval", minutes=1, id="recurring_processor")
        scheduler.start()


async def shutdown():
    if scheduler.running:
        scheduler.shutdown(wait=False)
