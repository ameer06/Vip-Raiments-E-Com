import type { Product } from "@/data/products";

const store = new Map<string, Partial<Product>>();

export function setOverride(id: string, data: Partial<Product>) {
  store.set(id, data);
}

export function applyOverrides<T extends Product>(products: T[]): T[] {
  if (store.size === 0) return products;
  return products.map((p) => {
    const override = store.get(p.id);
    return override ? { ...p, ...override } : p;
  });
}