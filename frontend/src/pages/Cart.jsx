import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getShippingFee,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container text-center py-20">
          <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl mb-3">Your cart is empty</h2>
          <p className="text-stone-600 mb-8">
            Looks like you haven't added any artisan treasures yet.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-stone-500 hover:text-terracotta-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-white rounded-2xl shadow-warm"
              >
                {/* Image */}
                <Link
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-semibold text-stone-900 hover:text-terracotta-500 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-stone-500 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-stone-400 hover:text-terracotta-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-cream-300 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-cream-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, Math.min(item.maxStock, item.quantity + 1))
                        }
                        className="p-2 hover:bg-cream-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-bold text-stone-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-terracotta-500 hover:text-terracotta-600 font-medium"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream-100 rounded-3xl p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-stone-500">
                    Free shipping on orders above ₹999
                  </p>
                )}
                <div className="border-t border-cream-300 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-terracotta-500">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full mt-6 inline-flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="text-xs text-stone-500 text-center mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
