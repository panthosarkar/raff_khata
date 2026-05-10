from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .recurring_service import process_due_rules
from datetime import datetime

scheduler = AsyncIOScheduler()


def _process_job():
    # wrapper to schedule the async processor
    import asyncio
    asyncio.create_task(process_due_rules())


async def start():
    if not scheduler.running:
        # check every minute for due recurring rules
        scheduler.add_job(_process_job, "interval", minutes=1, id="recurring_processor")
        scheduler.start()


async def shutdown():
    if scheduler.running:
        scheduler.shutdown(wait=False)
