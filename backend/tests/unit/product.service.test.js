import { describe, it, expect, vi } from 'vitest';

// Mock Prisma
vi.mock('../../src/config/db.js', () => ({
  default: {
    product: {
      count: vi.fn().mockResolvedValue(2),
      findMany: vi.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Classic Bankura Horse',
          slug: 'classic-bankura-horse',
          price: 189900,
          originalPrice: 249900,
          isActive: true,
          isFeatured: true,
          category: { name: 'Horses', slug: 'horses' },
          artisan: { displayName: 'Paresh Kumbhakar', village: 'Panchmura' },
          images: [{ url: 'https://example.com/horse.jpg', isPrimary: true }],
        },
        {
          id: '2',
          name: 'Terracotta Ganesha',
          slug: 'terracotta-ganesha',
          price: 249900,
          originalPrice: null,
          isActive: true,
          isFeatured: false,
          category: { name: 'Idols', slug: 'idols' },
          artisan: { displayName: 'Mohan Bej', village: 'Bishnupur' },
          images: [{ url: 'https://example.com/ganesha.jpg', isPrimary: true }],
        },
      ]),
      findUnique: vi.fn().mockResolvedValue({
        id: '1',
        name: 'Classic Bankura Horse',
        slug: 'classic-bankura-horse',
        price: 189900,
        originalPrice: 249900,
        isActive: true,
        category: { name: 'Horses', slug: 'horses' },
        artisan: { displayName: 'Paresh Kumbhakar', village: 'Panchmura' },
        images: [{ url: 'https://example.com/horse.jpg', isPrimary: true }],
      }),
    },
    category: {
      findMany: vi.fn().mockResolvedValue([
        { id: '1', name: 'Horses', slug: 'horses', isActive: true },
        { id: '2', name: 'Idols', slug: 'idols', isActive: true },
      ]),
    },
    $transaction: vi.fn().mockImplementation((fns) => Promise.all(fns)),
  },
}));

import { productService } from '../../src/services/product.service.js';

describe('Product Service', () => {
  describe('list', () => {
    it('should return products with pagination', async () => {
      const result = await productService.list({ page: 1, limit: 24 });
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination).toHaveProperty('page');
      expect(result.pagination).toHaveProperty('totalPages');
    });

    it('should convert prices from paise to rupees', async () => {
      const result = await productService.list();
      expect(result.products[0].price).toBe(1899);
      expect(result.products[0].originalPrice).toBe(2499);
    });
  });

  describe('getBySlug', () => {
    it('should return a product by slug', async () => {
      const product = await productService.getBySlug('classic-bankura-horse');
      expect(product).toBeDefined();
      expect(product.name).toBe('Classic Bankura Horse');
      expect(product.price).toBe(1899);
    });
  });

  describe('getCategories', () => {
    it('should return active categories', async () => {
      const categories = await productService.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });
});
