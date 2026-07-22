import prisma from '../config/db.js';

export const productService = {
  async list({ category, sortBy = 'newest', page = 1, limit = 24, isFeatured, inStock, q, minPrice, maxPrice } = {}) {
    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(isFeatured && { isFeatured: true }),
      ...(inStock && { inStock: true }),
      // minPrice/maxPrice are in rupees; DB stores paise
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: Math.round(minPrice * 100) }),
          ...(maxPrice && { lte: Math.round(maxPrice * 100) }),
        },
      }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { material: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy = {
      newest: { createdAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      rating: { rating: 'desc' },
      popular: { reviewCount: 'desc' },
    }[sortBy] || { createdAt: 'desc' };

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          artisan: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        price: p.price / 100,
        originalPrice: p.originalPrice ? p.originalPrice / 100 : null,
        primaryImage: p.images[0]?.url || null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getBySlug(slug) {
    // Try by slug first, then by id (for cart links that use product id)
    let product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        artisan: true,
        images: true,
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { id: slug, isActive: true },
        include: {
          category: true,
          artisan: true,
          images: true,
        },
      });
    }

    if (!product) throw new Error('Product not found');

    return {
      ...product,
      price: product.price / 100,
      originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
    };
  },

  async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return categories.map(({ _count, ...c }) => ({ ...c, productCount: _count?.products ?? 0 }));
  },
};
