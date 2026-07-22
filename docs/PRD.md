# 📋 PRD — Product Requirements Document
## Mitti Kala — Bishnupur Terracotta E-Commerce Platform

**Version:** 1.0  
**Date:** 2024  
**Author:** Soumya  
**Status:** Active Development

---

## 1. Executive Summary

**Mitti Kala** is a premium direct-to-consumer e-commerce platform for authentic handcrafted terracotta products from Bishnupur, West Bengal. The platform connects master artisans of Panchmura and Bishnupur directly with buyers across India and globally, preserving a 400-year-old GI-tagged craft tradition while providing artisans with fair, sustainable income.

---

## 2. Problem Statement

| Problem | Impact |
|---------|--------|
| Artisans sell through middlemen, losing 40–60% margin | Artisans earn ₹200–400/day despite creating high-value pieces |
| No premium digital presence for Bishnupur craft | Craft is under-valued vs Rajasthani / Jaipur crafts online |
| Buyers can't verify authenticity or artisan identity | Trust gap — counterfeit terracotta floods Amazon/Flipkart |
| No international shipping infrastructure exists for local artisans | Diaspora market (UK, USA, UAE) is completely untapped |

---

## 3. Goals & Success Metrics

### Business Goals
- Onboard **50 artisans** within 6 months of launch
- Achieve **₹15 lakh GMV** in Month 1, **₹1 crore GMV** by Month 12
- Attain **4.7+ average product rating** across all listings
- Achieve **35% repeat purchase rate** within 90 days

### User Goals
- Buyer can discover, verify, and purchase authentic terracotta in < 3 minutes
- Artisan receives 70%+ of sale price (platform fee: 15%, logistics: 15%)
- Each purchase comes with a digital artisan story / certificate of authenticity

### Platform Goals
- Page Load < 2s on 4G (India mobile network average)
- 99.9% uptime SLA
- Support INR + USD + GBP payment currencies

---

## 4. Target Users

### Primary — Indian Buyers (B2C)
- **Urban collectors** (25–55): Interested in authentic Indian craft, home décor, gifting
- **Wedding / gifting buyers**: Premium return gifts, corporate hampers
- **Craft enthusiasts**: Actively seek GI-tagged, certified handmade goods

### Secondary — International Diaspora
- **NRI community** (USA, UK, UAE, Canada): Seeking Indian cultural items for home
- **International craft buyers**: Ethnographic collectors, museum gift shops

### Tertiary — Artisans (Supply side)
- Male/female artisans aged 25–65 in Bishnupur, Panchmura, Bankura
- Limited smartphone proficiency — requires simple artisan dashboard
- Language: Bengali primary, Hindi secondary

---

## 5. Feature Requirements

### 5.1 Core Features (MVP — Phase 1)

#### 🛒 E-Commerce Engine
- [ ] Product catalogue with categories, filters, and search
- [ ] Product detail page with image gallery, artisan bio, material info
- [ ] Shopping cart (persisted via localStorage)
- [ ] Checkout flow (address → payment → confirmation)
- [ ] Order tracking with real-time status updates
- [ ] Wishlist (guest + logged-in)

#### 👤 Authentication
- [ ] Email/password sign-up & login
- [ ] Google OAuth login
- [ ] OTP-based phone login (Indian users)
- [ ] Guest checkout (no forced registration)

#### 💳 Payments
- [ ] Razorpay integration (UPI, Cards, Net Banking, Wallets)
- [ ] Stripe integration (international cards)
- [ ] COD option (select pin codes)
- [ ] EMI on orders above ₹3,000

#### 🚚 Logistics
- [ ] Shiprocket API integration for domestic shipping
- [ ] DHL/FedEx for international orders
- [ ] Pin-code serviceability check at cart stage
- [ ] Automated tracking email/SMS on dispatch

#### 🏺 Product Content
- [ ] High-res product photography (3–6 images per product)
- [ ] Artisan story (name, village, years of experience, photo)
- [ ] Certificate of Authenticity (PDF, auto-generated per order)
- [ ] GI Tag badge display on eligible products

### 5.2 Enhanced Features (Phase 2)

- [ ] **AI-powered product recommendations** (based on browse + purchase history)
- [ ] **Virtual try-on** for jewellery (AR via phone camera)
- [ ] **Artisan live crafting sessions** (YouTube Live embed)
- [ ] **Custom order requests** (bespoke pieces from artisans)
- [ ] **Subscription box** (Quarterly curated terracotta box)
- [ ] **Corporate gifting portal** (bulk orders, custom branding)
- [ ] **Multilingual support** (English, Bengali, Hindi)

### 5.3 Admin & Artisan Features

- [ ] **Admin Dashboard**: Order management, inventory, payouts, analytics
- [ ] **Artisan Portal**: Add products, view earnings, track orders (Bengali UI)
- [ ] **Content CMS**: Blog, craft stories, festival collections
- [ ] **Coupon & Promotion Engine**: Discount codes, flash sales, bundles

---

## 6. User Flows

### 6.1 Discovery → Purchase Flow
```
Home → Category Browse → Product Page → Add to Cart 
→ Cart Review → Address Entry → Payment → Order Confirmation → Tracking
```

### 6.2 Artisan Onboarding Flow
```
Admin Invite → Artisan Registers (Bengali form) → Profile Created 
→ Products Listed by Admin (with artisan approval) → Products Live
```

### 6.3 Return / Refund Flow
```
Order Delivered → 7-day return window → Customer initiates return 
→ Pickup scheduled → Inspection → Refund to original payment method (3–5 days)
```

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page Load (LCP) | < 2.5s on 4G |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Lighthouse Score | > 90 (Performance, Accessibility, SEO) |
| Uptime | 99.9% |
| Mobile Responsive | 100% — mobile-first design |
| SEO | Structured data (Product, BreadcrumbList, Organization) |
| Accessibility | WCAG 2.1 AA compliant |
| Security | PCI DSS compliant (via Razorpay/Stripe hosted fields) |

---

## 8. Out of Scope (v1.0)

- Native mobile app (iOS / Android) — planned v2.0
- Auction / bidding system for rare pieces
- Artisan co-operative profit-sharing (v3.0)
- Physical QR code authentication tag on products

---

## 9. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Artisans don't adopt digital tools | High | High | Field agent support, Bengali UI, WhatsApp order notifications |
| Product photography quality | Medium | High | Partner with local photographer in Bishnupur |
| Logistics damage to fragile terracotta | Medium | High | Custom bubble-wrap + cardboard + foam packaging SOP |
| Payment fraud / chargebacks | Low | Medium | Razorpay fraud detection, manual review for large orders |
| Seasonal demand volatility | High | Medium | Festival collection planning (Puja, Diwali, Christmas) |

---

## 10. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 0 — Setup | Week 1–2 | Repo, CI/CD, design system, DB schema |
| Phase 1 — MVP | Week 3–8 | Core e-commerce, payments, auth, 50 products |
| Phase 2 — Enhance | Week 9–14 | AI recommendations, artisan portal, analytics |
| Phase 3 — Scale | Week 15–20 | International shipping, corporate gifting, mobile PWA |
| Phase 4 — Grow | Month 6+ | App, AR try-on, subscription box |
