"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatInr } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-ink/10 bg-white p-6 text-center shadow-card sm:p-8">
        <p className="text-lg font-semibold sm:text-xl">Your cart is empty</p>
        <p className="mt-2 text-sm text-ink/50 sm:mt-3">
          Add products from the collection to continue.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-control bg-ink px-5 text-sm font-semibold text-white sm:mt-6"
        >
          Browse drops
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ul className="grid gap-3 sm:gap-4">
        {items.map((item) => (
          <li
            key={item.lineId}
            className="grid grid-cols-[72px_1fr] items-start gap-3 rounded-card border border-ink/10 bg-white p-3 shadow-card min-[400px]:grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr_auto] sm:gap-4 sm:p-4"
          >
            <div className="relative aspect-[4/5] w-full self-start overflow-hidden rounded-control bg-ink">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="block truncate text-sm font-semibold hover:text-ink sm:text-lg"
              >
                {item.name}
              </Link>
              <p className="mt-0.5 text-xs text-ink/50 sm:mt-1 sm:text-sm">
                Size {item.size}
              </p>
              <p className="mt-1 text-sm font-semibold sm:mt-2">{formatInr(item.price)}</p>

              {/* Mobile quantity + remove controls */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:hidden">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.lineId, item.quantity - 1)
                    }
                    className="grid h-8 w-8 place-items-center rounded-control border border-ink/10 bg-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateQuantity(item.lineId, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.maxStock}
                    className="grid h-8 w-8 place-items-center rounded-control border border-ink/10 bg-white disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-ink"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>

            {/* Desktop quantity + remove controls */}
            <div className="hidden flex-col items-end justify-between gap-3 sm:flex">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(item.lineId, item.quantity - 1)
                  }
                  className="grid h-9 w-9 place-items-center rounded-control border border-ink/10 bg-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(item.lineId, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.maxStock}
                  className="grid h-9 w-9 place-items-center rounded-control border border-ink/10 bg-white disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.lineId)}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-ink"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-card border border-ink/10 bg-white p-card-pad shadow-card lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold sm:text-2xl">Order summary</h2>
        <div className="mt-3 flex items-center justify-between text-sm font-medium sm:mt-4">
          <span>Subtotal</span>
          <span>{formatInr(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-ink/50">
          Shipping calculated at checkout (mock).
        </p>
        <Link
          href="/checkout"
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-control bg-ink text-sm font-semibold text-white sm:mt-6"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
