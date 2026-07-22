# 🏗️ CODE_ARCHITECTURE.md — Frontend Code Architecture
## Mitti Kala — React + Vite + Tailwind

---

## 1. Frontend Directory Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── manifest.json          # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   ├── fonts/             # Self-hosted Cormorant Garamond + DM Sans
│   │   ├── images/            # Static images (logos, placeholders)
│   │   └── icons/             # Custom SVG icons
│   │
│   ├── components/
│   │   ├── ui/                # Primitive, reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Drawer.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Rating.jsx
│   │   │   └── Spinner.jsx
│   │   │
│   │   ├── layout/            # Layout-level components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   └── CartDrawer.jsx
│   │   │
│   │   ├── home/              # Homepage sections
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── ArtisanSpotlight.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── Newsletter.jsx
│   │   │
│   │   ├── product/           # Product-related components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductSort.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   ├── ProductMeta.jsx
│   │   │   ├── ArtisanBio.jsx
│   │   │   ├── RelatedProducts.jsx
│   │   │   └── ReviewSection.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── EmptyCart.jsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── AddressForm.jsx
│   │   │   ├── AddressCard.jsx
│   │   │   ├── PaymentSection.jsx
│   │   │   └── OrderSummary.jsx
│   │   │
│   │   ├── order/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   └── TrackingMap.jsx
│   │   │
│   │   └── shared/
│   │       ├── AnimateIn.jsx          # Scroll-triggered animation wrapper
│   │       ├── ImageWithFallback.jsx  # Cloudinary image + skeleton fallback
│   │       ├── SEOHead.jsx            # React Helmet Async wrapper
│   │       ├── ErrorBoundary.jsx
│   │       ├── EmptyState.jsx
│   │       └── SupportChat.jsx        # AI customer support widget
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx             # Catalogue + filters
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Orders.jsx           # Order history
│   │   ├── OrderDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Wishlist.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   └── NotFound.jsx
│   │
│   ├── hooks/
│   │   ├── useInView.js         # Scroll-triggered visibility
│   │   ├── useNavScroll.js      # Navbar scroll state
│   │   ├── useCountUp.js        # Animated number counters
│   │   ├── useCart.js           # Access CartContext
│   │   ├── useAuth.js           # Access AuthContext
│   │   ├── useWishlist.js       # Wishlist toggle + state
│   │   ├── useToast.js          # Toast notification helper
│   │   └── useMediaQuery.js     # Responsive breakpoint helper
│   │
│   ├── context/
│   │   ├── CartContext.jsx      # Cart state (items, open/close)
│   │   └── AuthContext.jsx      # User auth state
│   │
│   ├── store/
│   │   └── cartStore.js         # Zustand store with persistence
│   │
│   ├── services/
│   │   ├── api.js               # Axios instance + interceptors
│   │   ├── auth.service.js      # Auth API calls
│   │   ├── product.service.js   # Product API calls
│   │   ├── order.service.js     # Order API calls
│   │   ├── review.service.js    # Review API calls
│   │   └── ai.service.js        # AI feature API calls
│   │
│   ├── data/
│   │   └── products.js          # Static mock data (dev only)
│   │
│   ├── utils/
│   │   ├── formatPrice.js       # INR formatter
│   │   ├── formatDate.js
│   │   ├── validators.js        # Zod schemas for forms
│   │   └── cn.js                # clsx + tailwind-merge helper
│   │
│   ├── constants/
│   │   ├── routes.js            # Route path constants
│   │   ├── queryKeys.js         # TanStack Query cache keys
│   │   └── config.js            # App-wide config values
│   │
│   ├── styles/
│   │   ├── globals.css          # @tailwind directives + custom CSS
│   │   └── fonts.css            # @font-face declarations
│   │
│   ├── App.jsx                  # Router + Providers
│   └── main.jsx                 # React DOM render
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 2. Routing Architecture

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider }   from './context/CartContext';
import { AuthProvider }   from './context/AuthContext';
import PageWrapper        from './components/layout/PageWrapper';
import { ROUTES }         from './constants/routes';

