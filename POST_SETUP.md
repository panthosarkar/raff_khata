# Post-Project Setup: Configuration & Next Steps

This guide covers **critical changes** and **optional enhancements** to make before deploying Raff_khata to production.

---

## ⚠️ CRITICAL: Before Production

### 1. **Secrets & Environment Variables**

#### Backend (`.env` or Render environment)
```env
# CHANGE THESE!
SECRET_KEY=<generate-a-random-256-bit-secret>    # Use: openssl rand -hex 32
MONGO_URI=<your-mongodb-atlas-connection-string>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Keep defaults or adjust as needed
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Generate secure SECRET_KEY:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows
# Use online generator: https://generate-random.org/ (set to hex, 32 bytes)
```

#### Frontend (`.env.local` or Vercel environment)
```env
NEXT_PUBLIC_API_BASE=https://your-backend-api.onrender.com/api
```

---

### 2. **Database Setup (MongoDB Atlas)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account or sign in
3. Create a new **free 512MB cluster**
4. Under "Security" → "IP Whitelist":
   - **Local dev**: Add `0.0.0.0/0` (allow all; **not secure**)
   - **Production**: Add only your backend IP (from Render)
5. Create a database user with strong password
6. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/raff_khata?retryWrites=true&w=majority`
7. Use this as `MONGO_URI` in backend `.env`

---

### 3. **Verify CORS & Auth Middleware**

**Backend (`app/main.py` already configured, verify):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Frontend (`lib/api.ts` already configured):**
- Axios sends `withCredentials: true` ✓
- Refresh token interceptor is in place ✓

---

## 🚀 Optional Enhancements (Phase 2+)

### 4. **Add Request Validation & Error Handling**

**Backend improvements:**
```python
# In app/middleware/auth_middleware.py
from fastapi import HTTPException, status
from ..services.auth_service import decode_token

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return payload.get("sub")

# Use in routers:
@router.get("/transactions")
async def list_transactions(user_id: str = Depends(get_current_user)):
    # Filter by user_id
    ...
```

**Frontend error boundaries:**
```tsx
// frontend/components/ErrorBoundary.tsx
"use client";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: any) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="p-6 bg-red-100 rounded">
      <h2 className="font-bold">Something went wrong!</h2>
      <button onClick={() => reset()} className="mt-2 bg-red-600 text-white px-3 py-1 rounded">
        Try again
      </button>
    </div>
  );
}
```

---

### 5. **Add User-Scoped Data (Multi-User)**

Currently, **all users share the same data**. To fix:

**Backend changes:**
```python
# 1. Add user_id to Transaction model
class TransactionCreate(BaseModel):
    user_id: str  # Add this
    amount: float
    # ...

# 2. Filter transactions by user
@router.get("/transactions")
async def list_transactions(user_id: str = Depends(get_current_user)):
    coll = db.get_collection("transactions")
    return {"transactions": await coll.find({"user_id": user_id}).to_list(100)}

# 3. Update create_transaction to include user_id
```

**Frontend changes:**
```tsx
// Pass user_id from localStorage when calling API
const res = await api.post("/transactions", {
  user_id: localStorage.getItem("user_id"),
  amount: 100,
  ...
});
```

---

### 6. **Enhanced Budget Tracking**

Create `app/routers/budgets.py`:
```python
from fastapi import APIRouter
from ..models.budget import BudgetCreate
from ..database import db

router = APIRouter()

@router.post("/")
async def set_budget(user_id: str, payload: BudgetCreate):
    coll = db.get_collection("budgets")
    await coll.update_one(
        {"user_id": user_id, "category": payload.category},
        {"$set": payload.dict()},
        upsert=True
    )
    return {"status": "ok"}

@router.get("/")
async def get_budgets(user_id: str):
    coll = db.get_collection("budgets")
    budgets = await coll.find({"user_id": user_id}).to_list(100)
    return {"budgets": budgets}
