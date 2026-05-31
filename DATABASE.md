# 🗄️ DATABASE.md — Database Schema & Design
## Mitti Kala — PostgreSQL + Prisma

---

## 1. Overview

**Database:** PostgreSQL 16  
**ORM:** Prisma 5  
**Hosting:** Railway (prod) / Neon (dev/staging)  
**Naming Convention:** `snake_case` for tables/columns, `PascalCase` for Prisma models

---

## 2. Entity Relationship Diagram (Text)

```
User ──────────────┬───── Order (1:many)
                   ├───── Review (1:many)
                   ├───── Wishlist (1:many)
                   └───── Address (1:many)

Artisan ───────────┬───── Product (1:many)
                   └───── ArtisanProfile (1:1)

Category ──────────┬───── Product (1:many)

Product ───────────┬───── OrderItem (1:many)
                   ├───── Review (1:many)
                   ├───── ProductImage (1:many)
                   ├───── WishlistItem (1:many)
                   └───── Category (many:1)

Order ─────────────┬───── OrderItem (1:many)
                   ├───── Address (many:1, snapshot)
                   ├───── Payment (1:1)
                   └───── Shipment (1:1)
```

---

## 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────────────────────

enum Role {
  CUSTOMER
  ARTISAN
  ADMIN
}

enum OrderStatus {
  PENDING
  PAYMENT_CONFIRMED
  PROCESSING
  PACKED
  DISPATCHED
  DELIVERED
  CANCELLED
  RETURN_INITIATED
  RETURN_PICKED_UP
  REFUNDED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentGateway {
  RAZORPAY
  STRIPE
  COD
}

enum ShipmentStatus {
  NOT_SHIPPED
  BOOKED
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  FAILED
  RETURNED
}

// ─── User ─────────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  passwordHash  String?
  name          String?
  avatar        String?
  role          Role      @default(CUSTOMER)
  emailVerified Boolean   @default(false)
  phoneVerified Boolean   @default(false)
  googleId      String?   @unique

  // Relations
  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  wishlists     Wishlist[]
  artisanProfile ArtisanProfile?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

// ─── Address ──────────────────────────────────────────────────────────────────

model Address {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  label      String? // "Home", "Work", etc.
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  state      String
  pincode    String
  country    String  @default("India")
  isDefault  Boolean @default(false)

  orders     Order[]

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("addresses")
}

// ─── Artisan ──────────────────────────────────────────────────────────────────

model ArtisanProfile {
  id               String   @id @default(cuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id])

  displayName      String
  bio              String?  @db.Text
  village          String
  district         String   @default("Bankura")
  state            String   @default("West Bengal")
  photo            String?  // Cloudinary URL
  yearsExperience  Int?
  speciality       String?
  craftGeneration  Int?     // How many generations of craft?
  isVerified       Boolean  @default(false)
  instagramHandle  String?

  products         Product[]

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@map("artisan_profiles")
}

// ─── Category ─────────────────────────────────────────────────────────────────

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  icon        String?
  description String?
  imageUrl    String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)

  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

// ─── Product ──────────────────────────────────────────────────────────────────

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String   @db.Text
  shortDesc       String?

  // Pricing
  price           Int      // In paise (e.g., 189900 = ₹1899)
  originalPrice   Int?
  currency        String   @default("INR")

  // Classification
  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id])
  badge           String?  // "GI Tagged", "Best Seller", etc.

  // Artisan
  artisanId       String?
  artisan         ArtisanProfile? @relation(fields: [artisanId], references: [id])

  // Physical details
  material        String?
  dimensions      String?
  weight          String?  // Human readable: "1.2 kg"
  weightGrams     Int?     // For shipping calculation

  // Inventory
  inStock         Boolean  @default(true)
  stock           Int      @default(0)
  sku             String?  @unique

  // Visibility
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  isGITagged      Boolean  @default(false)

  // SEO
  metaTitle       String?
  metaDescription String?

  // Search vector (auto-updated via trigger)
  searchVector    Unsupported("tsvector")?

  // Relations
  images          ProductImage[]
  orderItems      OrderItem[]
  reviews         Review[]
  wishlistItems   WishlistItem[]

  // AI-generated fields
  aiDescription   String?  @db.Text  // AI-generated version, pending admin approval
  aiApproved      Boolean  @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([categoryId])
  @@index([artisanId])
  @@index([isActive, isFeatured])
  @@index([searchVector], type: Gin)
  @@map("products")
}

// ─── ProductImage ─────────────────────────────────────────────────────────────

model ProductImage {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  url         String  // Cloudinary URL
  publicId    String  // Cloudinary public_id for deletion
  altText     String?
  sortOrder   Int     @default(0)
  isPrimary   Boolean @default(false)

  createdAt   DateTime @default(now())

  @@map("product_images")
}

