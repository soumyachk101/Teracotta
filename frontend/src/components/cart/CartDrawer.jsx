import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cream-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-terracotta-500" />
              <h2 className="text-xl font-semibold">Your Bag ({items.length})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-cream-100 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-stone-300" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">Bag is empty</h3>
                <p className="text-stone-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to={ROUTES.SHOP} onClick={onClose} className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-stone-900 truncate pr-4">{item.name}</h4>
                      <button onClick={() => removeItem(item.productId)} className="text-stone-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-terracotta-500 font-semibold mb-3">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-cream-300 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-cream-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-cream-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-cream-200 bg-cream-50/50">
              <div className="flex justify-between mb-4">
                <span className="text-stone-600">Subtotal</span>
                <span className="text-xl font-bold text-stone-900">{formatPrice(getSubtotal())}</span>
              </div>
              <p className="text-xs text-stone-500 mb-6 italic text-center">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-3">
                <Link to={ROUTES.CHECKOUT} onClick={onClose} className="btn-primary w-full text-center block py-3 rounded-full font-semibold">
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-stone-600 text-sm font-medium hover:text-stone-900"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
