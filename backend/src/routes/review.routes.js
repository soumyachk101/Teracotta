import { Router } from 'express';
import {
  getProductReviews,
  createReview,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/', protect, createReview);

export default router;
