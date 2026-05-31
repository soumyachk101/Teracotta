import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { wishlistService } from '../services/product.service';
import { useAuth } from '../context/AuthContext';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: wishlistService.list,
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: wishlistService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
  });

  const toggleWishlist = useCallback(
    (productId) => {
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }

      const isInList = wishlist.some((item) => item.productId === productId);
      if (isInList) {
        removeMutation.mutate(productId);
      } else {
        addMutation.mutate(productId);
      }
    },
    [isAuthenticated, wishlist, addMutation, removeMutation]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist]
  );

  return {
    wishlist,
    isLoading,
    error,
    toggleWishlist,
    isInWishlist,
    isAdding: addMutation.isLoading,
    isRemoving: removeMutation.isLoading,
  };
}
