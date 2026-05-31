import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { wishlistService } from '../services/product.service';
import { useAuth } from '../context/AuthContext';
import WishlistItem from '../components/wishlist/WishlistItem';
import { cn } from '../utils/cn';

export default function Wishlist() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: () => wishlistService.list(),
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => wishlistService.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
  });

  const wishlistItems = data?.items || [];

  if (authLoading) {
    return (
      <div className="section">
        <div className="container flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="mb-8">
          <h1 className="mb-2">My Wishlist</h1>
          <p className="text-stone-600">
            Your favorite artisan treasures, saved for later
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-cream-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-stone-600 mb-4">Failed to load wishlist. Please try again.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retry
            </button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-stone-400" />
            </div>
            <h2 className="text-2xl mb-3">Your wishlist is empty</h2>
            <p className="text-stone-600 mb-8">
              Save items you love to keep track of them easily.
            </p>
            <Link to="/shop" className="btn-primary">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item.product?.id || item.id}
                item={item}
                onRemove={removeMutation.mutate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
