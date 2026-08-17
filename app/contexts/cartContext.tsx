// contexts/cartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Product = {
  id: number | string;
  name: string;
  price: string; // "₦25,000.00"
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  /** Decrease quantity by 1; remove item if it hits 0/1 */
  decrementItem: (id: number | string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "fynaro-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage after mount (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed);
      }
    } catch {
      // ignore parse/storage errors
    }
  }, []);

  // Persist whenever items change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === product.id);
      if (existingIndex !== -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + 1,
        };
        return copy;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decrementItem = (id: number | string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        // remove items that are now 0 or below
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, decrementItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
