# 🚀 DEPLOYMENT.md — Deployment Guide
## Mitti Kala — Vercel (Frontend) + Railway (Backend)

---

## 1. Architecture Overview

```
                        ┌──────────────────┐
   Browser ─────────────►  Vercel Edge CDN  │
                        │  (Frontend React) │
                        └────────┬─────────┘
                                 │ HTTPS API calls
                        ┌────────▼─────────┐
                        │  Railway (Backend)│
                        │  Node.js Express  │
                        └──┬────┬───────┬──┘
                           │    │       │
               ┌───────────▼┐  ┌▼──────┐ ┌▼──────────┐
               │ PostgreSQL  │  │ Redis  │ │ Cloudinary │
               │ (Railway)   │  │(Upstash│ │  (Images)  │
               └────────────┘  └───────┘ └───────────┘
```

---

## 2. Prerequisites

```bash
# Required tools
node >= 20.0.0
npm  >= 10.0.0
git  >= 2.40

# Required accounts
- GitHub account (code hosting + CI/CD)
- Vercel account (frontend)
- Railway account (backend + DB)
- Cloudinary account (image CDN)
- Razorpay account (payments — India)
- Stripe account (payments — international)
- Upstash account (Redis)
- Resend account (email)
- Sentry account (error tracking)
```

---

## 3. Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/bishnupur-terracotta.git
cd bishnupur-terracotta

# 2. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. Copy env files
cp backend/.env.example backend/.env.development
cp frontend/.env.example frontend/.env.development

# 4. Fill in env vars (see ENV VARS section below)
# Edit backend/.env.development and frontend/.env.development

# 5. Start local Postgres (Docker)
docker run --name mittikala-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mittikala \
  -p 5432:5432 -d postgres:16

# 6. Start local Redis (Docker)
docker run --name mittikala-redis -p 6379:6379 -d redis:7

# 7. Run DB migrations + seed
cd backend
npx prisma migrate dev
npx prisma db seed

# 8. Start dev servers
# Terminal 1 — Backend
cd backend && npm run dev       # http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev      # http://localhost:5173
```

---

## 4. Frontend Deployment (Vercel)

### 4.1 Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: bishnupur-terracotta
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

### 4.2 Environment Variables (Vercel Dashboard)

```
# Go to: vercel.com → Project → Settings → Environment Variables

