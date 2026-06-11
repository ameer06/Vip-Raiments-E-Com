"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

export function CartToast() {
  const { toast, dismissToast } = useCart();

  if (!toast.visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-md items-center justify-between gap-3 rounded-card border border-ink/10 bg-white p-4 shadow-card sm:left-auto sm:right-6"
    >
      <p className="text-sm font-medium text-ink/80">{toast.message}</p>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/cart"
          className="rounded-control bg-ink px-3 py-1.5 text-xs font-semibold text-white"
          onClick={dismissToast}
        >
          View cart
        </Link>
        <button
          type="button"
          onClick={dismissToast}
          className="rounded-control border border-ink/10 px-3 py-1.5 text-xs font-medium"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}
