"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { AddToCartButton } from "@/components/features/AddToCartButton";

type ProductAddToCartProps = {
  product: Product;
};

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const [size, setSize] = useState(product.sizes[0]);

  return (
    <div className="mt-8 grid gap-4">
      <fieldset>
        <legend className="mb-2 text-xs font-black uppercase">Size</legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={`min-w-12 border-2 border-ink px-3 py-2 text-sm font-black uppercase ${
                size === option
                  ? "bg-electric-blue text-white"
                  : "bg-white hover:bg-bone"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <AddToCartButton product={product} size={size} fullWidth label="Add to cart" />
    </div>
  );
}
