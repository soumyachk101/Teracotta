import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';
import crypto from 'crypto';

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case 'payment.captured': {
      const payment = event.payload.payment.entity;
      const order = await prisma.payment.findFirst({
        where: { gatewayOrderId: payment.order_id },
      });
      if (order) {
        await prisma.payment.update({
          where: { id: order.id },
          data: { status: 'SUCCESS', gatewayPaymentId: payment.id },
        });
        await prisma.order.update({
          where: { id: order.orderId },
          data: { status: 'PAYMENT_CONFIRMED' },
        });
      }
      break;
    }
    case 'payment.failed': {
      const payment = event.payload.payment.entity;
      const order = await prisma.payment.findFirst({
        where: { gatewayOrderId: payment.order_id },
      });
      if (order) {
        await prisma.payment.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        });
      }
      break;
    }
    case 'refund.processed': {
      const refund = event.payload.refund.entity;
      const payment = await prisma.payment.findFirst({
        where: { gatewayPaymentId: refund.payment_id },
      });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            refundId: refund.id,
            refundAmount: refund.amount,
            refundedAt: new Date(),
          },
        });
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'REFUNDED' },
        });
      }
      break;
    }
  }

  res.json({ success: true });
});

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const order = await prisma.order.findFirst({
        where: { orderNumber: session.metadata.orderNumber },
      });
      if (order) {
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { status: 'SUCCESS', gatewayPaymentId: session.payment_intent },
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAYMENT_CONFIRMED' },
        });
      }
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object;
      const payment = await prisma.payment.findFirst({
        where: { gatewayPaymentId: charge.payment_intent },
      });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            refundAmount: charge.amount_refunded,
            refundedAt: new Date(),
          },
        });
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'REFUNDED' },
        });
      }
      break;
    }
  }

  res.json({ success: true });
});
