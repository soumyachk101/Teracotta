import { Queue } from 'bullmq';
import redis from '../config/redis.js';

const connection = { connection: redis };

export const emailQueue = new Queue('emails', connection);
export const shipmentQueue = new Queue('shipments', connection);
export const analyticsQueue = new Queue('analytics', connection);
