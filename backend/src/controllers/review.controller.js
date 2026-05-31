import { reviewService } from '../services/review.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page, limit, sortBy } = req.query;

  const result = await reviewService.getByProduct(productId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sortBy: sortBy || 'newest',
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, title, body } = req.body;

  if (!productId || !rating) {
    const error = new Error('Product ID and rating are required');
    error.statusCode = 400;
    throw error;
  }

  const review = await reviewService.create({
    userId,
    productId,
    rating,
    title,
    body,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});
