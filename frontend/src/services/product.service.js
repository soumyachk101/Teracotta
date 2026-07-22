import { api } from './api';
import { CONFIG } from '../constants/config';

export const productService = {
  list: (params = {}) => api.get('/products', { params }).then(r => r.data.data),

  getById: (id) => api.get(`/products/${id}`).then(r => r.data.data),

  getFeatured: () => api.get('/products/featured').then(r => r.data.data),

  getCategories: () => api.get('/categories').then(r => r.data.data),
};

export const reviewService = {
  list: (productId, params = {}) =>
    api.get(`/reviews/${productId}`, { params }).then(r => r.data.data),

  create: (data) => api.post('/reviews', data).then(r => r.data.data),
};

export const wishlistService = {
  list: () => api.get('/wishlist').then(r => r.data.data),

  add: (productId) => api.post('/wishlist/items', { productId }).then(r => r.data.data),

  remove: (productId) => api.delete(`/wishlist/items/${productId}`).then(r => r.data.data),
};

export const orderService = {
  list: (params = {}) => api.get('/orders', { params }).then(r => r.data.data),

  getById: (id) => api.get(`/orders/${id}`).then(r => r.data.data),

  create: (data) => api.post('/orders', data).then(r => r.data.data),

  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }).then(r => r.data.data),

  verifyRazorpay: (orderId, data) => api.post(`/orders/${orderId}/verify-razorpay`, data).then(r => r.data),
};

export const authService = {
  register: (data) => api.post('/auth/register', data).then(r => r.data.data),

  login: (data) => api.post('/auth/login', data).then(r => r.data.data),

  sendOTP: (phone) => api.post('/auth/login/otp/send', { phone }).then(r => r.data.data),

  verifyOTP: (phone, otp) => api.post('/auth/login/otp/verify', { phone, otp }).then(r => r.data.data),

  logout: () => api.post('/auth/logout').then(r => r.data),

  me: () => api.get('/auth/me').then(r => r.data.data),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(r => r.data),

  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }).then(r => r.data),
};

export const aiService = {
  search: (query) => api.post('/ai/search', { query }).then(r => r.data.data),

  chat: (message, history = []) =>
    api.post('/ai/chat', { message, conversationHistory: history }).then(r => r.data.data),
};

// Image utility
export function getProductImageUrl(publicId, transformations = {}) {
  const baseUrl = `${CONFIG.IMAGE_BASE_URL}/image/upload`;
  const transformParams = new URLSearchParams(transformations).toString();
  return `${baseUrl}/${transformParams}/${publicId}`;
}
