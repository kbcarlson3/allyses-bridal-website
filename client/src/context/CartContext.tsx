import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dress } from '../../../shared/src/types';

interface CartItem {
  dress: Dress;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (dress: Dress) => void;
  removeFromCart: (dressId: number) => void;
  updateQuantity: (dressId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('bridalCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bridalCart', JSON.stringify(items));
  }, [items]);

  const addToCart = (dress: Dress) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.dress.id === dress.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.dress.id === dress.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { dress, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (dressId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.dress.id !== dressId));
  };

  const updateQuantity = (dressId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dressId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.dress.id === dressId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.dress.price.replace(/[^0-9.]/g, ''));
      return total + price * item.quantity;
    }, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
