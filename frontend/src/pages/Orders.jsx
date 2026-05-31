import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { orderService } from '../services/product.service';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/order/OrderCard';
import { cn } from '../utils/cn';

export default function Orders() {
  const { isAuthenticated, loading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: () => orderService.list({ page: 1, limit: 50 }),
    enabled: isAuthenticated,
  });

  const orders = data?.items || [];

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-cream-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="mb-8">
          <h1 className="mb-2">My Orders</h1>
          <p className="text-stone-600">
            Track and manage your orders
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-cream-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-stone-600 mb-4">Failed to load orders. Please try again.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-stone-400" />
            </div>
            <h2 className="text-2xl mb-3">No orders yet</h2>
            <p className="text-stone-600 mb-8">
              When you place an order, it will appear here.
            </p>
            <Link to="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
