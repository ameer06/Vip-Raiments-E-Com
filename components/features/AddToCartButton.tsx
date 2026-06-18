"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/providers/CartProvider";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: Product;
  size?: string;
  className?: string;
  label?: string;
  fullWidth?: boolean;
};

export function AddToCartButton({
  product,
  size,
  className,
  label = "Add to cart",
  fullWidth = false
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const selectedSize = size ?? product.sizes[0];
  const outOfStock = product.stock <= 0 || product.status !== "active";

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          size: selectedSize,
          image: product.images[0],
          maxStock: product.stock
        })
      }
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-control bg-stone-800 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        className
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {outOfStock ? "Out of stock" : label}
    </button>
  );
}
