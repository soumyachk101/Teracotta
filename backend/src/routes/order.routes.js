import { Router } from 'express';
import { createOrder, getOrders, getOrderById, cancelOrder, verifyRazorpayPayment } from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // Protect all order routes

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/verify-razorpay', verifyRazorpayPayment);

export default router;
