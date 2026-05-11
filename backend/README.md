# Raff_khata Backend

Minimal FastAPI scaffold for the Raff_khata personal finance tracker.

## Quick Start

Run locally:

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001
```

## Production Deployment

For complete deployment instructions (Render + Vercel), see the [Deployment Guide](../DEPLOYMENT_GUIDE.md) at the project root.

**Quick summary:**
- Backend deploys to Render with `render.yaml`
- Set environment variables: `MONGO_URI`, `SECRET_KEY`, `ALLOWED_ORIGINS`
- Frontend deploys to Vercel with `NEXT_PUBLIC_API_BASE` pointing to Render

## Render Deployment

Set these environment variables in Render:

- `MONGO_URI` - your MongoDB Atlas connection string, including the database name
- `SECRET_KEY` - a long random secret for JWT signing
- `FRONTEND_URL` - your deployed frontend URL (for CORS)
- `ALLOWED_ORIGINS` - comma-separated list of allowed origins
- `ACCESS_TOKEN_EXPIRE_MINUTES` - optional, defaults to `30`
- `REFRESH_TOKEN_EXPIRE_DAYS` - optional, defaults to `7`

Render will provide `PORT` automatically, and the Dockerfile uses it at runtime.