VITE_API_URL          = https://api.mittikala.com
VITE_RAZORPAY_KEY_ID  = rzp_live_...
VITE_STRIPE_PUBLIC_KEY= pk_live_...
VITE_CLOUDINARY_NAME  = your-cloud-name
VITE_SENTRY_DSN       = https://...@sentry.io/...
VITE_POSTHOG_KEY      = phc_...
```

### 4.3 `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options",  "value": "nosniff" },
        { "key": "X-Frame-Options",         "value": "DENY" },
        { "key": "X-XSS-Protection",        "value": "1; mode=block" },
        { "key": "Referrer-Policy",         "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 4.4 Custom Domain

```bash
# In Vercel dashboard → Domains → Add
# Add: mittikala.com
# Add: www.mittikala.com (redirect to apex)

# DNS settings (in your domain registrar):
# A    @    76.76.19.19     (Vercel IP)
# CNAME www  cname.vercel-dns.com
```

---

## 5. Backend Deployment (Railway)

### 5.1 Initial Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Select: Empty project
# Name: bishnupur-terracotta-api
```

### 5.2 Add Services in Railway Dashboard

```
1. New Service → Database → PostgreSQL
   → Note the DATABASE_URL from "Connect" tab

2. New Service → Database → Redis  
   → Note the REDIS_URL

3. New Service → Empty Service (for Node.js app)
   → Connect to GitHub repo
   → Set root directory: /backend
   → Start command: npm start
```

### 5.3 Environment Variables (Railway Dashboard)

```bash
# Set in Railway → Service → Variables

NODE_ENV               = production
PORT                   = 5000
FRONTEND_URL           = https://mittikala.com

# Auto-set by Railway when you add PostgreSQL service:
DATABASE_URL           = postgresql://...

# Auto-set by Railway when you add Redis service:
REDIS_URL              = redis://...

# Set manually:
JWT_ACCESS_SECRET      = [generate: openssl rand -hex 64]
JWT_REFRESH_SECRET     = [generate: openssl rand -hex 64]
CLOUDINARY_CLOUD_NAME  =
CLOUDINARY_API_KEY     =
CLOUDINARY_API_SECRET  =
RAZORPAY_KEY_ID        =
RAZORPAY_KEY_SECRET    =
RAZORPAY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY      =
STRIPE_WEBHOOK_SECRET  =
RESEND_API_KEY         =
RESEND_FROM            = orders@mittikala.com
TWILIO_ACCOUNT_SID     =
TWILIO_AUTH_TOKEN      =
TWILIO_PHONE           =
ANTHROPIC_API_KEY      =
SENTRY_DSN             =
```

### 5.4 `package.json` Scripts

```json
{
  "scripts": {
    "dev":          "nodemon src/server.js",
    "start":        "node src/server.js",
    "build":        "echo 'No build step for Express'",
    "migrate":      "prisma migrate deploy",
    "seed":         "node prisma/seed.js",
    "postinstall":  "prisma generate"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 5.5 Railway Nixpacks Build Config

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run migrate && npm start"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 3
```

### 5.6 Custom Domain (Railway)

```
Railway Dashboard → Service → Settings → Custom Domain
→ Add: api.mittikala.com

DNS (in registrar):
CNAME  api  [your-service].railway.app
```

---

## 6. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy Mitti Kala

on:
  push:
    branches: [main]

jobs:
  # ─── Frontend Tests + Deploy ───────────────────────────────────
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_API_URL:          ${{ secrets.VITE_API_URL }}
          VITE_RAZORPAY_KEY_ID:  ${{ secrets.VITE_RAZORPAY_KEY_ID }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token:   ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id:  ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
          vercel-args: '--prod'

  # ─── Backend Tests + Deploy ────────────────────────────────────
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: mittikala_test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run migrations (test DB)
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/mittikala_test

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/mittikala_test
          JWT_ACCESS_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: bishnupur-terracotta-api
```

---

## 7. Post-Deployment Checklist

```
□ Verify HTTPS working on both frontend and API
□ Test Razorpay payment flow (use test keys first, then live)
□ Test order confirmation email delivery
□ Verify Cloudinary image uploads working
□ Test Shiprocket API connection
□ Set up Sentry alerts (email on new error)
□ Set up Railway health check alerts
□ Configure Vercel Speed Insights
□ Verify robots.txt accessible
□ Test sitemap.xml at /sitemap.xml
□ Submit sitemap to Google Search Console
□ Set up Posthog event tracking
□ Run Lighthouse audit (target: > 90 all categories)
□ Test on real mobile devices (Android + iOS)
□ Load test backend with k6 (100 concurrent users)
```

---

## 8. Rollback Procedure

```bash
# Frontend (Vercel)
vercel rollback [deployment-url]  # Instantly rolls back to previous deployment

# Backend (Railway)
# Railway Dashboard → Service → Deployments → Previous deployment → Redeploy

# Database
# Never run destructive migrations without a backup!
# Before any migration:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 9. Monitoring & Alerts

| Tool | What it monitors | Alert channel |
|------|-----------------|---------------|
| Sentry | Frontend + Backend errors | Email + Slack |
| Railway | Server CPU, memory, restarts | Email |
| Vercel | Build failures, function errors | Email |
| Upstash | Redis memory usage | Email |
| Custom cron | Pending orders > 2h (stuck) | Email to admin |

---

## 10. Estimated Monthly Costs

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby (free) | $0 |
| Railway | Starter | $5 |
| Railway PostgreSQL | Included | $0 |
| Upstash Redis | Pay-per-request | ~$1 |
| Cloudinary | Free (25GB) | $0 |
| Resend | Free (3k emails/mo) | $0 |
| Sentry | Free (5k errors/mo) | $0 |
| GitHub Actions | Free (2000 min/mo) | $0 |
| **Total (MVP)** | | **~$6/month** |
