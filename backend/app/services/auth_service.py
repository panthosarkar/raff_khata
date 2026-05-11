from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from ..config import Settings

# pbkdf2_sha256 avoids the bcrypt backend issue in the current runtime.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
settings = Settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    expire = datetime.utcnow() + timedelta(minutes=(expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": subject, "exp": expire}
    encoded = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded


def create_refresh_token(subject: str, expires_days: int | None = None) -> str:
    expire = datetime.utcnow() + timedelta(days=(expires_days or settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None
