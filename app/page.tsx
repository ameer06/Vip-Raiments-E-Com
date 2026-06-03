import { Hero } from "@/components/features/Hero";
import { ProductGrid } from "@/components/features/ProductGrid";
import { featuredProducts } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid
        eyebrow="Featured"
        title="Built for first-look buyers"
        products={featuredProducts}
      />
    </>
  );
}
