import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalProducts, totalOrders, totalUsers, monthlyRevenue, recentOrders, lowStock] = await prisma.$transaction([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: { take: 3 } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true, inStock: true },
      take: 10,
      select: { id: true, name: true, stock: true, slug: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        monthlyRevenue: (monthlyRevenue._sum.total || 0) / 100,
      },
      recentOrders,
      lowStock,
    },
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const where = { ...(status && { status }) };

  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 3 },
        payment: true,
        shipment: true,
      },
    }),
  ]);

  res.json({
    success: true,
    data: { items: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status, adminNote },
  });

  res.json({ success: true, message: 'Order status updated', data: order });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, shortDesc, price, originalPrice, categoryId, artisanId, material, dimensions, weight, weightGrams, stock, sku, isFeatured, isGITagged, badge } = req.body;

  const product = await prisma.product.create({
    data: {
      name, slug, description, shortDesc,
      price: Math.round(price * 100),
      originalPrice: originalPrice ? Math.round(originalPrice * 100) : null,
      categoryId, artisanId, material, dimensions, weight, weightGrams,
      stock: stock || 0, sku, isFeatured: isFeatured || false,
      isGITagged: isGITagged || false, badge,
    },
  });

  res.status(201).json({ success: true, message: 'Product created', data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (data.price) data.price = Math.round(data.price * 100);
  if (data.originalPrice) data.originalPrice = Math.round(data.originalPrice * 100);

  const product = await prisma.product.update({ where: { id }, data });
  res.json({ success: true, message: 'Product updated', data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  res.json({ success: true, message: 'Product deleted' });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, description, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, perUserLimit, validFrom, validUntil } = req.body;

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      description, discountType, discountValue,
      minOrderValue: minOrderValue ? Math.round(minOrderValue * 100) : null,
      maxDiscount: maxDiscount ? Math.round(maxDiscount * 100) : null,
      usageLimit, perUserLimit, validFrom, validUntil,
    },
  });

  res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (data.minOrderValue) data.minOrderValue = Math.round(data.minOrderValue * 100);
  if (data.maxDiscount) data.maxDiscount = Math.round(data.maxDiscount * 100);

  const coupon = await prisma.coupon.update({ where: { id }, data });
  res.json({ success: true, message: 'Coupon updated', data: coupon });
});

export const getArtisans = asyncHandler(async (req, res) => {
  const artisans = await prisma.artisanProfile.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: artisans });
});

export const verifyArtisan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artisan = await prisma.artisanProfile.update({
    where: { id },
    data: { isVerified: true },
  });
  res.json({ success: true, message: 'Artisan verified', data: artisan });
});

export const getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, approved } = req.query;
  const where = approved !== undefined ? { isApproved: approved === 'true' } : {};

  const [total, reviews] = await prisma.$transaction([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
    }),
  ]);

  res.json({
    success: true,
    data: { items: reviews, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } },
  });
});

export const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.update({
    where: { id },
    data: { isApproved: true },
  });
  res.json({ success: true, message: 'Review approved', data: review });
});
