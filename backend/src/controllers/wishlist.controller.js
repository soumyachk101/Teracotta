import { wishlistService } from '../services/wishlist.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wishlist = await wishlistService.getByUser(userId);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  const wishlist = await wishlistService.addItem(userId, productId);

  res.status(200).json({
    success: true,
    message: 'Item added to wishlist',
    data: wishlist,
  });
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const wishlist = await wishlistService.removeItem(userId, productId);

  res.status(200).json({
    success: true,
    message: 'Item removed from wishlist',
    data: wishlist,
  });
});