```

Frontend budget page:
```tsx
// frontend/app/(dashboard)/budgets/page.tsx
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [formData, setFormData] = useState({ category: "", limit: "" });

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/budgets", {
      category: formData.category,
      limit: parseFloat(formData.limit),
    });
    // Refresh...
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Budgets</h1>
      <form onSubmit={handleAddBudget} className="mb-8 p-6 bg-white rounded">
        <input placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
        <input type="number" placeholder="Monthly limit" value={formData.limit} onChange={(e) => setFormData({...formData, limit: e.target.value})} />
        <button type="submit">Set Budget</button>
      </form>
    </div>
  );
}
```

---

### 7. **Excel & PDF Export**

**Backend (extend `app/routers/export.py`):**
```python
from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

@router.get("/transactions/excel")
async def export_transactions_excel():
    coll = db.get_collection("transactions")
    txs = await coll.find({}).to_list(10000)
    
    wb = Workbook()
    ws = wb.active
    ws.append(["Date", "Category", "Amount", "Type", "Note"])
    for tx in txs:
        ws.append([tx["date"], tx["category"], tx["amount"], "Income" if tx["is_income"] else "Expense", tx["note"]])
    
    buf = BytesIO()
    wb.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=transactions.xlsx"})

@router.get("/transactions/pdf")
async def export_transactions_pdf():
    # Similar logic with reportlab
    ...
```

**Frontend button:**
```tsx
<button onClick={() => api.get("/export/transactions/excel")} className="bg-green-600 text-white px-4 py-2 rounded">
  Download Excel
</button>
```

---

### 8. **Add Recurring Transactions UI**

Frontend `recurring/page.tsx` (replace placeholder):
```tsx
"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function RecurringPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    interval_days: "30",
    note: "",
  });

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/recurring", {
      amount: parseFloat(form.amount),
      category: form.category,
      interval_days: parseInt(form.interval_days),
      note: form.note,
    });
    // Refresh rules...
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Recurring Transactions</h1>
      <form onSubmit={handleAddRule} className="p-6 bg-white rounded mb-8 space-y-4">
        <input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
        </select>
        <input placeholder="Interval (days)" type="number" value={form.interval_days} onChange={(e) => setForm({...form, interval_days: e.target.value})} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Rule</button>
      </form>
      {/* List rules */}
    </div>
  );
}
```

---

### 9. **Analytics & Charts**

Install recharts:
```bash
cd frontend && npm install recharts
```

Add chart component:
```tsx
// frontend/components/charts/SpendingChart.tsx
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SpendingChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={["#3b82f6", "#ef4444", "#10b981"][idx % 3]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
```

---

### 10. **Deploy to Production**

**Backend (Render):**
1. Push code to GitHub
2. Create new "Web Service" on Render
3. Connect repo, select `/backend` directory
4. Set environment variables (SECRET_KEY, MONGO_URI, etc.)
5. Deploy!

**Frontend (Vercel):**
1. Create new project
2. Connect GitHub repo
3. Set project root to `/frontend`
4. Set env vars (NEXT_PUBLIC_API_BASE = your Render backend URL)
5. Deploy!

---

## 📋 Pre-Launch Checklist

- [ ] Change `SECRET_KEY` to random value (not default)
- [ ] Set `MONGO_URI` to MongoDB Atlas cluster
- [ ] Update `ALLOWED_ORIGINS` to include frontend domain
- [ ] Set `NEXT_PUBLIC_API_BASE` to backend URL
- [ ] Test auth flow (register → login → dashboard)
- [ ] Add transaction and verify it appears in list
- [ ] Check refresh token works (wait 30 mins or manually expire)
- [ ] Verify CORS works (no errors in browser console)
- [ ] Test on mobile/different browser
- [ ] Enable HTTPS on Render/Vercel (auto)
- [ ] Set up MongoDB backups (Atlas UI)
- [ ] Monitor logs on Render & Vercel

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/auth/register" | Backend not running or CORS blocked. Check console errors. |
| 401 on every request | Token not being sent. Check cookies in DevTools. |
| MongoDB connection timeout | Verify MONGO_URI format and IP whitelist in MongoDB Atlas. |
| "Port 8000 already in use" | `lsof -i :8000` (Mac/Linux) or `netstat -ano` (Windows) to find process. |
| CORS errors | Ensure `ALLOWED_ORIGINS` includes http://localhost:3000 for dev. |

---

## 📚 Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Deployment](https://render.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## Questions?

Refer to the main [README.md](./README.md) for quick start & troubleshooting.
