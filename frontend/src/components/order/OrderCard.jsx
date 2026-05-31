import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  PAYMENT_CONFIRMED: { label: 'Payment Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
  PROCESSING: { label: 'Processing', icon: Package, color: 'text-indigo-600 bg-indigo-50' },
  PACKED: { label: 'Packed', icon: Package, color: 'text-purple-600 bg-purple-50' },
  DISPATCHED: { label: 'Out for Delivery', icon: Truck, color: 'text-orange-600 bg-orange-50' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Cancelled', icon: Package, color: 'text-red-600 bg-red-50' },
  RETURN_INITIATED: { label: 'Return Initiated', icon: Package, color: 'text-yellow-600 bg-yellow-50' },
  RETURN_PICKED_UP: { label: 'Return Picked Up', icon: Truck, color: 'text-yellow-600 bg-yellow-50' },
  REFUNDED: { label: 'Refunded', icon: CheckCircle, color: 'text-gray-600 bg-gray-50' },
};

export default function OrderCard({ order, showDetails = false }) {
  const config = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card-product p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-stone-500 mb-1">Order #{order.orderNumber}</p>
          <p className="text-xs text-stone-400">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium', config.color)}>
          <StatusIcon className="h-4 w-4" />
          {config.label}
        </div>
      </div>

      {showDetails && order.items && (
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-stone-900 line-clamp-1">{item.productName}</h4>
                <p className="text-sm text-stone-500">
                  Qty: {item.qty} × {formatPrice(item.unitPrice)}
                </p>
                {item.artisanName && (
                  <p className="text-xs text-stone-400 mt-1">by {item.artisanName}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-900">{formatPrice(item.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-cream-300">
        <div className="text-sm text-stone-600">
          <span className="font-medium">Total:</span> {formatPrice(order.total)}
          {order.couponCode && (
            <span className="ml-2 text-stone-400">(Coupon: {order.couponCode})</span>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            to={showDetails ? `/orders/${order.id}` : `/orders/${order.id}`}
            className="btn-outlined text-sm px-4 py-2"
          >
            {showDetails ? 'View Details' : 'Track Order'}
          </Link>
          {order.status === 'PENDING' && (
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
