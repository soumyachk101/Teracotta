import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { productService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../utils/formatPrice';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import Button from '../components/ui/Button';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';
import { useUIStore } from '../store/uiStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => productService.getById(slug),
  });

  const product = data;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (product) {
      addItem(product, quantity);
      openCartDrawer();
    }
  };

  if (isLoading) {
    return (
      <div className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-cream-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-cream-200 rounded w-3/4" />
              <div className="h-6 bg-cream-200 rounded w-1/2" />
              <div className="h-24 bg-cream-200 rounded" />
              <div className="h-10 bg-cream-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="section">
        <div className="container text-center py-20">
          <h2 className="mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center gap-2 text-stone-500">
            <li><Link to="/" className="hover:text-terracotta-500">Home</Link></li>
            <li>/</li>
            <li><Link to="/shop" className="hover:text-terracotta-500">Shop</Link></li>
            <li>/</li>
            <li><Link to={`/shop?category=${product.category.slug}`} className="hover:text-terracotta-500">{product.category.name}</Link></li>
            <li>/</li>
            <li className="text-stone-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-100">
              <img
                src={product.images[selectedImage]?.url || product.primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                      selectedImage === idx ? 'border-terracotta-500' : 'border-transparent'
                    )}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="gi">{product.badge}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <Rating value={product.rating || 0} size="md" showValue reviewCount={product.reviewCount || 0} />
            </div>

            <p className="text-3xl font-bold text-terracotta-500 mb-6">
              {formatPrice(product.price)}
              {product.originalPrice && (
                <span className="text-lg text-stone-400 line-through ml-3">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </p>

            <p className="text-stone-700 mb-6 leading-relaxed">{product.description}</p>

            {/* Artisan Info */}
            {product.artisan && (
              <div className="card-section mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cream-100 overflow-hidden flex-shrink-0">
                    {/* Artisan photo placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-terracotta-200 to-cream-300 flex items-center justify-center text-terracotta-500 font-bold text-xl">
                      {product.artisan.displayName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{product.artisan.displayName}</p>
                    <p className="text-sm text-stone-600 mb-1">{product.artisan.village}</p>
                    <p className="text-xs text-stone-500">
                      {product.artisan.yearsExperience} years • {product.artisan.craftGeneration} Generation
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-cream-100 rounded-xl p-4">
                <p className="text-stone-500 mb-1">Material</p>
                <p className="font-medium text-stone-900">{product.material}</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-4">
                <p className="text-stone-500 mb-1">Dimensions</p>
                <p className="font-medium text-stone-900">{product.dimensions}</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-4">
                <p className="text-stone-500 mb-1">Weight</p>
                <p className="font-medium text-stone-900">{product.weight}</p>
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-amber-700 text-xs font-medium">Only {product.stock} left in stock</p>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            {product.inStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-cream-300 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-cream-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-cream-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary"
                  >
                    Add to Cart
                  </Button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={cn(
                      'p-3 rounded-full border transition-colors',
                      inWishlist
                        ? 'bg-terracotta-50 border-terracotta-200 text-terracotta-500'
                        : 'border-cream-300 text-stone-500 hover:border-terracotta-300'
                    )}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={cn('h-5 w-5', inWishlist && 'fill-current')} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-stone-600">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Free shipping over ₹999
                  </span>
                  <span className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" /> 7-day returns
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
