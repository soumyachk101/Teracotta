import axios from 'axios';

const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external';

let authToken = null;

async function authenticate() {
  const { data } = await axios.post(`${SHIPROCKET_API}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  authToken = data.token;
  return authToken;
}

async function getAuth() {
  if (!authToken) await authenticate();
  return authToken;
}

export const shippingService = {
  async createOrder({ order, address, items }) {
    const token = await getAuth();
    const { data } = await axios.post(
      `${SHIPROCKET_API}/orders/create/adhoc`,
      {
        order_id: order.orderNumber,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: 'Primary',
        billing_customer_name: address.fullName,
        billing_phone: address.phone,
        billing_address: address.line1,
        billing_city: address.city,
        billing_pincode: address.pincode,
        billing_state: address.state,
        billing_country: address.country || 'India',
        shipping_is_billing: true,
        order_items: items.map((item) => ({
          name: item.productName,
          sku: item.productId,
          units: item.qty,
          selling_price: item.unitPrice / 100,
        })),
        payment_method: 'Prepaid',
        sub_total: order.subtotal / 100,
        length: 15,
        breadth: 15,
        height: 15,
        weight: 0.5,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  async getTracking(shipmentId) {
    const token = await getAuth();
    const { data } = await axios.get(
      `${SHIPROCKET_API}/courier/track/shipment/${shipmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  async checkServiceability(pincode) {
    const token = await getAuth();
    const { data } = await axios.get(
      `${SHIPROCKET_API}/courier/serviceability/?pickup_postcode=722201&delivery_postcode=${pincode}&cod=0&weight=0.5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
