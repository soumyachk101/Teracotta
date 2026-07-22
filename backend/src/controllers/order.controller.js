import { orderService } from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';
import { paymentService } from '../services/payment.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, addressId, shippingAddress, shippingFee, discount, total, couponCode, paymentMethod } = req.body;
  const userId = req.user.id;

  const order = await orderService.create({
    userId,
    items,
    addressId,
    shippingAddress,
    shippingFee,
    discount,
    total,
    couponCode,
    paymentMethod: paymentMethod || 'COD',
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page, limit, status } = req.query;
  const result = await orderService.getByUser({
    userId,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const order = await orderService.getById(id, userId);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { reason } = req.body;

  const order = await orderService.cancelOrder(id, userId, reason);

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { id } = req.params; // order ID
  const { paymentId, signature } = req.body;
  const userId = req.user.id;

  // Fetch order with payment
  const order = await prisma.order.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!order || order.userId !== userId) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  const payment = order.payment;
  if (!payment || payment.gateway !== 'RAZORPAY') {
    const error = new Error('Razorpay payment not found for this order');
    error.statusCode = 400;
    throw error;
  }

  // Verify signature
  const isValid = paymentService.verifyRazorpaySignature(paymentId, payment.gatewayOrderId, signature);
  if (!isValid) {
    const error = new Error('Invalid payment signature');
    error.statusCode = 400;
    throw error;
  }

  // Update payment
  await prisma.payment.update({
    where: { orderId: id },
    data: { status: 'SUCCESS', gatewayPaymentId: paymentId },
  });

  // Update order status
  await prisma.order.update({
    where: { id },
    data: { status: 'PAYMENT_CONFIRMED' },
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
});
