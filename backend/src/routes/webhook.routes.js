import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { paymentService } from '../services/payment.service.js';
import prisma from '../config/db.js';
import crypto from 'crypto';

const router = Router();

// POST /api/webhooks/razorpay
router.post('/razorpay', asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body.event;

  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const order = await prisma.order.findFirst({
      where: { payment: { gatewayOrderId: payment.order_id } },
    });

    if (order) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: { status: 'SUCCESS', gatewayPaymentId: payment.id },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAYMENT_CONFIRMED' },
      });
    }
  }

  if (event === 'payment.failed') {
    const payment = req.body.payload.payment.entity;
    const order = await prisma.order.findFirst({
      where: { payment: { gatewayOrderId: payment.order_id } },
    });

    if (order) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: { status: 'FAILED' },
      });
    }
  }

  res.status(200).json({ success: true });
}));

// POST /api/webhooks/stripe
router.post('/stripe', asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = req.body;
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'SUCCESS', gatewayPaymentId: session.id },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAYMENT_CONFIRMED' },
      });
    }
  }

  res.status(200).json({ success: true });
}));

export default router;