// Lazy-loaded pages for code splitting
const Home             = lazy(() => import('./pages/Home'));
const Shop             = lazy(() => import('./pages/Shop'));
const ProductDetail    = lazy(() => import('./pages/ProductDetail'));
const Checkout         = lazy(() => import('./pages/Checkout'));
const Orders           = lazy(() => import('./pages/Orders'));
const Profile          = lazy(() => import('./pages/Profile'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry:     1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route element={<PageWrapper />}>
                  <Route path={ROUTES.HOME}              element={<Home />} />
                  <Route path={ROUTES.SHOP}              element={<Shop />} />
                  <Route path={ROUTES.PRODUCT(':slug')}  element={<ProductDetail />} />
                  <Route path={ROUTES.CART}              element={<Cart />} />
                  <Route path={ROUTES.ABOUT}             element={<About />} />
                  <Route path={ROUTES.CONTACT}           element={<Contact />} />
                </Route>
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<PageWrapper />}>
                    <Route path={ROUTES.CHECKOUT}        element={<Checkout />} />
                    <Route path={ROUTES.ORDERS}          element={<Orders />} />
                    <Route path={ROUTES.ORDER(':id')}    element={<OrderDetail />} />
                    <Route path={ROUTES.PROFILE}         element={<Profile />} />
                    <Route path={ROUTES.WISHLIST}        element={<Wishlist />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

## 3. API Layer Pattern

```js
// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  timeout:         10000,
  withCredentials: true, // For HttpOnly refresh token cookie
});

let accessToken = null; // In-memory only (not localStorage)

export function setAccessToken(token) { accessToken = token; }
export function clearAccessToken()    { accessToken = null;  }

// Attach access token to every request
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        clearAccessToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// src/services/product.service.js
export const productService = {
  list:       (params) => api.get('/products', { params }).then(r => r.data),
  getById:    (id)     => api.get(`/products/${id}`).then(r => r.data),
  getFeatured:()       => api.get('/products/featured').then(r => r.data),
  search:     (q)      => api.get('/products/search', { params: { q } }).then(r => r.data),
};
```

---

## 4. Data Fetching Pattern (TanStack Query)

```jsx
// src/pages/Shop.jsx — data fetching pattern
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { productService } from '../services/product.service';

export default function Shop() {
  const [filters, setFilters] = useState({
    category: null, sortBy: 'newest', page: 1
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn:  () => productService.list(filters),
    keepPreviousData: true, // Smooth pagination
  });

  // ...
}

// src/constants/queryKeys.js
export const QUERY_KEYS = {
  PRODUCTS:  'products',
  PRODUCT:   'product',
  ORDERS:    'orders',
  ARTISANS:  'artisans',
  REVIEWS:   'reviews',
  USER:      'user',
};
```

---

## 5. Form Validation Pattern (React Hook Form + Zod)

```js
// src/utils/validators.js
import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone:    z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  line1:    z.string().min(5, 'Address must be at least 5 characters'),
  line2:    z.string().optional(),
  city:     z.string().min(2),
  state:    z.string().min(2),
  pincode:  z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
});

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title:  z.string().max(100).optional(),
  body:   z.string().min(20, 'Review must be at least 20 characters').max(1000),
});
```

---

## 6. Animation System Summary

```
All animations follow 3 rules:
1. Only animate `transform` and `opacity` (GPU compositing, no layout thrash)
2. Respect `prefers-reduced-motion` — show content immediately if reduced motion
3. Use IntersectionObserver via useInView hook for scroll triggers

Animation delay pattern for staggered reveals:
  delay={0}    → first element
  delay={100}  → second element (100ms later)
  delay={200}  → third element
  ...

Usage:
  <AnimateIn variant="fade-up" delay={0}>
    <ProductCard ... />
  </AnimateIn>
```

---

## 7. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductCard.jsx` |
| Hooks | camelCase, `use` prefix | `useInView.js` |
| Services | camelCase, `.service.js` | `product.service.js` |
| Contexts | PascalCase + Context suffix | `CartContext.jsx` |
| Stores | camelCase + Store suffix | `cartStore.js` |
| CSS classes | kebab-case (Tailwind utilities) | `text-terracotta-500` |
| Constants | SCREAMING_SNAKE_CASE | `QUERY_KEYS.PRODUCTS` |
| Route paths | kebab-case | `/product-detail/:slug` |