// ─── Order ────────────────────────────────────────────────────────────────────

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // ORD-2024-00001

  userId          String
  user            User        @relation(fields: [userId], references: [id])

  status          OrderStatus @default(PENDING)

  // Address snapshot (copied at order time, immutable)
  addressId       String?
  address         Address?    @relation(fields: [addressId], references: [id])
  shippingSnapshot Json       // Full address JSON at time of order

  // Pricing
  subtotal        Int         // Sum of items (paise)
  shippingFee     Int         @default(0)
  discount        Int         @default(0)
  total           Int         // Final amount charged

  couponCode      String?

  // Notes
  customerNote    String?
  adminNote       String?
  cancellationReason String?

  // Relations
  items           OrderItem[]
  payment         Payment?
  shipment        Shipment?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([status])
  @@map("orders")
}

// ─── OrderItem ────────────────────────────────────────────────────────────────

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId   String
  product     Product @relation(fields: [productId], references: [id])

  // Snapshot at time of order (product may change later)
  productName String
  productImage String
  artisanName String?
  unitPrice   Int     // In paise
  qty         Int
  total       Int     // unitPrice * qty

  @@map("order_items")
}

// ─── Payment ──────────────────────────────────────────────────────────────────

model Payment {
  id                String         @id @default(cuid())
  orderId           String         @unique
  order             Order          @relation(fields: [orderId], references: [id])

  gateway           PaymentGateway
  status            PaymentStatus  @default(PENDING)

  gatewayOrderId    String?        // Razorpay order_id / Stripe PaymentIntent id
  gatewayPaymentId  String?        // Razorpay payment_id
  gatewaySignature  String?        // Razorpay signature

  amount            Int            // In paise
  currency          String         @default("INR")

  refundId          String?
  refundAmount      Int?
  refundReason      String?
  refundedAt        DateTime?

  metadata          Json?

  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  @@map("payments")
}

// ─── Shipment ─────────────────────────────────────────────────────────────────

model Shipment {
  id              String         @id @default(cuid())
  orderId         String         @unique
  order           Order          @relation(fields: [orderId], references: [id])

  status          ShipmentStatus @default(NOT_SHIPPED)
  courier         String?        // "Delhivery", "BlueDart", etc.
  trackingId      String?
  trackingUrl     String?

  shiprocketOrderId String?

  estimatedDelivery DateTime?
  deliveredAt       DateTime?
  pickedUpAt        DateTime?

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@map("shipments")
}

// ─── Review ───────────────────────────────────────────────────────────────────

model Review {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id])

  userId      String
  user        User    @relation(fields: [userId], references: [id])

  rating      Int     // 1–5
  title       String?
  body        String? @db.Text
  images      String[] // Array of Cloudinary URLs

  isVerifiedPurchase Boolean @default(false)
  isApproved         Boolean @default(false)  // Admin moderation
  helpfulCount       Int     @default(0)

  aiSummaryUsed      Boolean @default(false)  // Whether this review contributed to AI summary

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, productId])  // One review per user per product
  @@index([productId])
  @@map("reviews")
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

model Wishlist {
  id        String         @id @default(cuid())
  userId    String
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String         @default("Saved Items")
  items     WishlistItem[]

  createdAt DateTime       @default(now())

  @@map("wishlists")
}

model WishlistItem {
  id         String   @id @default(cuid())
  wishlistId String
  wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)

  productId  String
  product    Product  @relation(fields: [productId], references: [id])

  addedAt    DateTime @default(now())

  @@unique([wishlistId, productId])
  @@map("wishlist_items")
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

model Coupon {
  id              String   @id @default(cuid())
  code            String   @unique @db.VarChar(32)
  description     String?

  discountType    String   // "PERCENT" | "FLAT"
  discountValue   Int      // Percent (0–100) or flat amount in paise

  minOrderValue   Int?     // Minimum order total to apply
  maxDiscount     Int?     // Cap for percentage discounts (paise)

  usageLimit      Int?     // Total times this coupon can be used
  usageCount      Int      @default(0)
  perUserLimit    Int      @default(1)

  validFrom       DateTime?
  validUntil      DateTime?
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())

  @@map("coupons")
}
```

---

## 4. Key Indexes

```sql
-- Full-text search on products
CREATE INDEX products_search_idx ON products USING GIN (search_vector);

-- Auto-update search_vector trigger
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.material, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_search
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Additional performance indexes
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX reviews_product_id_idx ON reviews(product_id);
```

---

## 5. Seed Data (Development)

```bash
# Run seed
npx prisma db seed

# Seed creates:
# - 5 categories (horses, idols, panels, jewelry, decor)
# - 3 artisan profiles
# - 15 sample products with images
# - 2 admin users
# - 5 test customer users
# - 3 test orders in various states
```

---

## 6. Migrations

```bash
# Development
npx prisma migrate dev --name "init"

# Production
npx prisma migrate deploy

# Generate client after schema change
npx prisma generate
```
