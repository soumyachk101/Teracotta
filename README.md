# 🏺 Mitti Kala — Bishnupur Terracotta E-Commerce

<div align="center">

### *Maati ki mahak, haath ki kala*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-teracotta.vercel.app-E2714D?style=for-the-badge)](https://teracotta.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://github.com/soumyachk101/Teracotta/pulls)

A premium direct-to-consumer e-commerce platform for authentic, GI-tagged terracotta crafts from the master artisans of **Bishnupur** and **Panchmura**, West Bengal.

</div>

---

## ✨ Features

- 🛒 **Full E-Commerce Flow** — Browse, cart, checkout with Razorpay & Stripe
- 🔐 **Auth System** — JWT + Refresh Tokens + Google OAuth + OTP
- 🤖 **AI-Powered** — Claude API integration for recommendations & support
- 🖼️ **Cloudinary CDN** — Optimized image delivery
- 📦 **Order Tracking** — Real-time delivery partner updates
- 🌐 **Multi-language** — Support for regional languages
- 📊 **Admin Dashboard** — Full inventory & order management
- 🚀 **CI/CD** — GitHub Actions with Vercel + Railway deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + TanStack Query + Zustand |
| **Backend** | Node.js + Express + Prisma ORM |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis (Upstash) |
| **Auth** | JWT + Google OAuth + OTP |
| **Payments** | Razorpay (INR) + Stripe (International) |
| **Images** | Cloudinary CDN |
| **Email** | Resend |
| **AI** | Anthropic Claude API |
| **Hosting** | Vercel (frontend) + Railway (backend) |
| **Monitoring** | Sentry + PostHog |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/soumyachk101/Teracotta.git
cd Teracotta

# 2. Backend setup
cd backend
npm install
cp .env.example .env.development
npx prisma migrate dev
npx prisma db seed
npm run dev   # → http://localhost:5000

# 3. Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env.development
npm run dev   # → http://localhost:5173
```

---

## 📂 Project Structure

```
Teracotta/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── data/
├── backend/           # Node.js + Express API
│   ├── routes/
│   ├── controllers/
│   ├── prisma/
│   └── services/
├── .github/workflows/ # CI/CD pipelines
└── docker-compose.yml
```

---

## 📚 Documentation

| File | Description |
|---|---|
| [`PRD.md`](PRD.md) | Product Requirements — goals, features, timelines |
| [`TRF.md`](TRF.md) | Technical Requirements & Functional Specs |
| [`DATABASE.md`](DATABASE.md) | PostgreSQL schema (Prisma), indexes, migrations |
| [`BACKEND.md`](BACKEND.md) | Node.js/Express architecture, services, API patterns |
| [`CODE_ARCHITECTURE.md`](CODE_ARCHITECTURE.md) | Frontend folder structure, routing, data fetching |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Colors, typography, components, motion language |
| [`AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md) | AI feature prompts, Claude API integration guide |
| [`API_DOCS.md`](API_DOCS.md) | REST API reference — all endpoints, request/response |
| [`TESTING.md`](TESTING.md) | Testing strategy — unit/integration/E2E |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Vercel + Railway deployment guide, CI/CD pipeline |

---

## 🌐 Deployment

| Environment | Frontend | Backend |
|---|---|---|
| **Development** | localhost:5173 | localhost:5000 |
| **Staging** | staging.mittikala.com | staging-api.mittikala.com |
| **Production** | mittikala.com | api.mittikala.com |

---

## 🎨 Design Aesthetic

> **Theme:** Artisan Luxury
> **Palette:** Terracotta · Cream · Deep Sienna · Gold accent
> **Fonts:** Cormorant Garamond (display) + DM Sans (body)
> **Principle:** Premium but rooted — never generic, never cold

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request 🎉

---

## 👨‍💻 Author

**Soumya Chakraborty**
- GitHub: [@soumyachk101](https://github.com/soumyachk101)
- Email: soumya.chk101@gmail.com
- Website: [chksoumya.in](https://chksoumya.in)

---

<div align="center">

*Built with ❤️ for the artisans of Bishnupur.*
*Every purchase supports a 400-Year tradition.*

</div>
