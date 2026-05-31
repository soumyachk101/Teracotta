import { Router } from 'express';
import { aiService } from '../services/ai.service.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const router = Router();

// POST /api/ai/search (public)
router.post('/search', asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query || query.length > 500) {
    const error = new Error('Invalid search query');
    error.statusCode = 400;
    throw error;
  }

  const filters = await aiService.nlpSearch(query);
  res.status(200).json({ success: true, data: { filters } });
}));

// POST /api/ai/chat (public)
router.post('/chat', asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;
  if (!message) {
    const error = new Error('Message is required');
    error.statusCode = 400;
    throw error;
  }

  const reply = await aiService.customerChat(message, conversationHistory || []);
  res.status(200).json({ success: true, data: { reply } });
}));

// POST /api/ai/description (admin only)
router.post('/description', protect, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, artisan: true },
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const description = await aiService.generateDescription({
    name: product.name,
    category: product.category.name,
    material: product.material,
    dimensions: product.dimensions,
    artisanName: product.artisan?.displayName,
    artisanVillage: product.artisan?.village,
    isGITagged: product.isGITagged,
  });

  await prisma.product.update({
    where: { id: productId },
    data: { aiDescription: description },
  });

  res.status(200).json({ success: true, data: { description } });
}));

// POST /api/ai/artisan-bio (admin only)
router.post('/artisan-bio', protect, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { artisanId } = req.body;
  const artisan = await prisma.artisanProfile.findUnique({ where: { id: artisanId } });

  if (!artisan) {
    const error = new Error('Artisan not found');
    error.statusCode = 404;
    throw error;
  }

  const bio = await aiService.generateArtisanBio({
    displayName: artisan.displayName,
    village: artisan.village,
    speciality: artisan.speciality,
    yearsExperience: artisan.yearsExperience,
    bio: artisan.bio,
  });

  res.status(200).json({ success: true, data: { bio } });
}));

// POST /api/ai/summarise (public, cached)
router.post('/summarise', asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  if (reviews.length < 3) {
    res.status(200).json({ success: true, data: { summary: 'Not enough reviews to summarize.' } });
    return;
  }

  const summary = await aiService.summarizeReviews(product.name, reviews);
  res.status(200).json({ success: true, data: { summary } });
}));

export default router;
