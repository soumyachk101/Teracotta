import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { orderService } from '../services/product.service';
import { useAuth } from '../context/AuthContext';
import OrderTimeline from '../components/order/OrderTimeline';
import { formatPrice } from '../utils/formatPrice';
import { cn } from '../utils/cn';

export default function OrderDetail() {
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ORDER, id],
    queryFn: () => orderService.getById(id),
    enabled: isAuthenticated && !!id,
  });

  const order = data;

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-cream-200 rounded w-1/4" />
            <div className="h-64 bg-cream-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isError || !order) {
    return (
      <div className="section">
        <div className="container text-center py-20">
          <h2 className="text-2xl mb-4">Order Not Found</h2>
          <p className="text-stone-600 mb-8">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link to="/orders" className="btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="section">
      <div className="container">
        {/* Back button */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-terracotta-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="mb-1">Order #{order.orderNumber}</h1>
            <p className="text-stone-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
              order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
              'bg-amber-50 text-amber-600'
            )}>
              <Package className="h-4 w-4" />
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card-section">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 last:pb-0 border-b last:border-b-0 border-cream-300">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-900">{item.productName}</h4>
                      {item.artisanName && (
                        <p className="text-sm text-stone-500">by {item.artisanName}</p>
                      )}
                      <p className="text-sm text-stone-500 mt-1">
                        {formatPrice(item.unitPrice)} × {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900">{formatPrice(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card-section">
              <h2 className="font-semibold text-lg mb-4">Tracking Status</h2>
              {order.shipment ? (
                <OrderTimeline
                  status={order.shipment.status}
                  shippedAt={order.shipment.pickedUpAt || order.shipment.estimatedDelivery}
                  deliveredAt={order.shipment.deliveredAt}
                />
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-600">Order not yet shipped</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shipping Address */}
            <div className="card-section">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <div className="text-sm text-stone-600">
                <p className="font-medium text-stone-900">{order.shippingSnapshot?.fullName}</p>
                <p>{order.shippingSnapshot?.line1}</p>
                {order.shippingSnapshot?.line2 && <p>{order.shippingSnapshot.line2}</p>}
                <p>
                  {order.shippingSnapshot?.city}, {order.shippingSnapshot?.state} {order.shippingSnapshot?.pincode}
                </p>
                <p>{order.shippingSnapshot?.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="card-section">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-semibold">Payment</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Payment Method</span>
                  <span className="font-medium">
                    {order.payment?.gateway === 'RAZORPAY' ? 'Razorpay' :
                     order.payment?.gateway === 'STRIPE' ? 'Stripe' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Status</span>
                  <span className={cn(
                    'font-medium',
                    order.payment?.status === 'SUCCESS' ? 'text-green-600' :
                    order.payment?.status === 'FAILED' ? 'text-red-600' :
                    'text-amber-600'
                  )}>
                    {order.payment?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card-section">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-terracotta-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-cream-300 pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-terracotta-500">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
              <div className="card-section">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-stone-600 mb-4">
                  Have questions about your order? Our support team is here to help.
                </p>
                <Link to="/contact" className="btn-outlined w-full text-center">
                  Contact Support
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
