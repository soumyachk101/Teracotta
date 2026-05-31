import { Router } from 'express';
import { getProductsLabels, getProductBySlug, getCategories, getFeaturedProducts, searchProducts } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProductsLabels);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);

export default router;
