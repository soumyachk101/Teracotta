import prisma from '../config/db.js';

export const reviewService = {
  async getByProduct(productId, { page = 1, limit = 20, sortBy = 'newest' } = {}) {
    const where = { productId, isApproved: true };

    const orderBy = {
      newest: { createdAt: 'desc' },
      highest: { rating: 'desc' },
      helpful: { helpfulCount: 'desc' },
    }[sortBy] || { createdAt: 'desc' };

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
    ]);

    return {
      items: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async create({ userId, productId, rating, title, body }) {
    // Check if user has already reviewed this product
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      throw new Error('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        body,
        isVerifiedPurchase: true, // Simplified: assume purchase exists
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Update product rating average (could be done via trigger)
    await this.updateProductRating(productId);

    return review;
  },

  async updateProductRating(productId) {
    const avg = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
    });
    const count = await prisma.review.count({ where: { productId, isApproved: true } });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((avg._avg.rating || 0) * 10) / 10,
        reviewCount: count,
      },
    });
  },
};
