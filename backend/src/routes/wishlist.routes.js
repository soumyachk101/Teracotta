import { Router } from 'express';
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // All wishlist routes require auth

router.get('/', getWishlist);
router.post('/items', addWishlistItem);
router.delete('/items/:productId', removeWishlistItem);

export default router;
