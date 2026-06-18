import { Hero } from "@/components/features/Hero";
import { ProductGrid } from "@/components/features/ProductGrid";
import { getActiveProducts } from "@/lib/products/get-products";

// Re-fetch products at most every 60 seconds so admin-added items appear on all devices
export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Hero />
      <ProductGrid
        eyebrow="Featured"
        title="Built for first-look buyers"
        products={products}
      />
    </>
  );
}
