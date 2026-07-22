# 🧪 TESTING.md — Testing Strategy & Guide
## Mitti Kala

---

## 1. Testing Pyramid

```
         ╔══════════╗
         ║  E2E     ║  ← 10% — Critical user journeys
         ║ (Cypress) ║
         ╠══════════╣
         ║Integration║  ← 30% — API routes, DB interactions
         ║  (Vitest) ║
         ╠══════════╣
         ║   Unit    ║  ← 60% — Services, utils, hooks, components
         ║  (Vitest) ║
         ╚══════════╝
```

---

## 2. Frontend Testing

### Setup
```bash
# Install
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# vite.config.js test config
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  }
});

# src/test/setup.js
import '@testing-library/jest-dom';
```

### Unit Tests — Hooks

```js
// src/hooks/__tests__/useCountUp.test.js
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../useCountUp';

describe('useCountUp', () => {
  it('starts at 0 when start is false', () => {
    const { result } = renderHook(() => useCountUp(1000, false));
    expect(result.current).toBe('0');
  });

  it('returns formatted target value after animation completes', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountUp(500, true, 100));
    act(() => vi.advanceTimersByTime(150));
    expect(result.current).toBe('500');
    vi.useRealTimers();
  });
});
```

### Unit Tests — Cart Context

```js
// src/context/__tests__/CartContext.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../CartContext';
import { useCart }      from '../../hooks/useCart';

const MockConsumer = () => {
  const { items, addItem, totalItems, totalPrice } = useCart();
  return (
    <div>
      <span data-testid="count">{totalItems}</span>
      <span data-testid="total">{totalPrice}</span>
      <button onClick={() => addItem({ id: 'p1', price: 1899, name: 'Horse' })}>
        Add
      </button>
    </div>
  );
};

const Wrapped = () => <CartProvider><MockConsumer /></CartProvider>;

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(<Wrapped />);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('adds item correctly', () => {
    render(<Wrapped />);
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('1899');
  });

  it('stacks qty for same product', () => {
    render(<Wrapped />);
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });
});
```

### Unit Tests — Utils

```js
// src/utils/__tests__/formatPrice.test.js
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  it('formats INR correctly', () => {
    expect(formatPrice(1899)).toBe('₹1,899');
    expect(formatPrice(10000)).toBe('₹10,000');
    expect(formatPrice(1500000)).toBe('₹15,00,000');  // Indian lakh format
  });
});
```

### Component Tests

```jsx
// src/components/product/__tests__/ProductCard.test.jsx
import { render, screen }  from '@testing-library/react';
import userEvent            from '@testing-library/user-event';
import { BrowserRouter }    from 'react-router-dom';
import ProductCard          from '../ProductCard';
import { CartProvider }     from '../../../context/CartContext';

const mockProduct = {
  id: 'bh-001',
  name: 'Classic Bankura Horse',
  price: 1899,
  originalPrice: 2400,
  primaryImage: '/test-image.jpg',
  rating: 4.9,
  reviewCount: 247,
  inStock: true,
  badge: 'GI Tagged',
  artisan: { displayName: 'Kartik Kumbhakar' },
  slug: 'classic-bankura-horse',
};

const Wrapped = ({ product = mockProduct }) => (
  <BrowserRouter>
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  </BrowserRouter>
);

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<Wrapped />);
    expect(screen.getByText('Classic Bankura Horse')).toBeInTheDocument();
    expect(screen.getByText('₹1,899')).toBeInTheDocument();
  });

  it('shows badge when present', () => {
    render(<Wrapped />);
    expect(screen.getByText('GI Tagged')).toBeInTheDocument();
  });

  it('shows discount percentage', () => {
    render(<Wrapped />);
    expect(screen.getByText(/21%/)).toBeInTheDocument();
  });

  it('shows out of stock state', () => {
    render(<Wrapped product={{ ...mockProduct, inStock: false }} />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('adds to cart on button click', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    // Cart badge should appear
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

---

## 3. Backend Testing

### Setup
```bash
npm install -D vitest supertest @prisma/client

