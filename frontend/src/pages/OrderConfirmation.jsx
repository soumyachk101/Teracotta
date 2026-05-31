import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import Button from '../components/ui/Button';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'ORD-2024-00042';

  return (
    <div className="section">
      <div className="container max-w-2xl text-center py-12">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>

        <h1 className="text-4xl mb-3">Thank You!</h1>
        <p className="text-xl text-stone-600 mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-terracotta-500 font-medium mb-8">
          Order Number: {orderNumber}
        </p>

        <div className="bg-cream-100 rounded-3xl p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-terracotta-500" />
            What's Next?
          </h3>
          <ul className="space-y-3 text-stone-700">
            <li className="flex items-start gap-3">
              <span className="text-terracotta-500 font-bold">•</span>
              <span>You'll receive an email confirmation shortly with your order details.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-terracotta-500 font-bold">•</span>
              <span>We'll notify you once your order ships with tracking information.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-terracotta-500 font-bold">•</span>
              <span>Expected delivery: 5-7 business days.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-primary">
            View Order Status
          </Link>
          <Link to="/shop" className="btn-outlined">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
