"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/app/types/commerce";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  designFee: number;
  estimatedTotal: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (cartItemId: string) => CartItem | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "newjersey-cart";
const MAX_ITEMS = 100;
const MAX_QUANTITY = 1000;
const MAX_MONEY = Number.MAX_SAFE_INTEGER / 100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= MAX_MONEY
  );
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function getDesignFee(item: CartItem) {
  return item.artwork?.type === "design-needed"
    ? (item.artwork.designFee ?? 0)
    : 0;
}

function createCartItemId(item: {
  productId: string;
  selections: CartItem["selections"];
  artwork?: CartItem["artwork"];
}) {
  const signature = item.selections
    .map(
      (selection) =>
        `${encodeURIComponent(selection.optionId)}:${encodeURIComponent(
          selection.choiceId,
        )}`,
    )
    .sort()
    .join("|");

  const artworkType = item.artwork?.type ?? "customer-supplied";

  return `${encodeURIComponent(item.productId)}__${signature}__${artworkType}`;
}

/*
 * Browser prices are estimates.
 * The order API must independently verify them.
 */
function normalizeItem(value: unknown): CartItem | null {
  if (!isRecord(value)) return null;

  if (
    !isText(value.productId) ||
    !isText(value.slug) ||
    !isText(value.name) ||
    typeof value.image !== "string"
  ) {
    return null;
  }

  if (
    typeof value.quantity !== "number" ||
    !Number.isSafeInteger(value.quantity) ||
    value.quantity < 1 ||
    value.quantity > MAX_QUANTITY ||
    !isMoney(value.basePrice) ||
    !Array.isArray(value.selections)
  ) {
    return null;
  }

  const selections: CartItem["selections"] = [];
  const optionIds = new Set<string>();

  for (const selection of value.selections) {
    if (
      !isRecord(selection) ||
      !isText(selection.optionId) ||
      !isText(selection.optionLabel) ||
      !isText(selection.choiceId) ||
      !isText(selection.choiceLabel) ||
      !isMoney(selection.priceModifier) ||
      optionIds.has(selection.optionId)
    ) {
      return null;
    }

    optionIds.add(selection.optionId);

    selections.push({
      optionId: selection.optionId,
      optionLabel: selection.optionLabel,
      choiceId: selection.choiceId,
      choiceLabel: selection.choiceLabel,
      priceModifier: roundMoney(selection.priceModifier),
    });
  }

  let artwork: CartItem["artwork"];

  if (value.artwork !== undefined) {
    if (
      !isRecord(value.artwork) ||
      (value.artwork.type !== "customer-supplied" &&
        value.artwork.type !== "design-needed" &&
        value.artwork.type !== "not-required") ||
      (value.artwork.designFee !== undefined &&
        !isMoney(value.artwork.designFee))
    ) {
      return null;
    }

    artwork = {
      type: value.artwork.type,
      designFee:
        value.artwork.type === "design-needed" &&
        isMoney(value.artwork.designFee)
          ? roundMoney(value.artwork.designFee)
          : 0,
    };
  }

  const basePrice = roundMoney(value.basePrice);

  const optionsTotal = roundMoney(
    selections.reduce((sum, selection) => sum + selection.priceModifier, 0),
  );

  const unitPrice = roundMoney(basePrice + optionsTotal);

  // Production only. Design is added once separately.
  const totalPrice = roundMoney(unitPrice * value.quantity);

  const designFee =
    artwork?.type === "design-needed" ? (artwork.designFee ?? 0) : 0;

  if (
    !isMoney(optionsTotal) ||
    !isMoney(unitPrice) ||
    !isMoney(totalPrice) ||
    !isMoney(roundMoney(totalPrice + designFee))
  ) {
    return null;
  }

  const item: CartItem = {
    cartItemId: "",
    productId: value.productId,
    slug: value.slug,
    name: value.name,
    image: value.image,
    quantity: value.quantity,
    basePrice,
    optionsTotal,
    unitPrice,
    totalPrice,
    selections,
    artwork,
  };

  item.cartItemId = createCartItemId(item);

  return item;
}

function calculateTotals(items: CartItem[]) {
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.totalPrice, 0),
  );

  const designFee = roundMoney(
    items.reduce((sum, item) => sum + getDesignFee(item), 0),
  );

  return {
    subtotal,
    designFee,
    estimatedTotal: roundMoney(subtotal + designFee),
  };
}

function validCart(items: CartItem[]) {
  const totals = calculateTotals(items);

  return (
    items.length <= MAX_ITEMS &&
    isMoney(totals.subtotal) &&
    isMoney(totals.designFee) &&
    isMoney(totals.estimatedTotal)
  );
}

function mergeItem(current: CartItem[], incoming: CartItem): CartItem[] {
  const existing = current.find(
    (item) => item.cartItemId === incoming.cartItemId,
  );

  if (!existing) {
    const next = [...current, incoming];
    return validCart(next) ? next : current;
  }

  const quantity = existing.quantity + incoming.quantity;

  if (!Number.isSafeInteger(quantity) || quantity > MAX_QUANTITY) {
    return current;
  }

  const totalPrice = roundMoney(incoming.unitPrice * quantity);

  if (!isMoney(totalPrice)) return current;

  const next = current.map((item) =>
    item.cartItemId === incoming.cartItemId
      ? {
          ...incoming,
          quantity,
          totalPrice,
        }
      : item,
  );

  return validCart(next) ? next : current;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const restored = parsed.reduce<CartItem[]>((current, value) => {
            const item = normalizeItem(value);

            return item ? mergeItem(current, item) : current;
          }, []);

          setItems(restored);
        }
      }
    } catch (error) {
      console.error("Unable to load NewJersey cart:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save NewJersey cart:", error);
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    const normalized = normalizeItem(item);

    if (!normalized) {
      throw new Error("Cannot add an invalid cart item.");
    }

    setItems((current) => mergeItem(current, normalized));
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((current) =>
      current.filter((item) => item.cartItemId !== cartItemId),
    );
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 0 ||
      quantity > MAX_QUANTITY
    ) {
      return;
    }

    setItems((current) => {
      if (quantity === 0) {
        return current.filter((item) => item.cartItemId !== cartItemId);
      }

      const next = current.map((item) => {
        if (item.cartItemId !== cartItemId) {
          return item;
        }

        const totalPrice = roundMoney(item.unitPrice * quantity);

        if (!isMoney(totalPrice)) return item;

        return {
          ...item,
          quantity,
          totalPrice,
        };
      });

      return validCart(next) ? next : current;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItem = useCallback(
    (cartItemId: string) =>
      items.find((item) => item.cartItemId === cartItemId),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const { subtotal, designFee, estimatedTotal } = useMemo(
    () => calculateTotals(items),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      designFee,
      estimatedTotal,
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
      designFee,
      estimatedTotal,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
