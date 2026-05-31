import { aiService } from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const nlpSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    const error = new Error('Search query is required');
    error.statusCode = 400;
    throw error;
  }

  const filters = await aiService.nlpSearch(query);
  res.json({ success: true, data: { filters } });
});

export const customerChat = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;
  if (!message) {
    const error = new Error('Message is required');
    error.statusCode = 400;
    throw error;
  }

  const reply = await aiService.customerChat(message, conversationHistory);
  res.json({ success: true, data: { reply } });
});

export const generateDescription = asyncHandler(async (req, res) => {
  const { name, category, material, dimensions, artisanName, artisanVillage, artisanYears, isGITagged } = req.body;

  const description = await aiService.generateDescription({
    name, category, material, dimensions, artisanName, artisanVillage, artisanYears, isGITagged,
  });

  res.json({ success: true, data: { description } });
});

export const generateArtisanBio = asyncHandler(async (req, res) => {
  const { name, village, speciality, years, familyHistory } = req.body;

  const bio = await aiService.generateArtisanBio({
    name, village, speciality, years, familyHistory,
  });

  res.json({ success: true, data: { bio } });
});

export const summariseReviews = asyncHandler(async (req, res) => {
  const { productName, reviews } = req.body;

  const summary = await aiService.summariseReviews(productName, reviews);
  res.json({ success: true, data: { summary } });
});
