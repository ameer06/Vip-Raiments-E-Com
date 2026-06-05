import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductAddToCart } from "@/components/features/ProductAddToCart";
import { getActiveProducts, getProductBySlug } from "@/lib/products/get-products";
import { formatInr } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({
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
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
      <div className="grid gap-4 sm:grid-cols-2">
        {product.images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-[4/5] overflow-hidden border-2 border-ink bg-ink shadow-brutal"
          >
            <Image
              src={image}
              alt={index === 0 ? product.name : ""}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover grayscale"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black uppercase text-ink/70 hover:text-electric-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to drops
        </Link>
        <p className="mb-3 text-xs font-black uppercase text-electric-blue">
          {product.badge ?? "Limited"}
        </p>
        <h1 className="text-5xl font-black uppercase leading-none tracking-normal sm:text-6xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg font-bold text-ink/64">{product.color}</p>
        <p className="mt-6 text-2xl font-black">{formatInr(product.price)}</p>
        <div className="mt-6 grid gap-2 text-sm font-bold text-ink/70">
          <p>Available sizes: {product.sizes.join(", ")}</p>
          <p>Inventory: {product.stock} units</p>
        </div>
        <ProductAddToCart product={product} />
      </div>
    </section>
  );
}
