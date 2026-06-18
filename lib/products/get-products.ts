import { featuredProducts, type Product } from "@/data/products";
import { mapProductRow, mapProductToRow, type ProductRow } from "@/lib/products/map";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { applyOverrides } from "@/lib/overrides";

function getStaticActiveProducts() {
  return featuredProducts.filter((product) => product.status === "active");
}

function getStaticAllProducts() {
  return featuredProducts;
}

async function fetchFromSupabase(activeOnly: boolean) {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return null;
  }

  let query = supabase.from("products").select("*").order("created_at", {
    ascending: false
  });

  if (activeOnly) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return null;
  }

  return (data as ProductRow[]).map(mapProductRow);
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return applyOverrides(getStaticActiveProducts());
  }

  const products = await fetchFromSupabase(true);
  return applyOverrides(products ?? getStaticActiveProducts());
}

export async function getAllProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return applyOverrides(getStaticAllProducts());
  }

  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return applyOverrides(getStaticAllProducts());
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return applyOverrides(getStaticAllProducts());
  }

  return applyOverrides((data as ProductRow[]).map(mapProductRow));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getActiveProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  // Try service role key first (bypasses RLS)
  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data?.length) {
      return applyOverrides((data as ProductRow[]).map(mapProductRow));
    }
  }

  // Fallback: use server client (admin's auth session + RLS)
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data?.length) {
      return applyOverrides((data as ProductRow[]).map(mapProductRow));
    }
  }

  return applyOverrides(getStaticAllProducts());
}

export async function upsertProduct(product: Product) {
  if (!hasSupabaseServiceRole()) {
    return { ok: false as const, error: "Service role key required for admin saves." };
  }

  const supabase = createSupabaseAdminClient();
  const row = {
    ...mapProductToRow(product),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("products").upsert(row);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
