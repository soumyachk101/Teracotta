import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const router = Router();

// GET /api/artisans
router.get('/', asyncHandler(async (req, res) => {
  const artisans = await prisma.artisanProfile.findMany({
    where: { isVerified: true },
    include: {
      user: { select: { name: true, avatar: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: artisans });
}));

// GET /api/artisans/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const artisan = await prisma.artisanProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatar: true } },
      products: {
        where: { isActive: true },
        include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!artisan) {
    const error = new Error('Artisan not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: artisan });
}));

export default router;
