import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_PHONE = process.env.TWILIO_PHONE;

export const smsService = {
  async sendOTP(phone, otp) {
    return client.messages.create({
      body: `Your Mitti Kala verification code is: ${otp}. Valid for 10 minutes.`,
      from: FROM_PHONE,
      to: `+91${phone}`,
    });
  },

  async sendOrderNotification(phone, orderNumber) {
    return client.messages.create({
      body: `Your Mitti Kala order ${orderNumber} has been confirmed! Track it at mittikala.com/orders`,
      from: FROM_PHONE,
      to: `+91${phone}`,
    });
  },
};
