import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM || 'orders@mittikala.com';

export const emailService = {
  async sendOrderConfirmation({ to, orderNumber, items, total, shippingAddress }) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmed — ${orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <h2>Order Items</h2>
        <ul>
          ${items.map((item) => `<li>${item.productName} x ${item.qty} — ₹${(item.total / 100).toLocaleString('en-IN')}</li>`).join('')}
        </ul>
        <p><strong>Total: ₹${(total / 100).toLocaleString('en-IN')}</strong></p>
        <p>We'll notify you when your order ships.</p>
      `,
    });
  },

  async sendShippingNotification({ to, orderNumber, trackingId, trackingUrl, courier }) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Shipped — ${orderNumber}`,
      html: `
        <h1>Your order is on its way!</h1>
        <p>Order <strong>${orderNumber}</strong> has been shipped via ${courier}.</p>
        <p>Tracking ID: <a href="${trackingUrl}">${trackingId}</a></p>
        <p>Estimated delivery: 4–7 business days.</p>
      `,
    });
  },

  async sendPasswordReset({ to, resetLink }) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset Your Password — Mitti Kala',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  },
};
