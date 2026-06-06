import { ProductGrid } from "@/components/features/ProductGrid";
import { getActiveProducts } from "@/lib/products/get-products";

export const metadata = {
  title: "Products | VIP Raiments"
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <ProductGrid
      eyebrow="Collection"
      title="All drops"
      products={products}
      className="pt-8 sm:pt-12"
    />
  );
}
