import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductAddToCart } from "@/components/features/ProductAddToCart";
import { getProductBySlug } from "@/lib/products/get-products";
import { featuredProducts } from "@/data/products";
import { formatInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return featuredProducts
    .filter((p) => p.status === "active")
    .map((product) => ({
      slug: product.slug
    }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} | VIP Raiments` : "Product | VIP Raiments"
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {product.images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink shadow-card"
          >
            <Image
              src={image}
              alt={index === 0 ? product.name : ""}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shits
        </Link>
        <p className="label-mono mb-2 text-ink/50 sm:mb-3">
          {product.badge ?? "Limited"}
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {product.name}
        </h1>
        <p className="mt-3 text-base text-ink/60 sm:mt-4 sm:text-lg">{product.color}</p>
        <p className="mt-4 text-xl font-semibold sm:mt-6 sm:text-2xl">{formatInr(product.price)}</p>
        <div className="mt-4 grid gap-2 text-sm text-ink/60 sm:mt-6">
          <p>Available sizes: {product.sizes.join(", ")}</p>
          <p>Inventory: {product.stock} units</p>
        </div>
        <ProductAddToCart product={product} />
      </div>
    </section>
  );
}
