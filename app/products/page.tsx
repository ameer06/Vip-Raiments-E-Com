import { ProductGrid } from "@/components/features/ProductGrid";
import { featuredProducts } from "@/data/products";

export const metadata = {
  title: "Products | VIP Raiments"
};

export default function ProductsPage() {
  return (
    <ProductGrid
      eyebrow="Collection"
      title="All drops"
      products={featuredProducts}
      className="pt-12"
    />
  );
}
