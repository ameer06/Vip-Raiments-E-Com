import type { CartLineItem } from "@/lib/cart/types";

const CART_STORAGE_KEY = "vip-raiments-cart-v1";

export function loadCartFromStorage(): CartLineItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartLineItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function buildLineId(productId: string, size: string) {
  return `${productId}:${size}`;
}
