import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import AnimateIn from '../shared/AnimateIn';
import { formatPrice } from '../../utils/formatPrice';

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuth();

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
    <AnimateIn variant="fade-up" delay={index * 100}>
      <Link to={`/product/${product.slug}`} className="card-product group block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && <Badge variant={getBadgeVariant(product.badge)}>{product.badge}</Badge>}
            {product.discountPercent > 0 && (
              <Badge variant="default">-{product.discountPercent}%</Badge>
            )}
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm text-terracotta-500 p-2 rounded-full shadow-warm hover:bg-terracotta-500 hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
          <h3 className="font-display text-lg font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-terracotta-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <Rating value={product.rating || 0} size="sm" />
          </div>

          {product.artisan && (
            <p className="text-sm text-stone-600 mb-3 line-clamp-1">
              {product.artisan.displayName} • {product.artisan.village.split(',')[1]?.trim() || product.artisan.village}
            </p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </AnimateIn>
  );
}

function getBadgeVariant(badge) {
  switch (badge) {
    case 'GI Tagged':
      return 'gi';
    case 'Best Seller':
      return 'bestseller';
    case 'Premium':
      return 'premium';
    case 'Limited':
      return 'limited';
    default:
      return 'default';
  }
}
