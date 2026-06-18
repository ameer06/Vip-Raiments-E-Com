import { Hero } from "@/components/features/Hero";
import { ProductGrid } from "@/components/features/ProductGrid";
import { getActiveProducts } from "@/lib/products/get-products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "VIP Raiments | Premium Streetwear Shirts"
};

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
