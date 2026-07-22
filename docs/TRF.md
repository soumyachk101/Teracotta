# ⚙️ TRF — Technical Requirements & Functional Specifications
## Mitti Kala — Bishnupur Terracotta Platform

**Version:** 1.0  
**Stack Decision Date:** 2024

---

## 1. Technology Stack

### Frontend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React 18 + Vite | Fast HMR, tree-shaking, React ecosystem |
| Styling | Tailwind CSS v3 | Utility-first, design token system, JIT |
| Routing | React Router v6 | SPA routing, nested routes, loaders |
| State — Cart/UI | Zustand | Lightweight, no boilerplate, persist middleware |
| State — Server | TanStack Query v5 | Caching, background refetch, optimistic updates |
| Forms | React Hook Form + Zod | Type-safe validation, minimal re-renders |
| Animations | CSS + Tailwind keyframes | Performance-safe (transform/opacity only) |
| HTTP Client | Axios | Interceptors for auth tokens, base URL config |
| Images | Cloudinary | On-the-fly resize, WebP/AVIF, lazy loading |
| SEO | React Helmet Async | Dynamic meta tags, Open Graph, structured data |
| Icons | Lucide React | Consistent, tree-shakeable SVG icons |

### Backend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Runtime | Node.js 20 LTS | Stable, wide ecosystem |
| Framework | Express.js | Lightweight, flexible, familiar |
| ORM | Prisma | Type-safe queries, migrations, readable schema |
| Database | PostgreSQL 16 | Relational, ACID, production-proven |
| Cache | Redis 7 | Sessions, product cache, rate limiting |
| Auth | JWT + Refresh Tokens | Stateless auth + long sessions |
| File Upload | Multer + Cloudinary SDK | Image processing pipeline |
| Email | Resend (API) | Developer-friendly, high deliverability |
| SMS / OTP | Twilio | OTP login, order notifications |
| Payments | Razorpay (INR) + Stripe (International) | Dual payment gateway |
| Logistics | Shiprocket API | India-wide courier aggregator |
| Queue | Bull + Redis | Async email, order processing, PDF generation |
| PDF | Puppeteer | Certificate of Authenticity generation |

### Infrastructure
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend Hosting | Vercel | Edge CDN, preview deployments, free SSL |
| Backend Hosting | Railway | Simple Node.js deployment, PostgreSQL addon |
| Database | Railway PostgreSQL (Prod) / Neon (Dev) | Serverless-ready, branching |
| Cache | Upstash Redis | Serverless Redis, pay-per-request |
| CDN / Images | Cloudinary | Free tier generous, transform on the fly |
| Monitoring | Sentry | Error tracking frontend + backend |
| Analytics | Posthog (self-hosted) | Privacy-first, event tracking |
| CI/CD | GitHub Actions | Automated lint, test, deploy pipeline |

---

## 2. Functional Specifications

### 2.1 Authentication Module

#### Endpoints
```
POST   /api/auth/register          — email + password registration
POST   /api/auth/login             — email + password login
POST   /api/auth/login/otp/send    — send OTP to phone
POST   /api/auth/login/otp/verify  — verify OTP, issue tokens
POST   /api/auth/google            — Google OAuth callback
POST   /api/auth/refresh           — refresh access token
POST   /api/auth/logout            — invalidate refresh token
GET    /api/auth/me                — get current user profile
```

#### Token Strategy
- **Access Token**: JWT, 15-minute expiry, stored in memory (not localStorage)
- **Refresh Token**: Opaque, 30-day expiry, stored in HttpOnly cookie
- **Rotation**: Refresh token rotated on every use (prevents token theft)

#### Rules
- Password: min 8 chars, 1 uppercase, 1 number
- OTP: 6 digits, 10-minute expiry, max 3 attempts
- Rate limit: 5 login attempts per IP per 15 minutes

---

### 2.2 Product Module

#### Endpoints
```
GET    /api/products               — list (filter, sort, paginate)
GET    /api/products/:id           — single product detail
GET    /api/products/featured      — featured products (homepage)
GET    /api/products/search?q=     — full-text search
GET    /api/categories             — all categories
GET    /api/categories/:slug/products — products by category
POST   /api/products               — create (admin only)
PUT    /api/products/:id           — update (admin only)
DELETE /api/products/:id           — soft delete (admin only)
```

#### Query Parameters (GET /api/products)
```
category   : string        — filter by category slug
minPrice   : number        — minimum price (INR)
maxPrice   : number        — maximum price (INR)
inStock    : boolean       — only in-stock items
sortBy     : enum          — price_asc | price_desc | rating | newest | popular
page       : number        — default: 1
limit      : number        — default: 24, max: 100
q          : string        — full-text search query
```

