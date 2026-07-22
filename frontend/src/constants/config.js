export const CONFIG = {
  // Port 5000 is taken by macOS AirPlay Receiver — local backend runs on 5050
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  IMAGE_BASE_URL: 'https://res.cloudinary.com/mittikala',
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
  FREE_SHIPPING_THRESHOLD: 999, // in rupees
  SHIPPING_FEE: 49, // in rupees
  PAGE_SIZE: 24,
  CART_STORAGE_KEY: 'mittikala_cart',
  TOAST_DURATION: 4000,
};
