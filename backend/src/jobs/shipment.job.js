import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import prisma from '../config/db.js';
import { shippingService } from '../services/shipping.service.js';

const connection = { connection: redis };

export const shipmentWorker = new Worker('shipments', async (job) => {
  const shipments = await prisma.shipment.findMany({
    where: {
      status: { notIn: ['DELIVERED', 'FAILED', 'RETURNED'] },
      trackingId: { not: null },
    },
  });

  for (const shipment of shipments) {
    try {
      const tracking = await shippingService.getTracking(shipment.trackingId);
      if (tracking?.tracking_data?.shipment_track?.[0]) {
        const latestStatus = tracking.tracking_data.shipment_track[0].current_status;
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: { status: mapShiprocketStatus(latestStatus) },
        });
      }
    } catch (err) {
      console.error(`[Shipment] Failed to update ${shipment.id}:`, err.message);
    }
  }
}, connection);

function mapShiprocketStatus(status) {
  const map = {
    'Picked Up': 'PICKED_UP',
    'In Transit': 'IN_TRANSIT',
    'Out for Delivery': 'OUT_FOR_DELIVERY',
    'Delivered': 'DELIVERED',
    'Returned': 'RETURNED',
    'Failed': 'FAILED',
  };
  return map[status] || 'IN_TRANSIT';
}
