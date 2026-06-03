"use client";

import { useCallback, useState } from "react";

type CartState = {
  productIds: string[];
};

export function useCart() {
  const [cart, setCart] = useState<CartState>({ productIds: [] });

  const addItem = useCallback((productId: string) => {
    setCart((current) => ({
      productIds: [...current.productIds, productId]
    }));
  }, []);

  return {
    cart,
    addItem,
    count: cart.productIds.length
  };
}
