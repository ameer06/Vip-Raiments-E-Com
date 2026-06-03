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
    <section className={cn("mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-normal text-electric-blue">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-normal sm:text-5xl">
            {title}
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm font-semibold text-ink/62 sm:block">
          Fast-loading cards ready for Supabase inventory and variant data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
