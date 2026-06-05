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
      <div className="border-2 border-ink bg-white p-8 text-center shadow-brutal">
        <p className="text-lg font-black uppercase">Your cart is empty</p>
        <p className="mt-3 text-sm font-semibold text-ink/65">
          Add products from the collection to continue.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white"
        >
          Browse drops
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <ul className="grid gap-4">
        {items.map((item) => (
          <li
            key={item.lineId}
            className="grid gap-4 border-2 border-ink bg-white p-4 shadow-brutal sm:grid-cols-[120px_1fr_auto]"
          >
            <div className="relative aspect-[4/5] overflow-hidden border-2 border-ink bg-ink">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="120px"
                className="object-cover grayscale"
              />
            </div>

            <div>
              <Link
                href={`/products/${item.slug}`}
                className="text-lg font-black uppercase hover:text-electric-blue"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-ink/60">
                Size {item.size}
              </p>
              <p className="mt-2 text-sm font-black">{formatInr(item.price)}</p>
            </div>

            <div className="flex flex-col items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(item.lineId, item.quantity - 1)
                  }
                  className="grid h-9 w-9 place-items-center border-2 border-ink bg-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-black">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(item.lineId, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.maxStock}
                  className="grid h-9 w-9 place-items-center border-2 border-ink bg-white disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.lineId)}
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-ink/60 hover:text-ink"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit border-2 border-ink bg-white p-5 shadow-brutal-blue lg:sticky lg:top-24">
        <h2 className="text-2xl font-black uppercase">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm font-bold">
          <span>Subtotal</span>
          <span>{formatInr(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-ink/55">
          Shipping calculated at checkout (mock).
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center border-2 border-ink bg-ink text-sm font-black uppercase text-white shadow-brutal-blue"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
