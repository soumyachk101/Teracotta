import { createContext, useContext, useMemo } from 'react';
import { useCartStore } from '../store/cartStore';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCartStore();

  const value = useMemo(
    () => ({
      ...cart,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
