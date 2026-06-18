"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { AddToCartButton } from "@/components/features/AddToCartButton";
import { formatInr } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-card border border-ink/10 bg-white shadow-card hover:shadow-card-hover">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition duration-500 group-hover:opacity-0"
          priority={product.isPriority}
        />
        <Image
          src={product.images[1]}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        {product.badge ? (
          <span className="label-mono absolute left-3 top-3 rounded-control bg-ink px-2 py-1 text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1.5">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="grid gap-2 p-card-pad">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="shrink-0 whitespace-nowrap text-sm font-semibold">
              {formatInr(product.price)}
            </p>
          </div>
          <p className="mt-0.5 truncate text-sm text-ink/50">
            {product.color}
          </p>
        </div>

        <AddToCartButton
          product={product}
          label="Quick add"
          fullWidth
          className="h-9 rounded-control bg-stone-800 px-3 text-xs font-semibold text-white"
        />
      </div>
    </article>
  );
}