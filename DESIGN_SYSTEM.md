# 🎨 DESIGN_SYSTEM.md — Design System & Visual Language
## Mitti Kala — Artisan Luxury Aesthetic

---

## 1. Brand Identity

**Brand Essence:** *Maati ki mahak, haath ki kala* (The scent of earth, the art of hands)

**Personality:** Premium · Rooted · Authentic · Warm · Cultural Pride

**Tone of Voice:** Like a knowledgeable friend who has lived in both Kolkata and London — fluent in premium language, but never pretentious. Warm, specific, proud.

**Anti-personality:** Generic · Mass-produced · Corporate · Garish

---

## 2. Color Palette

### Primary Colors
```
Terracotta 500   #c4622d   — Primary brand, CTAs, active states
Terracotta 400   #e07b54   — Hover states, highlights
Terracotta 300   #eca07a   — Light accents on dark backgrounds
Terracotta 900   #3d1f0f   — Deep brown for text on light BG
```

### Background Colors
```
Cream 100   #faf7f2   — Primary page background
Cream 200   #f5efe6   — Card backgrounds, sections
Cream 300   #ecddd0   — Borders, dividers
Cream 400   #dfc9b6   — Strong borders
```

### Accent Colors
```
Gold 400   #d4a857   — Premium badge, highlights
Gold 500   #c9a84c   — Gold accent (use sparingly)
Gold 600   #b8962e   — Darker gold for text on light
```

### Text Colors
```
Stone 900   #1a0f07   — Primary body text
Stone 700   #4a3728   — Secondary text
Stone 500   #8a7567   — Muted / caption text
Stone 200   #e5ddd5   — Light border on dark BG
```

### Semantic Colors
```
Success   #16a34a   — Order confirmed, in stock
Warning   #d97706   — Low stock, caution
Error     #dc2626   — Out of stock, errors
Info      #0284c7   — Informational messages
```

### ❌ Colors NEVER used
```
Purple any shade   — associated with cosmetics / tech startups
Orange #ff6b00      — too garish for premium
Neon any shade      — cheap / digital-only feel
Rainbow gradients   — no
Pure white #ffffff  — too cold; use cream-100 instead
Pure black #000000  — too harsh; use stone-900
```

---

## 3. Typography

### Font Stack

| Role | Font | Weight | Use |
|------|------|--------|-----|
| Display / Headlines | Cormorant Garamond | 400, 600, 700 | Page titles, hero, section headings |
| Body / UI | DM Sans | 300, 400, 500 | Body copy, buttons, nav, labels |

### Loading Strategy
```css
/* Self-hosted for performance — in src/styles/fonts.css */

@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
```

### Type Scale
```
Hero Display : clamp(3rem, 9vw, 7.5rem) / line-height 0.95 / Cormorant Garamond 700
Page Title   : clamp(2.5rem, 6vw, 5rem) / line-height 1.05 / Cormorant Garamond 600
Section H2   : clamp(1.8rem, 4vw, 3rem) / line-height 1.1  / Cormorant Garamond 600
Card Title   : 1.25rem (20px)           / line-height 1.3  / Cormorant Garamond 600
Body Large   : 1.125rem (18px)          / line-height 1.7  / DM Sans 400
Body         : 1rem (16px)              / line-height 1.6  / DM Sans 400
Body Small   : 0.875rem (14px)          / line-height 1.5  / DM Sans 400
Caption      : 0.75rem (12px)           / line-height 1.4  / DM Sans 500
Eyebrow      : 0.65rem (10.4px) uppercase tracking-[0.2em] / DM Sans 500
```

---

## 4. Spacing System

Based on 4px base unit:
```
4   →  1 (0.25rem)
8   →  2 (0.5rem)
12  →  3 (0.75rem)
16  →  4 (1rem)
20  →  5 (1.25rem)
24  →  6 (1.5rem)
32  →  8 (2rem)
40  → 10 (2.5rem)
48  → 12 (3rem)
64  → 16 (4rem)
80  → 20 (5rem)
96  → 24 (6rem)
112 → 28 (7rem)   ← section padding (mobile)
160 → 40 (10rem)  ← section padding (desktop)
```

---

## 5. Component Tokens

### Buttons
```
Primary Button:
  bg: terracotta-500   text: white
  hover: terracotta-400  / -translate-y-0.5 / shadow-warm-lg
  active: terracotta-600
  radius: rounded-full
  padding: px-8 py-4
  font: DM Sans 500 text-sm tracking-wide

Ghost Button:
  bg: transparent   border: cream-100/25   text: cream-100
  hover: bg-white/5 border-cream-100/50
  (for use on dark backgrounds)

Outlined Button:
  bg: transparent   border: terracotta-300   text: terracotta-500
  hover: bg-terracotta-50
```

