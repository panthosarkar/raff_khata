# Setup and Run Guide

This guide provides step-by-step instructions to run the Raff_khata application with both backend and frontend servers.

## Prerequisites

- **Python 3.8+** - For the backend
- **Node.js 16+** - For the frontend
- **MongoDB Atlas** - Cloud database (credentials already configured in `.env`)
- **Git** - For cloning and version control

## Project Structure

```
raff_khata/
├── backend/              # FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py       # FastAPI app entry
│   │   ├── routers/      # API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── config.py     # Configuration
│   ├── requirements.txt   # Python dependencies
│   └── .env             # Backend environment variables
├── app/                  # Next.js frontend (TypeScript/React)
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (dashboard)/     # Dashboard pages
│   └── layout.tsx       # Root layout
├── .env.local           # Frontend environment variables
└── package.json         # Frontend dependencies
```

---

## Backend Setup and Run

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Verify Python Environment

Check if Python is installed:
```bash
python --version
```

Expected output: `Python 3.x.x`

### Step 3: Activate Virtual Environment (if not already active)

**Windows (Git Bash/PowerShell):**
```bash
source .venv/Scripts/activate
# or
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Verify Environment Variables

Check that `.env` file exists in the backend directory with MongoDB credentials:

```bash
cat .env
```

Expected content:
```
MONGO_URI=mongodb+srv://[username]:[password]@raffkhata.bn7itkl.mongodb.net/raff_khata
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALLOWED_ORIGINS=http://localhost:3000/
```

### Step 6: Run the Backend Server

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Expected Output:**
```
INFO:     Will watch for changes in these directories: ['...']
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started server process [...]
INFO:     Application startup complete.
```

✅ Backend is now running on: **http://localhost:8001**

**API Documentation:** http://localhost:8001/docs

---

## Frontend Setup and Run

### Step 1: Navigate to Root Directory (from backend folder)

```bash
cd ..
```

### Step 2: Verify Node.js Installation

```bash
node --version
npm --version
```

Expected output: `v16.x.x` or higher

### Step 3: Verify Environment Variables

Check that `.env.local` exists in the root directory:

```bash
cat .env.local
```

Expected content:
```
NEXT_PUBLIC_API_BASE=http://localhost:8001/api
```

### Step 4: Install Frontend Dependencies

```bash
npm install
```

This will install all packages from `package.json`.

### Step 5: Run the Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
> raff_khata@0.1.0 dev
> next dev

  ▲ Next.js 15.x
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in xxx ms
```

✅ Frontend is now running on: **http://localhost:3000**

---

## Running Both Servers Simultaneously

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/Scripts/activate  # Windows or source .venv/bin/activate for Mac/Linux
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Using Process Manager (Advanced)

If you have `npm-run-all` installed:
```bash
npm run dev:all
```

---

## Verification

### 1. Check Backend is Running

```bash
curl http://localhost:8001/docs
```

Should open Swagger UI documentation.

### 2. Check Frontend is Running

```bash
curl http://localhost:3000
```

Should return HTML content.

### 3. Test Login Flow

1. Open http://localhost:3000 in your browser
2. Click "Sign in"
3. Use test credentials or create a new account
4. You should be redirected to the dashboard

### 4. Test Transaction Creation

1. Navigate to "Transactions" page
2. Click "Add transaction"
3. Fill in the form and submit
4. Transaction should appear in the list

### 5. Check API Responses

```bash
# Get all transactions
curl http://localhost:8001/api/transactions

# Get recurring rules
curl http://localhost:8001/api/recurring
```

---

## Common Issues and Solutions

### Issue 1: Backend fails to start - "No MongoDB connection"

**Solution:**
- Verify `.env` has correct `MONGO_URI`
- Check internet connection (MongoDB Atlas is cloud-based)
- Ensure IP whitelist on MongoDB Atlas includes your machine

### Issue 2: Frontend won't connect to backend - "CORS error"

**Solution:**
- Verify backend is running on port 8001
- Check `.env.local` has correct `NEXT_PUBLIC_API_BASE=http://localhost:8001/api`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue 3: "Port 8001 already in use"

**Solution:**
```bash
# Find process using port 8001
netstat -ano | findstr :8001  # Windows
lsof -i :8001                  # macOS/Linux

# Kill the process
taskkill /PID [PID] /F         # Windows
kill -9 [PID]                  # macOS/Linux
```

### Issue 4: "Dependencies not installed"

**Solution:**

Backend:
```bash
cd backend
pip install --upgrade -r requirements.txt
```

Frontend:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Python virtual environment not found"

**Solution:**
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

## Environment Variables Reference

### Backend (`.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `SECRET_KEY` | JWT signing key | `your-secret-key-here` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration time | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiration | `7` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000/` |

### Frontend (`.env.local`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE` | Backend API URL | `http://localhost:8001/api` |

---

## Development Workflow

### 1. Make Backend Changes

- Edit files in `backend/app/`
- Server auto-reloads (Uvicorn watch mode)
- Check console for errors

### 2. Make Frontend Changes

- Edit files in `app/`
- Browser auto-refreshes (Next.js dev mode)
- Check browser console for errors

### 3. Test Changes

- Use browser DevTools (F12)
- Check network tab for API calls
- Check console for errors

### 4. Commit Changes

```bash
git add .
git commit -m "description of changes"
git push origin master
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out user
- `POST /api/auth/refresh` - Refresh access token

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/csv` - Export transactions as CSV

### Recurring Rules
- `GET /api/recurring` - List all recurring rules
- `POST /api/recurring` - Create new recurring rule

---

## Useful Commands

### Backend

```bash
# Start with specific host and port
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Production mode (no reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001

# Check installed packages
pip list

# Upgrade packages
pip install --upgrade -r requirements.txt
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Next Steps

1. **Test the Application** - Follow verification steps above
2. **Explore Dashboard** - Create transactions and recurring rules
3. **Check Logs** - Monitor both terminal windows for errors
4. **Read API Docs** - Visit http://localhost:8001/docs for full API reference
5. **Make Changes** - Edit code and see changes auto-reload

---

## Support

For issues or questions:
1. Check this guide for solutions
2. Review error messages in terminal
3. Check browser DevTools (F12)
4. Review backend logs at http://localhost:8001/docs
