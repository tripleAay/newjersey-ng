// src/contexts/wishlistContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type WishlistItem = {
  id: number | string;
  name: string;
  price: string;
  image: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number | string) => void;
  clearWishlist: () => void;
  isWishlisted: (id: number | string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "fynaro-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as WishlistItem[]);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => setItems([]);

  const isWishlisted = (id: number | string) =>
    items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, clearWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
