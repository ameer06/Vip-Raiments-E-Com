import { ProductGrid } from "@/components/features/ProductGrid";
import { getActiveProducts } from "@/lib/products/get-products";

// Re-fetch products at most every 60 seconds so admin-added items appear on all devices
export const revalidate = 60;

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
