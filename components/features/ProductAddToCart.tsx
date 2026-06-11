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
    <div className="mt-6 grid gap-4 sm:mt-8">
      <fieldset>
        <legend className="label-mono mb-2">Size</legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={`min-w-12 rounded-control border border-ink/20 px-3 py-2 text-sm font-semibold ${
                size === option
                  ? "bg-ink text-white"
                  : "bg-white hover:bg-surface"
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
