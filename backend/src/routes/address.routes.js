import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const router = Router();

router.use(protect);

// GET /api/addresses
router.get('/', asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { isDefault: 'desc' },
  });
  res.status(200).json({ success: true, data: addresses });
}));

// POST /api/addresses
router.post('/', asyncHandler(async (req, res) => {
  const { fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { userId: req.user.id, fullName, phone, line1, line2: line2 || null, city, state, pincode, isDefault: isDefault || false },
  });

  res.status(201).json({ success: true, message: 'Address added', data: address });
}));

// PUT /api/addresses/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address || address.userId !== req.user.id) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({ success: true, message: 'Address updated', data: updated });
}));

// DELETE /api/addresses/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address || address.userId !== req.user.id) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.address.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Address deleted' });
}));

export default router;
