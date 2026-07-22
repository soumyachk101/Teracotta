# 📡 API_DOCS.md — REST API Documentation
## Mitti Kala — v1.0

**Base URL:** `https://api.mittikala.com/api`  
**Content-Type:** `application/json`  
**Auth:** Bearer token (JWT) in `Authorization` header

---

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

### Paginated List
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 24,
      "totalPages": 5
    }
  }
}
```

---

## Authentication

### POST `/auth/register`
Register a new customer.

**Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "SecurePass123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Priya Sharma", "email": "priya@example.com", "role": "CUSTOMER" },
    "accessToken": "eyJ..."
  }
}
```
> Refresh token set as `HttpOnly` cookie automatically.

---

### POST `/auth/login`
Login with email + password.

**Body:**
```json
{ "email": "priya@example.com", "password": "SecurePass123" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Priya Sharma", "role": "CUSTOMER" },
    "accessToken": "eyJ..."
  }
}
```

---

### POST `/auth/login/otp/send`
Send OTP to phone number.

**Body:**
```json
{ "phone": "9876543210" }
```

**Response 200:** `{ "success": true, "message": "OTP sent" }`

---

### POST `/auth/login/otp/verify`
Verify OTP and log in.

**Body:**
```json
{ "phone": "9876543210", "otp": "847291" }
```

**Response 200:** Same as email login.

---

### POST `/auth/refresh`
Refresh access token using HttpOnly cookie.

**Response 200:**
```json
{ "success": true, "data": { "accessToken": "eyJ..." } }
```

---

### POST `/auth/logout`
Invalidate refresh token. **Requires auth.**

**Response 200:** `{ "success": true }`

---

### GET `/auth/me`
Get current user. **Requires auth.**

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxx",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## Products

### GET `/products`
List products with filters and pagination.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | string | — | Category slug: `horses`, `idols`, `panels`, `jewelry`, `decor`, `planters` |
| minPrice | number | — | Min price in ₹ |
| maxPrice | number | — | Max price in ₹ |
| inStock | boolean | — | Only in-stock items |
| sortBy | string | `newest` | `price_asc`, `price_desc`, `rating`, `newest`, `popular` |
| page | number | 1 | Page number |
| limit | number | 24 | Items per page (max 100) |
| q | string | — | Search query |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "bh-001",
        "name": "Classic Bankura Horse — Large",
        "slug": "classic-bankura-horse-large",
        "price": 1899,
        "originalPrice": 2400,
        "discountPercent": 21,
        "primaryImage": "https://res.cloudinary.com/...",
        "badge": "GI Tagged",
        "inStock": true,
        "rating": 4.9,
        "reviewCount": 247,
        "category": { "slug": "horses", "name": "Bankura Horse" },
        "artisan": { "displayName": "Kartik Kumbhakar", "village": "Panchmura" }
      }
    ],
    "pagination": { "total": 48, "page": 1, "limit": 24, "totalPages": 2 }
  }
}
```

---

### GET `/products/featured`
Returns up to 8 featured products for the homepage.

---

### GET `/products/:id`
Get single product with full details.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "bh-001",
    "name": "Classic Bankura Horse — Large",
    "slug": "classic-bankura-horse-large",
    "description": "The iconic Bankura Horse, handcrafted by...",
    "price": 1899,
    "originalPrice": 2400,
    "images": [
      { "url": "https://...", "altText": "Front view", "isPrimary": true },
      { "url": "https://...", "altText": "Side view", "isPrimary": false }
    ],
    "material": "Hand-fired terracotta clay",
    "dimensions": "14\" H × 10\" W",
    "weight": "1.2 kg",
    "inStock": true,
    "stock": 12,
    "rating": 4.9,
    "reviewCount": 247,
    "badge": "GI Tagged",
    "isGITagged": true,
    "artisan": {
      "id": "art-001",
      "displayName": "Kartik Kumbhakar",
      "village": "Panchmura, Bankura",
      "photo": "https://...",
      "bio": "Kartik learned the craft...",
      "yearsExperience": 28,
      "craftGeneration": 4
    },
    "category": { "id": "horses", "name": "Bankura Horse", "slug": "horses" },
    "relatedProducts": [ ... ]
  }
}
```

---

### GET `/categories`
List all active categories.

---

## Orders

### POST `/orders` *(Requires auth)*
Create a new order.

**Body:**
```json
{
  "items": [
    { "productId": "bh-001", "qty": 1 },
    { "productId": "jw-001", "qty": 2 }
  ],
  "addressId": "addr-001",
  "couponCode": "PUJA20"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "orderId": "clxxxxx",
    "orderNumber": "ORD-2024-00042",
    "subtotal": 3297,
    "shippingFee": 0,
    "discount": 659,
    "total": 2638,
    "paymentOrderId": "order_xxxxxxxxx",  ← Razorpay order ID
    "currency": "INR"
  }
}
```

---

### GET `/orders` *(Requires auth)*
List current user's orders.

**Query Params:** `page`, `limit`, `status`

---

### GET `/orders/:id` *(Requires auth)*
Get single order detail including items, payment, and shipment.

---

### POST `/orders/:id/cancel` *(Requires auth)*
Cancel an order (only within 2 hours of placement and before dispatch).

**Body:** `{ "reason": "Changed my mind" }`

---

## Reviews

### POST `/reviews` *(Requires auth)*
Submit a product review.

**Body:**
```json
{
  "productId": "bh-001",
  "rating": 5,
  "title": "Exactly as described!",
  "body": "The quality is incredible. The horse is heavy and well-made..."
}
```

---

### GET `/products/:id/reviews`
Get reviews for a product.

**Query Params:** `page`, `limit`, `sortBy` (`newest` | `highest` | `helpful`)

---

## Wishlist

### GET `/wishlist` *(Requires auth)*
Get user's wishlist.

### POST `/wishlist/items` *(Requires auth)*
Add item to wishlist. **Body:** `{ "productId": "bh-001" }`

### DELETE `/wishlist/items/:productId` *(Requires auth)*
Remove item from wishlist.

---

## AI

### POST `/ai/search`
Convert natural language query to filter params.

**Body:** `{ "query": "cheap terracotta necklace under 500 rupees" }`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "filters": {
      "category": "jewelry",
      "minPrice": null,
      "maxPrice": 500,
      "sortBy": "price_asc",
      "keywords": "terracotta necklace"
    }
  }
}
```

---

### POST `/ai/chat`
Customer support chat.

**Body:**
```json
{
  "message": "Where is my order?",
  "conversationHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hello! How can I help you today?" }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reply": "I'd be happy to help you track your order! Could you please share your order number? It starts with ORD- and you can find it in your confirmation email."
  }
}
```

---

## Webhooks

### POST `/webhooks/razorpay`
Razorpay payment event webhook. **Not for client use.**

Handles: `payment.captured`, `payment.failed`, `refund.processed`

### POST `/webhooks/stripe`
Stripe payment event webhook. **Not for client use.**

---

## Error Codes

| HTTP Status | When |
|-------------|------|
| 400 | Bad request / validation error |
| 401 | Missing or invalid auth token |
| 403 | Insufficient permissions (e.g., non-admin accessing admin route) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate email, already reviewed) |
| 422 | Business rule violation (e.g., out of stock) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
