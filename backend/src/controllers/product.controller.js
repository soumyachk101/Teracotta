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
  // Basic implementation: use productService.list with additional filters
  const result = await productService.list({
    category,
    sortBy,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 24,
  });

  // TODO: Implement full-text search and price filtering in productService
  // For now, filter client-side if search query exists
  let products = result.products;
  if (q) {
    const lowerQ = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQ) ||
        p.description?.toLowerCase().includes(lowerQ) ||
        p.material?.toLowerCase().includes(lowerQ)
    );
  }
  if (minPrice) {
    products = products.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter((p) => p.price <= parseFloat(maxPrice));
  }
  if (inStock === 'true') {
    products = products.filter((p) => p.inStock);
  }

  res.status(200).json({
    success: true,
    data: {
      items: products,
      pagination: {
        total: products.length,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 24,
        totalPages: Math.ceil(products.length / (parseInt(limit) || 24)),
      },
    },
  });
});
