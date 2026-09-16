"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartItem } from "@/app/types/commerce";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getItem: (
    cartItemId: string
  ) => CartItem | undefined;
};

const CartContext =
  createContext<CartContextValue | null>(null);

const STORAGE_KEY = "newjersey-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        STORAGE_KEY
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load NewJersey cart:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Unable to save NewJersey cart:",
        error
      );
    }
  }, [items, hydrated]);

const addItem = useCallback((item: CartItem) => {
  setItems((current) => {
    const alreadyExists = current.some(
      (existing) =>
        existing.cartItemId === item.cartItemId
    );

    if (alreadyExists) {
      return current;
    }

    return [...current, item];
  });
}, []);

  const removeItem = useCallback(
    (cartItemId: string) => {
      setItems((current) =>
        current.filter(
          (item) =>
            item.cartItemId !== cartItemId
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      cartItemId: string,
      quantity: number
    ) => {
      if (quantity <= 0) {
        setItems((current) =>
          current.filter(
            (item) =>
              item.cartItemId !== cartItemId
          )
        );

        return;
      }

      setItems((current) =>
        current.map((item) => {
          if (
            item.cartItemId !== cartItemId
          ) {
            return item;
          }

          return {
            ...item,
            quantity,
            totalPrice:
              item.unitPrice * quantity,
          };
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItem = useCallback(
    (cartItemId: string) =>
      items.find(
        (item) =>
          item.cartItemId === cartItemId
      ),
    [items]
  );

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.totalPrice,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItem,
    }),
    [
      items,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItem,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}