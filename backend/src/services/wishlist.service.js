import prisma from '../config/db.js';

export const wishlistService = {
  async getByUser(userId) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                artisan: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    // If no wishlist, create one
    if (!wishlist) {
      const newWishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
      return newWishlist;
    }

    return wishlist;
  },

  async addItem(userId, productId) {
    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    // Check if already exists
    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    if (existing) {
      throw new Error('Item already in wishlist');
    }

    const item = await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return this.getByUser(userId);
  },

  async removeItem(userId, productId) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    await prisma.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });

    return this.getByUser(userId);
  },

  async clear(userId) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
    return this.getByUser(userId);
  },
};