#### Response Shape (Product)
```json
{
  "id": "bh-001",
  "name": "Classic Bankura Horse — Large",
  "slug": "classic-bankura-horse-large",
  "category": { "id": "horses", "label": "Bankura Horse" },
  "price": 1899,
  "originalPrice": 2400,
  "discountPercent": 21,
  "images": ["https://res.cloudinary.com/..."],
  "artisan": {
    "id": "art-001",
    "name": "Kartik Kumbhakar",
    "village": "Panchmura, Bankura",
    "photo": "https://...",
    "yearsExperience": 28
  },
  "inStock": true,
  "stock": 12,
  "rating": 4.9,
  "reviewCount": 247,
  "badge": "GI Tagged",
  "material": "Hand-fired terracotta clay",
  "dimensions": "14\" H × 10\" W",
  "weight": "1.2 kg",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### 2.3 Order Module

#### Endpoints
```
POST   /api/orders                 — create order (initiates payment)
GET    /api/orders                 — list user's orders
GET    /api/orders/:id             — order detail
POST   /api/orders/:id/cancel      — cancel order (within 2 hours)
POST   /api/orders/:id/return      — initiate return (within 7 days of delivery)
```

#### Order Status Flow
```
PENDING → PAYMENT_CONFIRMED → PROCESSING → PACKED → DISPATCHED → DELIVERED
                                                            ↓
                                                      RETURN_INITIATED
                                                            ↓
                                                      RETURN_PICKED_UP
                                                            ↓
                                                         REFUNDED
```

#### Order Creation Flow
1. Frontend calls `POST /api/orders` with cart items + address
2. Backend validates stock, calculates final price, creates order in DB (status: PENDING)
3. Backend creates Razorpay/Stripe payment intent, returns `paymentOrderId`
4. Frontend opens payment gateway modal
5. On success, gateway calls webhook `POST /api/webhooks/razorpay`
6. Backend verifies signature, updates order to PAYMENT_CONFIRMED
7. Confirmation email sent via queue job

---

### 2.4 Cart Module (Frontend Only)
- Cart state managed in Zustand with `persist` middleware (localStorage)
- No server-side cart for MVP (reduces complexity)
- Cart items include: `{ productId, name, price, image, qty, maxStock }`
- Stock validation happens at checkout initiation (server-side)

---

### 2.5 Search & Filtering
- **Database**: PostgreSQL full-text search using `tsvector` on `name + description`
- **Index**: GIN index on `search_vector` column
- **Future**: Migrate to Typesense (self-hosted) or Algolia when catalogue > 500 products
- Filters applied server-side, paginated response

---

### 2.6 Payments

#### Razorpay (Domestic — INR)
- Standard Checkout integration
- Webhook events handled: `payment.captured`, `payment.failed`, `refund.processed`
- Signature verification on every webhook: `HMAC-SHA256`

#### Stripe (International — USD/GBP)
- Payment Intents API
- Webhook events: `payment_intent.succeeded`, `charge.refunded`
- 3D Secure handled automatically by Stripe

#### COD (Cash on Delivery)
- Available only for orders ≤ ₹2,000
- Available only for pin codes with verified delivery partner
- ₹50 COD handling fee applied

---

### 2.7 Shipping

#### Domestic (Shiprocket)
- Auto-select cheapest courier per pin code
- Insurance mandatory for orders above ₹1,000
- Estimated delivery: 4–7 days (metro), 6–10 days (non-metro)
- Free shipping on orders above ₹999

#### International (Manual + DHL/FedEx)
- Manual processing for Phase 1
- Estimated delivery: 10–20 business days
- Customs declaration auto-generated
- Price: ₹800 flat for South Asia, ₹2,500 for UK/USA/UAE

---

## 3. Performance Requirements

### Frontend Budgets
```
JavaScript bundle (initial load) : < 150 KB gzipped
CSS bundle                       : < 30 KB gzipped
LCP image                        : < 400 KB (WebP), lazy loaded
Total page weight (homepage)     : < 1.5 MB
Time to Interactive              : < 3.5s (slow 4G)
```

### Backend Budgets
```
API response time (p95)   : < 200ms
API response time (p99)   : < 500ms
DB query time (p95)       : < 50ms
Cache hit rate (products) : > 85%
```

---

## 4. Security Requirements

- All API endpoints behind HTTPS (enforced at infrastructure level)
- CORS configured — only allow frontend origin
- Helmet.js middleware (XSS, HSTS, CSP headers)
- Rate limiting: 100 req/min per IP (general), 5 req/15min (auth endpoints)
- Input validation with Zod on all POST/PUT endpoints
- SQL injection prevention via Prisma parameterized queries
- Image upload: validate MIME type + max 5MB + scan with Cloudinary
- Payment card data never touches our servers (hosted fields by Razorpay/Stripe)
- Environment secrets in Railway/Vercel environment variables — never in code

---

## 5. Browser & Device Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ (iOS 14+) |
| Edge | 90+ |
| Samsung Internet | 14+ |

- Mobile-first design; tested on 360px–428px width range
- PWA-ready (manifest.json, service worker for offline browsing)
