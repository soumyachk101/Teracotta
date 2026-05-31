import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const router = Router();

router.use(protect);
router.use(authorize('ADMIN'));

// GET /api/admin/dashboard
router.get('/dashboard', asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalOrders, monthOrders, dayOrders, totalProducts, totalUsers, totalArtisans, revenueAgg] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.artisanProfile.count(),
    prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true } }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      monthOrders,
      dayOrders,
      totalProducts,
      totalUsers,
      totalArtisans,
      totalRevenue: (revenueAgg._sum.total || 0) / 100,
    },
  });
}));

// GET /api/admin/orders
router.get('/orders', asyncHandler(async (req, res) => {
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
        items: true,
        payment: true,
        shipment: true,
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: { items: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } },
  });
}));

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true, payment: true },
  });

  res.status(200).json({ success: true, message: 'Order status updated', data: order });
}));

// POST /api/admin/products
router.post('/products', asyncHandler(async (req, res) => {
  const { name, description, shortDesc, price, originalPrice, categoryId, artisanId, material, dimensions, weight, weightGrams, stock, sku, isFeatured, isGITagged, badge, metaTitle, metaDescription } = req.body;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const product = await prisma.product.create({
    data: {
      name, slug, description, shortDesc,
      price: Math.round(price * 100),
      originalPrice: originalPrice ? Math.round(originalPrice * 100) : null,
      categoryId, artisanId, material, dimensions, weight, weightGrams,
      stock: stock || 0, sku,
      isFeatured: isFeatured || false,
      isGITagged: isGITagged || false,
      badge, metaTitle, metaDescription,
    },
  });

  res.status(201).json({ success: true, message: 'Product created', data: product });
}));

// PUT /api/admin/products/:id
router.put('/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (data.price) data.price = Math.round(data.price * 100);
  if (data.originalPrice) data.originalPrice = Math.round(data.originalPrice * 100);

  const product = await prisma.product.update({ where: { id }, data });
  res.status(200).json({ success: true, message: 'Product updated', data: product });
}));

// DELETE /api/admin/products/:id
router.delete('/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  res.status(200).json({ success: true, message: 'Product deactivated' });
}));

// GET /api/admin/coupons
router.get('/coupons', asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.status(200).json({ success: true, data: coupons });
}));

// POST /api/admin/coupons
router.post('/coupons', asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.create({ data: req.body });
  res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
}));

// PUT /api/admin/coupons/:id
router.put('/coupons/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await prisma.coupon.update({ where: { id }, data: req.body });
  res.status(200).json({ success: true, message: 'Coupon updated', data: coupon });
}));

// DELETE /api/admin/coupons/:id
router.delete('/coupons/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.coupon.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Coupon deleted' });
}));

export default router;
