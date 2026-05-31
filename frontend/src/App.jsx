import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageWrapper from './components/layout/PageWrapper';
import Spinner from './components/ui/Spinner';
import { ROUTES } from './constants/routes';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Addresses = lazy(() => import('./pages/Addresses'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route element={<PageWrapper />}>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.SHOP} element={<Shop />} />
                  <Route path={ROUTES.PRODUCT(':slug')} element={<ProductDetail />} />
                  <Route path={ROUTES.CART} element={<Cart />} />
                  <Route path={ROUTES.ABOUT} element={<About />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.PROFILE} element={<Profile />} />
                  <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
                  <Route path={ROUTES.ORDERS} element={<Orders />} />
                  <Route path={ROUTES.ORDER(':id')} element={<OrderDetail />} />
                  <Route path="/addresses" element={<Addresses />} />
                </Route>

                {/* Auth routes (no layout wrapper) */}
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

                {/* Protected routes */}
                <Route
                  path={ROUTES.CHECKOUT}
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Checkout />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ORDER_CONFIRMATION}
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <OrderConfirmation />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default App;
