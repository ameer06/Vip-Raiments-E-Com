import { ProductCard } from "@/components/features/ProductCard";
import { ProductSearchBar } from "@/components/features/ProductSearchBar";
import { ProductSort } from "@/components/features/ProductSort";
import { getActiveProducts } from "@/lib/products/get-products";
import type { SortOption } from "@/components/features/ProductSort";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | VIP Raiments"
};

function sortProducts(
  products: Awaited<ReturnType<typeof getActiveProducts>>,
  sort: SortOption
) {
  const sorted = [...products];
  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted;
  }
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string; q?: string; sort?: string }>;
}) {
  const { filter, q, sort } = await searchParams;
  let products = await getActiveProducts();

  if (filter) {
    products = products.filter(
      (p) => p.category?.toLowerCase() === filter.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  const sorted = sortProducts(products, (sort as SortOption) ?? "newest");

  const title = filter
    ? `${filter.charAt(0).toUpperCase() + filter.slice(1)}`
    : "All shirts";

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <p className="label-mono mb-1 text-ink/50 sm:mb-2">
          {filter ?? "all shirts"}
        </p>
        <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
          {title}
        </h2>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <ProductSearchBar />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink/50">
            {sorted.length} {sorted.length === 1 ? "product" : "products"}
          </span>
          <ProductSort />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-ink/60">No products found</p>
          <p className="mt-1 text-sm text-ink/40">
            Try a different search term or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
