import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductsLabels = asyncHandler(async (req, res) => {
  const { category, sortBy, page, limit } = req.query;
  const result = await productService.list({
    category,
    sortBy,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 24,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getBySlug(slug);

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  // For now, just get featured products. Could be enhanced with manual selection.
  const result = await productService.list({ isFeatured: true, limit: 8 });

  res.status(200).json({
    success: true,
    data: result.products,
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, inStock, sortBy, page, limit } = req.query;
  const result = await productService.list({
    q,
    category,
    sortBy,
    inStock: inStock === 'true',
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 24,
  });

  res.status(200).json({
    success: true,
    data: {
      items: result.products,
      pagination: result.pagination,
    },
  });
});
