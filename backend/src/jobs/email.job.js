import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import { emailService } from '../services/email.service.js';

const connection = { connection: redis };

export const emailWorker = new Worker('emails', async (job) => {
  const { type, data } = job.data;

  switch (type) {
    case 'order-confirmation':
      await emailService.sendOrderConfirmation(data);
      break;
    case 'shipping-notification':
      await emailService.sendShippingNotification(data);
      break;
    case 'password-reset':
      await emailService.sendPasswordReset(data);
      break;
    case 'welcome':
      await emailService.sendWelcome(data);
      break;
    default:
      console.warn(`[Email Worker] Unknown job type: ${type}`);
  }
}, connection);

emailWorker.on('completed', (job) => {
  console.log(`[Email] Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[Email] Job ${job?.id} failed:`, err.message);
});
