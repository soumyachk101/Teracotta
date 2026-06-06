# 🏺 Mitti Kala — Bishnupur Terracotta E-Commerce
### *Maati ki mahak, haath ki kala*

A premium direct-to-consumer e-commerce platform for authentic, GI-tagged terracotta crafts from the master artisans of Bishnupur and Panchmura, West Bengal.

---

## 📂 Project Documentation Index

| File | Description |
|------|-------------|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document — goals, features, timelines |
| [`docs/TRF.md`](docs/TRF.md) | Technical Requirements & Functional Specifications |
| [`docs/DATABASE.md`](docs/DATABASE.md) | PostgreSQL schema (Prisma), indexes, migrations |
| [`docs/BACKEND.md`](docs/BACKEND.md) | Node.js/Express architecture, services, API patterns |
| [`docs/CODE_ARCHITECTURE.md`](docs/CODE_ARCHITECTURE.md) | Frontend folder structure, routing, data fetching |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Colors, typography, components, motion language |
| [`docs/AI_INSTRUCTIONS.md`](docs/AI_INSTRUCTIONS.md) | AI feature prompts, Claude API integration guide |
| [`docs/API_DOCS.md`](docs/API_DOCS.md) | REST API reference — all endpoints, request/response |
| [`docs/TESTING.md`](docs/TESTING.md) | Testing strategy, unit/integration/E2E examples |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel + Railway deployment guide, CI/CD pipeline |

---

## 🛠️ Tech Stack Summary

```
Frontend  : React 18 + Vite + Tailwind CSS + TanStack Query + Zustand
Backend   : Node.js + Express + Prisma ORM
Database  : PostgreSQL 16
Cache     : Redis (Upstash)
Auth      : JWT + Refresh Tokens + Google OAuth + OTP
Payments  : Razorpay (INR) + Stripe (International)
Images    : Cloudinary CDN
Email     : Resend
AI        : Anthropic Claude API
Hosting   : Vercel (frontend) + Railway (backend)
CI/CD     : GitHub Actions
Monitoring: Sentry + Posthog
```

---

## 🎨 Design Aesthetic

**Theme:** Artisan Luxury  
**Palette:** Terracotta · Cream · Deep Sienna · Gold accent  
**Fonts:** Cormorant Garamond (display) + DM Sans (body)  
**Principle:** Premium but rooted — never generic, never cold

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/your-org/bishnupur-terracotta.git

# Backend setup
cd backend && npm install
cp .env.example .env.development
npx prisma migrate dev
npx prisma db seed
npm run dev  # → localhost:5000

# Frontend setup
cd frontend && npm install
cp .env.example .env.development
npm run dev  # → localhost:5173
```

---

## 🗂️ Frontend Component Files

| File | Location |
|------|----------|
| Design Tokens | `tailwind.config.md` |
| useInView hook | `src/hooks/useInView.md` |
| useNavScroll hook | `src/hooks/useNavScroll.md` |
| useCart hook | `src/hooks/useCart.md` |
| useCountUp hook | `src/hooks/useCountUp.md` |
| CartContext | `src/context/CartContext.md` |
| AnimateIn component | `src/components/AnimateIn.md` |
| Navbar component | `src/components/Navbar.md` |
| Hero component | `src/components/Hero.md` |
| Products data | `src/data/products.md` |

---

## 📦 Deployment Status

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Development | localhost:5173 | localhost:5000 |
| Staging | staging.mittikala.com | staging-api.mittikala.com |
| Production | mittikala.com | api.mittikala.com |

---

*Built with love for the artisans of Bishnupur. Every purchase supports a 400-year tradition.*

---

## 🤝 Contributing & Collaboration

I am always open to meaningful collaborations. If you have ideas for improvements, bug fixes, or new features, feel free to:
1. **Fork** the repository.
2. **Create** a new feature branch.
3. **Submit** a pull request.

Let's build something great together!

---

