import { cookies } from "next/headers";
import type { Product } from "@/data/products";

function isValidProduct(data: unknown): data is Product {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    typeof d.slug === "string" &&
    typeof d.price === "number" &&
    Array.isArray(d.images) &&
    d.images.length >= 2 &&
    Array.isArray(d.sizes) &&
    typeof d.status === "string" &&
    typeof d.color === "string"
  );
}

export async function applyOverrides<T extends Product>(products: T[]): Promise<T[]> {
  try {
    const store = await cookies();
    const raw = store.get("admin_overrides")?.value;
    if (!raw) return products;
    const overrides = JSON.parse(raw) as Record<string, Partial<Product>>;

    const result = products.map((p) => {
      const override = overrides[p.id];
      return override ? { ...p, ...override } : p;
    });

    for (const entry of Object.values(overrides)) {
      if (isValidProduct(entry) && !result.find((p) => p.id === entry.id)) {
        result.push(entry as unknown as T);
      }
    }

    return result;
  } catch {
    return products;
  }
}