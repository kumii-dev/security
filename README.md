# Kumii Admin — Capital Access Platform Dashboard

Enterprise-grade admin dashboard for the Kumii funding operations portal. Built with React 18, Express, Supabase, and Microsoft Entra ID.

---

## Architecture

```
├── client/          React 18 + Vite + TailwindCSS (SPA)
├── server/          Node.js 18 + Express (BFF / API proxy)
├── supabase/        SQL schema (admin data & audit logs)
└── vercel.json      Deployment config
```

**Authentication flow:**
1. User clicks "Sign in with Microsoft" → MSAL PKCE popup
2. Microsoft issues `id_token` → sent to `POST /api/auth/login`
3. Backend verifies token via JWKS, upserts admin user in Supabase, issues backend JWT
4. All subsequent API calls use the backend JWT

---

## Modules

| Module | Roles with access |
|--------|-------------------|
| Dashboard | All |
| Startups | All |
| Applications | All |
| Investors | All |
| Opportunities | All |
| Pipeline | All |
| Impact | All |
| Compliance | super_admin, compliance_officer, funding_manager, executive_view |
| Reports | All |
| Tasks | All (own tasks); super_admin sees all |
| Audit Logs | super_admin, compliance_officer |
| Settings | super_admin only |

### RBAC Roles

| Role | Description |
|------|-------------|
| `super_admin` | Full access including settings and user management |
| `funding_manager` | Manage startups, applications, pipeline |
| `investor_relations` | Manage investors, add notes |
| `impact_analyst` | View impact metrics and reports |
| `compliance_officer` | Compliance, audit logs, reports |
| `executive_view` | Read-only access across all modules |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Microsoft Entra ID (Azure AD) application registration
- A Supabase project
- A Kumii Africa API key

### 1 — Supabase setup

```sql
-- Run supabase/schema.sql in your Supabase SQL Editor
```

### 2 — Environment variables

```bash
# Backend
cp .env.example .env
# Edit .env with your real values

# Frontend
cp .env.example client/.env
# Edit client/.env (only VITE_ prefixed variables are needed)
```

### 3 — Install & run locally

```bash
# Backend
cd server
npm install
npm run dev        # nodemon on port 5000

# Frontend (new terminal)
cd client
npm install
npm run dev        # Vite on port 3000 (proxies /api → port 5000)
```

Open [http://localhost:3000](http://localhost:3000).

---

## Microsoft Entra ID Setup

1. **Register app** in [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations → New registration
2. **Redirect URIs** — add:
   - `http://localhost:3000` (development)
   - `https://your-domain.vercel.app` (production)
   - Select type: **Single-page application (SPA)**
3. **API permissions** — add `User.Read` (Microsoft Graph, delegated)
4. Copy **Application (client) ID** and **Directory (tenant) ID** into your `.env` files

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set all environment variables in **Vercel → Project → Settings → Environment Variables** before deploying:

| Variable | Where |
|----------|-------|
| `AZURE_TENANT_ID` | Server |
| `AZURE_CLIENT_ID` | Server |
| `SUPABASE_URL` | Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server |
| `JWT_SECRET` | Server |
| `KUMII_API_BASE_URL` | Server |
| `KUMII_API_KEY` | Server |
| `CLIENT_ORIGIN` | Server |
| `VITE_AZURE_TENANT_ID` | Client |
| `VITE_AZURE_CLIENT_ID` | Client |

> `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` must **never** be set as `VITE_` variables.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS 3, Framer Motion |
| Auth | Microsoft Entra ID (MSAL Browser/React), PKCE |
| State | TanStack Query v5, Zustand |
| Charts | Recharts |
| Export | XLSX, jsPDF |
| Backend | Node.js 18, Express 4, Helmet, Morgan |
| Token verify | jwks-rsa, jsonwebtoken |
| Database | Supabase (Postgres) |
| External API | kumii.africa (axios-retry) |
| Logging | Winston |
| Deploy | Vercel |

---

## Scripts

```bash
# Server
npm run dev       # nodemon dev server
npm start         # production

# Client
npm run dev       # Vite dev server
npm run build     # production build
npm run preview   # preview production build locally
npm run lint      # ESLint
```

---

## Security Notes

- All API routes require a valid backend-issued JWT (`requireAuth`)
- Microsoft tokens are verified server-side via JWKS (RS256)
- Supabase service role key is **server-only** — never shipped to the browser
- Helmet CSP, CORS allowlist, and rate limiting are applied on all routes
- Idle timeout (default 15 min) auto-logs out inactive users
- All state-changing operations write to `audit_logs`
- Row-Level Security is enabled on all Supabase tables
