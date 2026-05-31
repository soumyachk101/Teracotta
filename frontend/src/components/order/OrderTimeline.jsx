import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'PACKED', label: 'Packed', icon: Package },
  { key: 'DISPATCHED', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

const terminalStatuses = ['CANCELLED', 'RETURN_INITIATED', 'RETURN_PICKED_UP', 'REFUNDED'];

export default function OrderTimeline({ status, shippedAt, deliveredAt }) {
  // For terminal statuses other than delivered, show special handling
  if (status === 'CANCELLED') {
    return (
      <div className="text-center py-8">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold text-stone-900 mb-2">Order Cancelled</h3>
        <p className="text-stone-600">This order has been cancelled.</p>
      </div>
    );
  }

  // Find current step index
  const currentIndex = statusSteps.findIndex((step) => step.key === status);
  const isCompleted = status === 'DELIVERED';

  return (
    <div className="py-6">
      <div className="relative">
        {/* Line connecting steps */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-cream-300" />

        {statusSteps.map((step, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="relative flex gap-4 mb-8 last:mb-0">
              <div
                className={cn(
                  'z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                  isPast
                    ? 'bg-green-50 border-green-500 text-green-600'
                    : isCurrent
                    ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-600'
                    : 'bg-cream-100 border-cream-300 text-stone-400'
                )}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 pt-2">
                <h4
                  className={cn(
                    'font-semibold text-stone-900',
                    !isPast && !isCurrent && 'text-stone-400'
                  )}
                >
                  {step.label}
                </h4>
                {isCurrent && (
                  <p className="text-sm text-stone-500 mt-1">
                    Expected by{' '}
                    {shippedAt
                      ? new Date(shippedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : 'TBD'}
                  </p>
                )}
                {isPast && step.key === 'DISPATCHED' && shippedAt && (
                  <p className="text-sm text-stone-500 mt-1">
                    Shipped on {new Date(shippedAt).toLocaleDateString('en-IN')}
                  </p>
                )}
                {isPast && step.key === 'DELIVERED' && deliveredAt && (
                  <p className="text-sm text-stone-500 mt-1">
                    Delivered on {new Date(deliveredAt).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted && (
        <div className="mt-8 p-6 bg-cream-100 rounded-2xl text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-display text-xl font-semibold text-stone-900 mb-2">
            Order Delivered Successfully!
          </h3>
          <p className="text-stone-600">
            We hope you love your terracotta treasure. Share your experience with a review!
          </p>
        </div>
      )}
    </div>
  );
}
