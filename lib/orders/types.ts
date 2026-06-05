import type { CartLineItem } from "@/lib/cart/types";

export type CheckoutPayload = {
  email: string;
  customerName: string;
  phone?: string;
  addressLine: string;
  city: string;
  postalCode: string;
  items: CartLineItem[];
};

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };
