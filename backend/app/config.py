from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017/raff_khata"
    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

