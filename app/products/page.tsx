import { ProductGrid } from "@/components/features/ProductGrid";
import { getActiveProducts } from "@/lib/products/get-products";

export const metadata = {
  title: "Products | VIP Raiments"
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  let products = await getActiveProducts();

  if (filter) {
    products = products.filter(
      (p) => p.category?.toLowerCase() === filter.toLowerCase()
    );
  }

  const title = filter
    ? `${filter.charAt(0).toUpperCase() + filter.slice(1)}`
    : "All drops";

  return (
    <ProductGrid
      eyebrow="Collection"
      title={title}
      products={products}
      className="pt-8 sm:pt-12"
    />
  );
}
