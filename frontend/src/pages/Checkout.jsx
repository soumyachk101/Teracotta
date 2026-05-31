import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';
import { orderService } from '../services/product.service';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState('address');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const razorpayRef = useRef(null);

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  // Load Razorpay script if needed
  useEffect(() => {
    if (paymentMethod === 'RAZORPAY' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paymentMethod]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Create order
      const response = await orderService.create({
        items,
        addressId: null, // Not saving address yet
        shippingFee,
        discount: 0,
        total,
        paymentMethod,
      });

      const order = response.data;

      if (paymentMethod === 'COD') {
        clearCart();
        navigate('/order/confirmation', {
          state: { orderNumber: order.orderNumber, orderId: order.id },
        });
        return;
      }

      if (paymentMethod === 'RAZORPAY') {
        if (!razorpayLoaded) {
          toast.error('Razorpay payment system is loading. Please try again.');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: order.total, // in paise (Razorpay expects smallest unit)
          currency: 'INR',
          name: 'Mitti Kala',
          description: `Order ${order.orderNumber}`,
          order_id: order.payment.gatewayOrderId, // Razorpay order ID
          image: '/favicon.svg',
          handler: async function (razorpayResponse) {
            // Verify payment on backend
            try {
              await orderService.verifyRazorpay(order.id, {
                paymentId: razorpayResponse.razorpay_payment_id,
                signature: razorpayResponse.razorpay_signature,
              });
              clearCart();
              navigate('/order/confirmation', {
                state: { orderNumber: order.orderNumber, orderId: order.id },
              });
            } catch (err) {
              toast.error('Payment verification failed. Please contact support.');
              console.error(err);
            }
          },
          prefill: {
            name: address.fullName || '',
            email: '', // could be from user context
            contact: address.phone || '',
          },
          theme: {
            color: '#c4622d',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Address', 'Payment', 'Review'].map((label, idx) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  step === ['address', 'payment', 'review'][idx]
                    ? 'bg-terracotta-500 text-white'
                    : idx < ['address', 'payment', 'review'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-cream-200 text-stone-500'
                )}
              >
                {idx < ['address', 'payment', 'review'].indexOf(step) ? (
                  '✓'
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-sm text-stone-600">{label}</span>
              {idx < 2 && <div className="w-8 h-px bg-cream-300" />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2">
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      State *
                    </label>
                    <input
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="btn-primary w-full">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-cream-300 rounded-xl cursor-pointer hover:border-terracotta-400 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="text-terracotta-500"
                    />
                    <span className="font-medium">Razorpay (UPI, Cards, Net Banking)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-cream-300 rounded-xl cursor-pointer hover:border-terracotta-400 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-terracotta-500"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                  {/* Stripe could be added here */}
                </div>
                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setStep('address')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-cream-100 rounded-3xl p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-300 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-cream-300">
                  <span>Total</span>
                  <span className="text-terracotta-500">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
