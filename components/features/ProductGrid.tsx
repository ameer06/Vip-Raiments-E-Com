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
    <section className={cn("mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8", className)}>
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-normal text-ink/50 sm:mb-2">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-normal sm:text-3xl lg:text-5xl">
            {title}
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm font-semibold text-ink/62 sm:block">
          Fast-loading cards ready for Supabase inventory and variant data.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
