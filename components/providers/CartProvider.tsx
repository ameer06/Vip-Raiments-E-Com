"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { CartLineItem, CartToastState } from "@/lib/cart/types";
import {
  buildLineId,
  loadCartFromStorage,
  saveCartToStorage
} from "@/lib/cart/storage";

type AddItemInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string;
  maxStock: number;
  quantity?: number;
};

type CartContextValue = {
  items: CartLineItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  toast: CartToastState;
  addItem: (input: AddItemInput) => boolean;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<CartToastState>({
    message: "",
    visible: false
  });

  useEffect(() => {
    const stored = loadCartFromStorage();
    const timer = window.setTimeout(() => {
      setItems(stored);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(items);
    }
  }, [items, hydrated]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 2800);
  }, []);

  const dismissToast = useCallback(() => {
    setToast((current) => ({ ...current, visible: false }));
  }, []);

  const addItem = useCallback(
    (input: AddItemInput) => {
      if (input.maxStock <= 0) {
        showToast("This product is out of stock.");
        return false;
      }

      const quantity = input.quantity ?? 1;
      const lineId = buildLineId(input.productId, input.size);

      setItems((current) => {
        const existing = current.find((item) => item.lineId === lineId);
        const nextQuantity = (existing?.quantity ?? 0) + quantity;

        if (nextQuantity > input.maxStock) {
          showToast(`Only ${input.maxStock} units available.`);
          return current;
        }

        if (existing) {
          return current.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: nextQuantity }
              : item
          );
        }

        return [
          ...current,
          {
            lineId,
            productId: input.productId,
            slug: input.slug,
            name: input.name,
            price: input.price,
            size: input.size,
            quantity,
            image: input.image,
            maxStock: input.maxStock
          }
        ];
      });

      showToast(`${input.name} added to cart.`);
      return true;
    },
    [showToast]
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.lineId !== lineId) {
            return item;
          }

          const nextQuantity = Math.min(
            Math.max(1, quantity),
            item.maxStock
          );
          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      hydrated,
      toast,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      dismissToast
    }),
    [
      items,
      count,
      subtotal,
      hydrated,
      toast,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      dismissToast
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
