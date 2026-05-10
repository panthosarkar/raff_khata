from fastapi import Depends, HTTPException, status


async def get_current_user():
    # TODO: implement token parsing & DB lookup
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not implemented")
