import { cookies } from "next/headers";
import type { Product } from "@/data/products";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/supabase/server";

const BUCKET = "product-overrides";
const FILE = "overrides.json";

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

function applyOverrideMap<T extends Product>(
  products: T[],
  overrides: Record<string, Partial<Product>>
): T[] {
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
}

async function readOverridesFromCookie(): Promise<Record<string, Partial<Product>> | null> {
  try {
    const store = await cookies();
    const raw = store.get("admin_overrides")?.value;
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, Partial<Product>>;
  } catch {
    return null;
  }
}

async function readOverridesFromStorage(): Promise<Record<string, Partial<Product>> | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = createSupabasePublicClient();
    if (!supabase) return null;
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(FILE);
    const res = await fetch(publicUrl, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json() as Record<string, Partial<Product>>;
  } catch {
    return null;
  }
}

export async function applyOverrides<T extends Product>(products: T[]): Promise<T[]> {
  // Try Supabase Storage first (shared across all devices)
  const storageOverrides = await readOverridesFromStorage();
  if (storageOverrides) {
    return applyOverrideMap(products, storageOverrides);
  }

  // Fall back to cookie (same-browser only)
  const cookieOverrides = await readOverridesFromCookie();
  if (cookieOverrides) {
    return applyOverrideMap(products, cookieOverrides);
  }

  return products;
}