# Complete Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide walks you through deploying the Raff_khata application with FastAPI backend on **Render** and Next.js frontend on **Vercel**.

---

## Phase 1: Prepare Code for Deployment

### 1.1 Backend Preparation

All backend code is ready. Just ensure:

✅ `requirements.txt` exists with all dependencies  
✅ `Dockerfile` specifies the correct start command  
✅ `render.yaml` includes all environment variable placeholders  
✅ CORS is configured to accept production URLs  

Check with:
```bash
cd backend
cat requirements.txt
cat Dockerfile
cat ../render.yaml
```

### 1.2 Frontend Preparation

Make sure your Next.js frontend:

✅ Uses `NEXT_PUBLIC_API_BASE` environment variable for API URL  
✅ Has proper `.env.local` (local) and `.env.production` (for Vercel)  

Check with:
```bash
cat .env.local
```

---

## Phase 2: Deploy Backend on Render

### Step 1: Push Code to GitHub

Commit and push all changes (including `render.yaml`):

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### Step 2: Create Render Account & Web Service

1. Go to [render.com](https://render.com)
2. Sign up (or log in) with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository
5. Choose the repository (if prompted)

### Step 3: Configure Web Service Settings

| Setting | Value |
|---------|-------|
| **Name** | `raff-khata-backend` |
| **Environment** | `Docker` |
| **Region** | `Oregon` (or your preference) |
| **Branch** | `master` |

### Step 4: Set Environment Variables

Click **"Add Environment Variable"** for each:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URI` | `mongodb+srv://[user]:[pass]@[cluster].mongodb.net/raff_khata` | Get from MongoDB Atlas |
| `SECRET_KEY` | Your generated secret key | Use the one from `.env` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Optional, defaults to 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Optional, defaults to 7 |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Will update after frontend deploys |
| `FRONTEND_URL` | (leave blank for now) | Will update after Vercel deploy |

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render auto-detects `render.yaml` and builds from `backend/Dockerfile`
3. Wait for deployment to complete (~5 minutes)
4. You'll get a URL like: **`https://raff-khata-backend.onrender.com`**
5. **Copy this URL** — you'll need it for the frontend

### Step 6: Test Backend

```bash
curl https://raff-khata-backend.onrender.com/docs
```

Should return Swagger UI documentation. ✅

---

## Phase 3: Deploy Frontend on Vercel

### Step 1: Prepare `.env.production`

Create a `.env.production` file in your root (or frontend folder):

```env
NEXT_PUBLIC_API_BASE=https://raff-khata-backend.onrender.com/api
```

Commit this file:
```bash
git add .env.production
git commit -m "Add Vercel production environment"
git push origin master
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up (or log in) with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. Vercel auto-detects Next.js — no additional config needed

### Step 3: Set Environment Variables (if needed)

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE` | `https://raff-khata-backend.onrender.com/api` | Production |

(If using `.env.production` file, Vercel will auto-detect it)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~3-5 minutes)
3. You'll get a URL like: **`https://your-app.vercel.app`**

### Step 5: Test Frontend

Open `https://your-app.vercel.app` in your browser. You should see the Raff_khata homepage.

---

## Phase 4: Fix CORS for Production

Now that both are deployed, update the backend CORS to accept the frontend URL.

### Step 1: Update Render Environment Variables

1. Go to Render Dashboard → Your Web Service (raff-khata-backend)
2. Go to **"Environment"** tab
3. Update:
   - `ALLOWED_ORIGINS`: Change to `https://your-app.vercel.app`
   - `FRONTEND_URL`: Set to `https://your-app.vercel.app`

4. Click **"Save"** → Render auto-redeploys

### Step 2: Test CORS

Try logging in or registering on your deployed frontend. Should work without CORS errors. ✅

---

## Phase 5: Verify Full Integration

### Test Flow:

1. **Open frontend**: https://your-app.vercel.app
2. **Create account**: Email + password
3. **Login**: Should redirect to dashboard
4. **Add transaction**: Create a test transaction
5. **Check backend logs**: https://render.com → Your service → "Logs"

All requests should show `200` or `201` status codes.

---

## Troubleshooting

### Backend won't start on Render

**Error**: "Could not import module"

**Fix**:
- Ensure `render.yaml` exists with `startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"`
- Or manually set in Render Dashboard → Settings → Start Command

### CORS Error in Browser

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Fix**:
1. Check Render environment variables match your frontend URL
2. Frontend URL should NOT have trailing slash
3. Render should show: `ALLOWED_ORIGINS=https://your-app.vercel.app`
4. Redeploy backend after changing ALLOWED_ORIGINS

### "Internal Server Error" on API calls

**Check**:
1. Render logs: https://render.com → Your service → "Logs"
2. MongoDB connection: Verify `MONGO_URI` is correct and IP whitelist includes Render
3. All required env vars are set

### Frontend shows "Cannot reach API"

**Fix**:
1. Verify `NEXT_PUBLIC_API_BASE` in Vercel is correct
2. Test backend URL directly in browser: `https://raff-khata-backend.onrender.com/docs`
3. Check Render backend is running (check its "Logs")

---

## Local Development After Deployment

Your local setup still works:

```bash
# Terminal 1: Backend
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8001

# Terminal 2: Frontend  
npm run dev
```

Then open `http://localhost:3000` — it will call `http://localhost:8001/api` (from `.env.local`).

---

## Environment Variables Summary

### Backend (Render)

| Variable | Example | Purpose |
|----------|---------|---------|
| `MONGO_URI` | `mongodb+srv://...` | Database connection |
| `SECRET_KEY` | `zFS8xaIxIcofBfidbFUp2Y_...` | JWT signing |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | CORS whitelist |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Dynamic CORS |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token lifetime |

### Frontend (Vercel)

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_BASE` | `https://raff-khata-backend.onrender.com/api` |

---

## Next Steps

After deployment works:

1. **Set up custom domain** (Render & Vercel both support this)
2. **Enable HTTPS** (auto-enabled on both platforms)
3. **Monitor logs** in Render/Vercel dashboards
4. **Set up CI/CD** (already working via GitHub integration)
5. **Scale as needed** (Render free tier has limits; upgrade plan if needed)

---

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs
