# Raff_khata — Personal Finance Tracker

A minimal full-stack finance tracker built with **Next.js 14**, **FastAPI**, **MongoDB**, and deployed on **Vercel** (frontend) + **Render** (backend).

## Tech Stack

| Component | Tech |
|-----------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Axios |
| Backend | FastAPI + Motor (async MongoDB driver) |
| Database | MongoDB Atlas (512MB free cluster) |
| Auth | JWT access tokens + refresh cookies |
| Scheduler | APScheduler for recurring transactions |
| Export | CSV streaming |

## Project Structure

```
raff_khata/
├── frontend/               # Next.js 14 app
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Protected dashboard
│   │   └── layout.tsx
│   ├── lib/               # API client, types
│   ├── components/        # Reusable UI components
│   ├── package.json
│   └── .env.local.example
├── backend/               # FastAPI app
│   ├── app/
│   │   ├── main.py        # FastAPI entry
│   │   ├── models/        # Pydantic models
│   │   ├── routers/       # API routes
│   │   ├── services/      # Business logic (auth, scheduler)
│   │   ├── database.py    # Motor connection
│   │   └── config.py      # Settings
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
└── docker-compose.yml     # Local dev setup
```

## Quick Start (Local Development)

### Prerequisites

- **Docker** + **Docker Compose** (for local MongoDB + services)
- **Node.js 18+** and **Python 3.11+** (if running without Docker)

### Using Docker Compose (Recommended)

```bash
docker-compose up
```

Then:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs (Swagger)

### Manual Setup (Without Docker)

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env       # update MONGO_URI to your MongoDB connection
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Then visit http://localhost:3000

---

## Deployment

### Backend (Render)

1. Create a Render account and connect your GitHub repo
2. Create a **Web Service** pointing to `/backend` directory
3. Set environment variables:
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   SECRET_KEY=<generate-a-random-secret>
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```
4. Deploy!

### Frontend (Vercel)

1. Create a Vercel account and connect your GitHub repo
2. Point the root to `/frontend`
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend-render.onrender.com/api
   ```
4. Deploy!

### Database (MongoDB Atlas)

1. Create free 512MB cluster at https://www.mongodb.com/cloud/atlas
2. Add IP whitelist (0.0.0.0/0 for public access or specific IPs)
3. Create a user and copy connection string
4. Use in `MONGO_URI` env var

---

## Features

| Feature | Status | Notes |
|---------|--------|-------|
| Register / Login / Logout | ✅ Done | JWT + refresh tokens |
| Add income/expense | ✅ Done | Form + category picker |
| List & filter transactions | ✅ Done | Table with sorting |
| Monthly dashboard | ✅ Done | Stats cards + category breakdown |
| Budget goals | 🚧 Planned | Set per category |
| Recurring transactions | ✅ Backend | APScheduler processor runs every minute |
| CSV export | ✅ Backend | `/api/export/transactions/csv` |
| Multi-currency | ✅ BDT default | Stored per transaction |

---

## API Endpoints

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login (returns access_token)
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Logout (clears refresh cookie)

### Transactions
- `GET /transactions` — List (with filters: `?category=Food&limit=50`)
- `POST /transactions` — Create new transaction
- `GET /export/transactions/csv` — Download CSV

### Recurring
- `GET /recurring` — List recurring rules
- `POST /recurring` — Create new rule (auto-processes every minute)

---

## Environment Variables

### Backend (`.env`)
```env
MONGO_URI=mongodb://localhost:27017/raff_khata
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALLOWED_ORIGINS=http://localhost:3000,https://yourfrontend.com
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

---

## Running Tests

```bash
# Backend linting
cd backend && python -m pylint app/ --disable=all --enable=E

# Frontend linting
cd frontend && npm run lint
```

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running (check `docker ps` if using compose)
- Verify `MONGO_URI` format and connection string
- Check firewall/IP whitelist if using MongoDB Atlas

### "401 Unauthorized on refresh"
- Ensure `SECRET_KEY` is the same on both backend and frontend
- Check that refresh token cookie is being sent (check browser DevTools → Cookies)

### "CORS errors"
- Verify `ALLOWED_ORIGINS` in backend `.env` includes your frontend domain
- Frontend must send `withCredentials: true` in axios (already configured)
