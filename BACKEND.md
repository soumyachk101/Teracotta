# 🔧 BACKEND.md — Backend Architecture & API Design
## Mitti Kala — Node.js + Express + Prisma

---

## 1. Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Prisma client singleton
│   │   ├── redis.js           # Redis client (Upstash)
│   │   ├── cloudinary.js      # Cloudinary SDK config
│   │   ├── razorpay.js        # Razorpay instance
│   │   ├── stripe.js          # Stripe instance
│   │   └── env.js             # Validated env vars (zod)
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verify middleware
│   │   ├── requireRole.js     # Role guard (admin, artisan)
│   │   ├── rateLimiter.js     # Redis-backed rate limiter
│   │   ├── validate.js        # Zod request validation
│   │   ├── errorHandler.js    # Global error handler
│   │   └── upload.js          # Multer config for image uploads
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── cart.routes.js     # (validation only in MVP)
│   │   ├── review.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── artisan.routes.js
│   │   ├── ai.routes.js
│   │   ├── admin.routes.js
│   │   └── webhook.routes.js  # Payment gateway webhooks
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── ai.controller.js
│   │   ├── admin.controller.js
│   │   └── webhook.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js        # JWT, OTP, password hashing
│   │   ├── product.service.js     # DB queries, cache
│   │   ├── order.service.js       # Order creation, state machine
│   │   ├── payment.service.js     # Razorpay + Stripe abstraction
│   │   ├── shipping.service.js    # Shiprocket API
│   │   ├── email.service.js       # Resend API — transactional emails
│   │   ├── sms.service.js         # Twilio OTP + notifications
│   │   ├── ai.service.js          # Claude API calls
│   │   ├── certificate.service.js # PDF generation (Puppeteer)
│   │   └── cache.service.js       # Redis helpers
│   │
│   ├── jobs/
│   │   ├── queue.js               # Bull queue setup
│   │   ├── email.job.js           # Process email send jobs
│   │   ├── shipment.job.js        # Poll Shiprocket for updates
│   │   └── analytics.job.js       # Nightly sales aggregation
│   │
│   ├── utils/
│   │   ├── ApiError.js            # Custom error class
│   │   ├── asyncHandler.js        # Wrap async route handlers
│   │   ├── paginate.js            # Cursor/offset pagination helper
│   │   ├── slugify.js
│   │   └── generateOrderNumber.js # ORD-2024-00001 format
│   │
│   └── app.js                     # Express app setup (no listen)
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env.example
├── .env.development
├── package.json
└── server.js                      # Entry point (app.listen)
```

---

## 2. Express App Setup

```js
// src/app.js
import express  from 'express';
import cors     from 'cors';
import helmet   from 'helmet';
import morgan   from 'morgan';
import compression from 'compression';

import { errorHandler }     from './middleware/errorHandler.js';
import { generalLimiter }   from './middleware/rateLimiter.js';

import authRoutes     from './routes/auth.routes.js';
import productRoutes  from './routes/product.routes.js';
import orderRoutes    from './routes/order.routes.js';
import reviewRoutes   from './routes/review.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import aiRoutes       from './routes/ai.routes.js';
import adminRoutes    from './routes/admin.routes.js';
import webhookRoutes  from './routes/webhook.routes.js';

const app = express();

// ── Security & parsing ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Raw body for webhook signature verification (BEFORE express.json)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ────────────────────────────────────────────────────
app.use('/api/', generalLimiter);

// ── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/wishlist',  wishlistRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/webhooks',  webhookRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// ── Error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
```

---

## 3. Authentication Service

```js
// src/services/auth.service.js
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { redis }  from '../config/redis.js';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signAccessToken(userId, role) {
  return jwt.sign({ sub: userId, role }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '30d' });
}

export async function generateOTP(phone) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${phone}`, otp, 'EX', 600); // 10 min TTL
  return otp; // Pass to SMS service for dispatch
}

export async function verifyOTP(phone, inputOtp) {
  const stored = await redis.get(`otp:${phone}`);
  if (!stored || stored !== inputOtp) return false;
  await redis.del(`otp:${phone}`);
  return true;
}

export async function invalidateRefreshToken(userId) {
  await redis.set(`revoked:${userId}`, '1', 'EX', 60 * 60 * 24 * 30);
}
```

---

## 4. Product Service (with caching)

