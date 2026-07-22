import crypto from 'crypto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

let _razorpay;
function getRazorpay() {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw Object.assign(new Error('Razorpay is not configured'), { statusCode: 503 });
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

let _stripe;
function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw Object.assign(new Error('Stripe is not configured'), { statusCode: 503 });
    }
    _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export const paymentService = {
  // Razorpay
  async createRazorpayOrder(amountInRupees, currency = 'INR', receipt) {
    const options = {
      amount: Math.round(amountInRupees * 100), // convert rupees to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1, // auto capture
    };
    return await getRazorpay().orders.create(options);
  },

  verifyRazorpaySignature(paymentId, orderId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  },

  // Stripe - using Checkout Sessions (accepts INR)
  async createStripeCheckoutSession(order, successUrl, cancelUrl) {
    // amount in smallest currency unit: for INR it's paise; order.total is already in paise
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Order ${order.orderNumber}`,
              images: order.items.length > 0 ? [order.items[0].productImage] : [],
            },
            unit_amount: order.total,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      customer_email: order.user?.email || undefined,
    });

    return session;
  },

  async retrieveStripeCheckoutSession(sessionId) {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  },
};
