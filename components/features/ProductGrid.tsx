import { ProductCard } from "@/components/features/ProductCard";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  eyebrow: string;
  title: string;
  products: Product[];
  className?: string;
};

export function ProductGrid({
  eyebrow,
  title,
  products,
  className
}: ProductGridProps) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-section sm:px-6 lg:px-8", className)}>
      <div className="mb-8 sm:mb-12">
        <p className="label-mono mb-1 text-ink/50 sm:mb-2">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