```js
// src/services/product.service.js
import { prisma } from '../config/db.js';
import { cache }  from './cache.service.js';

const CACHE_TTL = 300; // 5 minutes

export async function getProducts({ category, minPrice, maxPrice,
  inStock, sortBy = 'newest', page = 1, limit = 24, q } = {}) {

  const cacheKey = `products:list:${JSON.stringify(arguments[0])}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const where = {
    isActive: true,
    ...(category  && { category: { slug: category } }),
    ...(inStock   && { inStock: true }),
    ...(minPrice  && { price: { gte: minPrice * 100 } }),   // paise
    ...(maxPrice  && { price: { lte: maxPrice * 100 } }),
    ...(q && {
      OR: [
        { name:        { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }),
  };

  const orderBy = {
    newest:     { createdAt: 'desc' },
    popular:    { reviews:   { _count: 'desc' } },
    price_asc:  { price: 'asc' },
    price_desc: { price: 'desc' },
    rating:     { reviews:   { _count: 'desc' } },
  }[sortBy] ?? { createdAt: 'desc' };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip:  (page - 1) * limit,
      take:  limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        artisan:  { select: { displayName: true, village: true, photo: true } },
        images:   { where: { isPrimary: true }, take: 1 },
        _count:   { select: { reviews: true } },
      },
    }),
  ]);

  const result = {
    products: products.map(normaliseProduct),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  await cache.set(cacheKey, result, CACHE_TTL);
  return result;
}

function normaliseProduct(p) {
  return {
    ...p,
    price:         p.price / 100,          // paise → rupees
    originalPrice: p.originalPrice ? p.originalPrice / 100 : null,
    primaryImage:  p.images[0]?.url ?? null,
    reviewCount:   p._count.reviews,
  };
}
```

---

## 5. Order Service

```js
// src/services/order.service.js
import { prisma }  from '../config/db.js';
import { emailQueue } from '../jobs/queue.js';
import { generateOrderNumber } from '../utils/generateOrderNumber.js';

export async function createOrder({ userId, items, addressId, couponCode }) {
  // 1. Fetch products & validate stock
  const productIds = items.map(i => i.productId);
  const products   = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product)           throw new ApiError(404, `Product ${item.productId} not found`);
    if (!product.inStock)   throw new ApiError(400, `${product.name} is out of stock`);
    if (product.stock < item.qty) throw new ApiError(400, `Only ${product.stock} of ${product.name} available`);
  }

  // 2. Calculate pricing
  const address  = await prisma.address.findUniqueOrThrow({ where: { id: addressId } });
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product.price * item.qty);
  }, 0);
  const shippingFee = subtotal >= 99900 ? 0 : 4900; // Free shipping above ₹999 (in paise)
  const total       = subtotal + shippingFee;        // Coupon deducted separately

  // 3. Create order in DB (PENDING)
  const order = await prisma.order.create({
    data: {
      orderNumber:      await generateOrderNumber(),
      userId,
      addressId,
      shippingSnapshot: address,
      subtotal,
      shippingFee,
      total,
      couponCode,
      status:           'PENDING',
      items: {
        create: items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId:    item.productId,
            productName:  product.name,
            productImage: product.images?.[0]?.url ?? '',
            unitPrice:    product.price,
            qty:          item.qty,
            total:        product.price * item.qty,
          };
        }),
      },
    },
    include: { items: true },
  });

  return order;
}

export async function confirmOrderPayment(orderId, paymentData) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data:  { status: 'PAYMENT_CONFIRMED' },
  });

  // Decrement stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data:  {
        stock:   { decrement: item.qty },
        inStock: { set: true }, // re-evaluated in a trigger / cron
      },
    });
  }

  // Queue confirmation email
  await emailQueue.add('order-confirmation', { orderId: order.id });

  return order;
}
```

---

## 6. Error Handling

```js
// src/utils/ApiError.js
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors     = errors;
    this.isApiError = true;
  }
}

// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  if (err.isApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:  err.errors,
    });
  }

  // Prisma known errors
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  // Unhandled
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
```

---

## 7. Environment Variables

```bash
# .env.example

# App
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mittikala

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-another-256-bit-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM=orders@mittikala.com

# Twilio (OTP)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=

# Claude AI
ANTHROPIC_API_KEY=sk-ant-...

# Sentry
SENTRY_DSN=
```
