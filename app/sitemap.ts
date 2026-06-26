import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products/get-products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://vip-raiments.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getActiveProducts();
    productPages = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // fallback to empty
  }

  return [...staticPages, ...productPages];
}