### Cards
```
Product Card:
  bg: white / cream-100
  radius: rounded-2xl (16px)
  shadow: shadow-warm-sm → shadow-warm-lg (on hover)
  hover: -translate-y-1 (transform only)
  transition: all 350ms ease-spring

Section Card (artisan, testimonial):
  bg: cream-200
  radius: rounded-3xl (24px)
  padding: p-8
```

### Badges
```
GI Tagged:    bg-amber-50    text-amber-700    border-amber-200
Best Seller:  bg-terracotta-50  text-terracotta-600  border-terracotta-200
Limited:      bg-stone-800   text-cream-100   (dark badge)
Premium:      bg-gold-500/10 text-gold-600    border-gold-400/30
Trending:     bg-cream-200   text-stone-700   border-stone-200
```

### Inputs
```
Border:  cream-300 → terracotta-400 (focus)
Radius:  rounded-xl (12px)
Padding: px-4 py-3
Font:    DM Sans 400 text-sm
Error:   border-red-400 + helper text in red-600
```

---

## 6. Iconography

**Library:** Lucide React (consistent stroke-width: 1.5)

**Custom icons needed:**
- Bankura Horse silhouette (brand icon)
- Terracotta texture stamp (decorative)
- Lotus motif (section divider)
- GI Tag badge icon

**Usage rules:**
- Always use stroke, not fill (except for filled star ratings)
- Size: 16px (small), 20px (default), 24px (large)
- Never mix icon styles within one component

---

## 7. Layout Grid

```
Max container width: 1280px (max-w-7xl)
Container padding:   px-6 (mobile) → px-10 (desktop)

Grid columns:
  Product grid: 1 col (mobile) → 2 col (sm) → 3 col (lg) → 4 col (xl)
  Content grid: 12 column base
  Section spacing: section (py-28 desktop) / py-16 (mobile)
```

---

## 8. Motion Design

### Principles
1. **Purposeful** — Motion conveys state change, not decoration
2. **Performance** — Only animate `transform` and `opacity`
3. **Accessible** — Respect `prefers-reduced-motion`
4. **Natural** — Use spring easing, not linear

### Easing Curves
```
Spring  : cubic-bezier(0.22, 1, 0.36, 1)   ← UI elements entering
Smooth  : cubic-bezier(0.4, 0, 0.2, 1)     ← Standard transitions
Ease-out: cubic-bezier(0, 0, 0.2, 1)       ← Dismissals, exits
```

### Duration Scale
```
Instant    :  0ms    — no transition (toggle states)
Fast       : 150ms   — hover colour changes
Normal     : 300ms   — nav, modals, tooltips
Slow       : 500ms   — page transitions, drawers
Very Slow  : 700ms   — hero animations, scroll reveals
Stagger gap: 80–100ms per item
```

### Animation Library (Tailwind keyframes)
```
fade-up      : opacity 0→1, translateY 28px→0     (scroll reveals)
fade-in      : opacity 0→1                         (elements appearing)
slide-left   : opacity 0→1, translateX 40px→0     (from right)
slide-right  : opacity 0→1, translateX -40px→0    (from left)
scale-in     : opacity 0→1, scale 0.92→1          (modals, cards)
shimmer      : skeleton loading effect
float        : translateY 0 ↔ -10px               (hero elements)
```

---

## 9. Photography Style

### Product Photography
- **Background:** Cream/ivory muslin OR warm wood/terracotta tile surface
- **Lighting:** Soft natural light, warm tones (no cool/blue tints)
- **Angles:** Hero (3/4 angle), Detail (macro texture), Context (styled in a room)
- **Minimum images per product:** 3 (hero, detail, context)
- **Format:** WebP, minimum 1200×1200px, max 400KB after Cloudinary compression

### Artisan Photography
- **Setting:** In their workshop, mid-craft (not posed against a plain wall)
- **Lighting:** Natural workshop light, warm
- **Style:** Documentary / editorial — not stock photography

### Lifestyle Photography
- **Settings:** Indian middle-class / upper-middle-class home interiors
- **Palette:** Cream, jute, wood, plants — no overly sterile modern interiors
- **People:** Diverse Indian faces

---

## 10. UI Patterns

### Empty States
- Illustration (simple SVG of Bankura horse or lotus)
- Warm headline: "Nothing here yet..."
- Sub-text with clear next action
- Primary CTA button

### Loading States
- Skeleton screens (animated shimmer) — NOT spinners for content
- Spinner only for button loading states (checkout, add to cart)
- Skeleton: rounded shapes in cream-300/400 tones

### Error States
- Friendly, non-technical language
- Always provide a clear recovery path
- Use terracotta-50 background with terracotta-600 icon for warnings
- Use red-50 background only for destructive/critical errors

### Toast Notifications
- Bottom-right on desktop, bottom-center on mobile
- Success: green-50 + green-700 text
- Error: red-50 + red-700 text
- Auto-dismiss after 4 seconds
- Manual close available
