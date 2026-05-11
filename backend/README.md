# Raff_khata Backend

Minimal FastAPI scaffold for the Raff_khata personal finance tracker.

## Render deployment

Set these environment variables in Render:

- `MONGO_URI` - your MongoDB Atlas connection string, including the database name
- `SECRET_KEY` - a long random secret for JWT signing
- `ACCESS_TOKEN_EXPIRE_MINUTES` - optional, defaults to `30`
- `REFRESH_TOKEN_EXPIRE_DAYS` - optional, defaults to `7`
- `ALLOWED_ORIGINS` - your frontend URL, for example `https://your-frontend.onrender.com`

Render will provide `PORT` automatically, and the Dockerfile now uses it at runtime.

Run locally:

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
