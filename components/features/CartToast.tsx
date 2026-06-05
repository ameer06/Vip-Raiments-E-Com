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
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-md items-center justify-between gap-3 border-2 border-ink bg-white p-4 shadow-brutal-blue sm:left-auto sm:right-6"
    >
      <p className="text-sm font-bold text-ink/80">{toast.message}</p>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/cart"
          className="border-2 border-ink bg-ink px-3 py-1 text-xs font-black uppercase text-white"
          onClick={dismissToast}
        >
          View cart
        </Link>
        <button
          type="button"
          onClick={dismissToast}
          className="border-2 border-ink px-2 py-1 text-xs font-black uppercase"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}
