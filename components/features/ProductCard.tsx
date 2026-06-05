"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { AddToCartButton } from "@/components/features/AddToCartButton";
import { formatInr } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className="group overflow-hidden border-2 border-ink bg-white shadow-brutal"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition duration-500 group-hover:opacity-0"
          priority={product.isPriority}
        />
        <Image
          src={product.images[1]}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 border-2 border-ink bg-electric-blue px-2 py-1 text-[11px] font-black uppercase text-white">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black uppercase tracking-normal">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="mt-1 text-sm font-semibold text-ink/60">
              {product.color}
            </p>
          </div>
          <p className="text-sm font-black">{formatInr(product.price)}</p>
        </div>

        <AddToCartButton
          product={product}
          label="Quick add"
          className="h-10 bg-bone px-3 text-xs shadow-none hover:bg-electric-blue hover:text-white"
        />
      </div>
    </motion.article>
  );
}
