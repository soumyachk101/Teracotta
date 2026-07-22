import { Link } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatPrice';

export default function WishlistItem({ item, onRemove }) {
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const product = item.product || item; // Support both nested and flat structure

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addItem(product, 1);
  };

  return (
    <div className="card-product group overflow-hidden">
      <Link to={`/product/${product.slug}`} className="flex gap-4 p-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
              {product.category?.name || 'Category'}
            </p>
            <h3 className="font-display text-lg font-semibold text-stone-900 line-clamp-2 group-hover:text-terracotta-500 transition-colors">
              {product.name}
            </h3>
            {product.artisan && (
              <p className="text-sm text-stone-600 mt-1">
                by {product.artisan.displayName}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-bold text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-terracotta-50 text-terracotta-500 hover:bg-terracotta-500 hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-0 flex justify-end">
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove?.(product.id);
          }}
          className="text-sm text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Heart className="h-4 w-4 fill-current" />
          Remove
        </button>
      </div>
    </div>
  );
}