# Use a separate test database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mittikala_test"
```

### Unit Tests — Services

```js
// src/services/__tests__/auth.service.test.js
import { describe, it, expect, vi } from 'vitest';
import { hashPassword, comparePassword, generateOTP } from '../auth.service';

describe('hashPassword', () => {
  it('returns a hash different from the plain text', async () => {
    const hash = await hashPassword('mypassword');
    expect(hash).not.toBe('mypassword');
    expect(hash.length).toBeGreaterThan(20);
  });
});

describe('comparePassword', () => {
  it('returns true for matching password', async () => {
    const hash = await hashPassword('test123');
    expect(await comparePassword('test123', hash)).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const hash = await hashPassword('test123');
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});
```

### Integration Tests — API Routes

```js
// src/routes/__tests__/product.routes.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app       from '../../app';
import { prisma } from '../../config/db';

const request = supertest(app);

describe('GET /api/products', () => {
  it('returns 200 with products list', async () => {
    const res = await request.get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('filters by category', async () => {
    const res = await request.get('/api/products?category=horses');
    expect(res.status).toBe(200);
    res.body.data.items.forEach(p => {
      expect(p.category.slug).toBe('horses');
    });
  });

  it('filters by price range', async () => {
    const res = await request.get('/api/products?minPrice=500&maxPrice=1000');
    expect(res.status).toBe(200);
    res.body.data.items.forEach(p => {
      expect(p.price).toBeGreaterThanOrEqual(500);
      expect(p.price).toBeLessThanOrEqual(1000);
    });
  });

  it('returns 400 for invalid sortBy', async () => {
    const res = await request.get('/api/products?sortBy=invalid');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/products/:id', () => {
  it('returns 200 with product detail', async () => {
    // Get a real product ID from test DB
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    const res = await request.get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(product.id);
  });

  it('returns 404 for unknown ID', async () => {
    const res = await request.get('/api/products/non-existent-id');
    expect(res.status).toBe(404);
  });
});
```

---

## 4. E2E Tests (Cypress)

```bash
npm install -D cypress
npx cypress open
```

### Critical User Journeys to Test

```js
// cypress/e2e/checkout.cy.js
describe('Purchase Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a full purchase journey', () => {
    // 1. Browse to product
    cy.get('[data-testid="nav-shop"]').click();
    cy.get('[data-testid="product-card"]').first().click();

    // 2. Add to cart
    cy.get('[data-testid="add-to-cart-btn"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');

    // 3. Open cart drawer
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-drawer"]').should('be.visible');

    // 4. Proceed to checkout
    cy.get('[data-testid="checkout-btn"]').click();

    // 5. Login (if not already)
    cy.login('test@example.com', 'TestPass123');

    // 6. Fill address
    cy.get('[name="fullName"]').type('Test User');
    cy.get('[name="phone"]').type('9876543210');
    cy.get('[name="line1"]').type('123 Test Street');
    cy.get('[name="city"]').type('Kolkata');
    cy.get('[name="state"]').type('West Bengal');
    cy.get('[name="pincode"]').type('700001');
    cy.get('[data-testid="save-address-btn"]').click();

    // 7. Confirm order (test mode — no actual payment)
    cy.get('[data-testid="place-order-btn"]').click();

    // 8. Verify confirmation
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid="order-number"]').should('contain', 'ORD-');
  });
});
```

---

## 5. Running Tests

```bash
# Frontend unit + component tests
cd frontend
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report

# Backend unit + integration tests
cd backend
npm run test
npm run test:watch

# E2E tests (requires dev servers running)
cd frontend
npm run test:e2e       # Headless
npm run test:e2e:open  # Interactive

# All tests (CI)
npm run test:ci
```

---

## 6. Coverage Targets

| Layer | Target |
|-------|--------|
| Frontend utils | 90% |
| Frontend hooks | 80% |
| Frontend components | 70% |
| Backend services | 85% |
| Backend routes | 80% |
| E2E critical paths | 100% (all listed journeys pass) |
