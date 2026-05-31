import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import prisma from '../config/db.js';

const connection = { connection: redis };

export const analyticsWorker = new Worker('analytics', async (job) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Daily stats
  const dailyOrders = await prisma.order.count({
    where: { createdAt: { gte: startOfDay }, status: { not: 'CANCELLED' } },
  });

  const dailyRevenue = await prisma.order.aggregate({
    where: { createdAt: { gte: startOfDay }, status: { not: 'CANCELLED' } },
    _sum: { total: true },
  });

  // Monthly stats
  const monthlyOrders = await prisma.order.count({
    where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
  });

  const monthlyRevenue = await prisma.order.aggregate({
    where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
    _sum: { total: true },
  });

  const stats = {
    date: now.toISOString().split('T')[0],
    daily: { orders: dailyOrders, revenue: (dailyRevenue._sum.total || 0) / 100 },
    monthly: { orders: monthlyOrders, revenue: (monthlyRevenue._sum.total || 0) / 100 },
  };

  console.log('[Analytics]', JSON.stringify(stats));
  return stats;
}, connection);
