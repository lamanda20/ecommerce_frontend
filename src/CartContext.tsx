import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "./types";

export type CartItem = {
  product: Product;
  variant: string;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addToCart: (product: Product, variant: string) => void;
  removeFromCart: (productId: number, variant: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant: string) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product.id === product.id && item.variant === variant
      );

      if (existingIndex !== -1) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      return [...current, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number, variant: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.product.id === productId && item.variant === variant)
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
