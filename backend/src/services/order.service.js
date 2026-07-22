import prisma from '../config/db.js';
import { paymentService } from './payment.service.js';

export const orderService = {
  async create({ userId, items, addressId, shippingAddress, shippingFee = 0, discount = 0, total, couponCode, paymentMethod = 'COD' }) {
    // Get address for snapshot
    const address = addressId ? await prisma.address.findUnique({ where: { id: addressId } }) : null;

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    // Calculate amounts (in paise)
    const subtotalPaise = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
    const shippingPaise = shippingFee;
    const discountPaise = discount;
    const totalPaise = subtotalPaise + shippingPaise - discountPaise;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Fetch user for contact info
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          status: 'PENDING',
          shippingFee: shippingPaise,
          discount: discountPaise,
          subtotal: subtotalPaise,
          total: totalPaise,
          couponCode,
          shippingSnapshot: address ? {
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
          } : (shippingAddress || {}),
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              productImage: item.image,
              unitPrice: Math.round(item.price * 100),
              qty: item.quantity,
              total: Math.round(item.price * 100) * item.quantity,
            })),
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Create Payment if not Cash on Delivery
      let gatewayOrderId = null;
      let paymentGateway = 'COD';
      if (paymentMethod === 'RAZORPAY') {
        const razorpayOrder = await paymentService.createRazorpayOrder(totalPaise / 100, 'INR', orderNumber);
        gatewayOrderId = razorpayOrder.id;
        paymentGateway = 'RAZORPAY';
      } else if (paymentMethod === 'STRIPE') {
        const stripeSession = await paymentService.createStripeCheckoutSession(
          {
            id: newOrder.id,
            orderNumber,
            total: totalPaise,
            items,
            user: { email: user?.email, name: user?.name },
          },
          `${process.env.FRONTEND_URL}/order/confirmation`,
          `${process.env.FRONTEND_URL}/checkout`
        );
        gatewayOrderId = stripeSession.id;
        paymentGateway = 'STRIPE';
      }

      // Create Payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          gateway: paymentGateway,
          status: 'PENDING',
          amount: totalPaise,
          gatewayOrderId,
        },
      });

      // Return full order with relations
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: true,
          address: true,
          payment: true,
          shipment: true,
        },
      });
    });

    return order;
  },

  async getByUser(params = {}) {
    const { userId, page = 1, limit = 20, status } = params;
    const where = { userId, ...(status && { status }) };

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: { take: 5 },
          payment: true,
          shipment: true,
        },
      }),
    ]);

    return {
      items: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id, userId) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        payment: true,
        shipment: true,
        user: { select: { email: true, name: true } },
      },
    });

    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    return order;
  },

  async cancelOrder(id, userId, reason) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', cancellationReason: reason },
      include: { payment: true },
    });

    // TODO: Refund logic if payment was made and captured

    return updatedOrder;
  },
};
