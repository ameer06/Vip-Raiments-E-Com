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
      if (!override) return p;
      const { category: _, ...safe } = override;
      return { ...p, ...safe };
    });

    for (const entry of Object.values(overrides)) {
      if (isValidProduct(entry) && !result.find((p) => p.id === entry.id)) {
        const { category: _, ...clean } = entry;
        result.push(clean as unknown as T);
      }
    }

    return result;
  } catch (error) {
    console.error("Failed to apply overrides from cookie:", error);
    return products;
  }
}