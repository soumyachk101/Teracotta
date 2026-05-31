export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  PRODUCTS_FEATURED: 'productsFeatured',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER: 'order',
  ARTISANS: 'artisans',
  REVIEWS: 'reviews',
  REVIEWS_PRODUCT: (productId) => ['reviews', productId],
  WISHLIST: 'wishlist',
  USER: 'user',
  CATEGORIES_ALL: 'categoriesAll',
};
