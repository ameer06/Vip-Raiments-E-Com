import type { Product } from "@/data/products";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  color: string;
  price_inr: number;
  stock: number;
  sizes: string[];
  status: "active" | "draft" | "archived";
  badge: string | null;
  front_image_url: string;
  hover_image_url: string;
  is_priority: boolean;
  category: string | null;
};

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    color: row.color,
    price: row.price_inr,
    stock: row.stock,
    sizes: row.sizes ?? [],
    status: row.status,
    badge: row.badge ?? undefined,
    images: [row.front_image_url, row.hover_image_url],
    isPriority: row.is_priority,
    category: row.category ?? undefined,
  };
}

export function mapProductToRow(product: Product): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    color: product.color,
    price_inr: product.price,
    stock: product.stock,
    sizes: product.sizes,
    status: product.status,
    badge: product.badge ?? null,
    front_image_url: product.images[0],
    hover_image_url: product.images[1],
    is_priority: product.isPriority ?? false,
    category: product.category ?? null,
  };
}
