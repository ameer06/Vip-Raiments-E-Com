import { cookies } from "next/headers";
import type { Product } from "@/data/products";

export async function applyOverrides<T extends Product>(products: T[]): Promise<T[]> {
  try {
    const store = await cookies();
    const raw = store.get("admin_overrides")?.value;
    if (!raw) return products;
    const overrides = JSON.parse(raw) as Record<string, Partial<Product>>;
    return products.map((p) => {
      const override = overrides[p.id];
      return override ? { ...p, ...override } : p;
    });
  } catch {
    return products;
  }
}