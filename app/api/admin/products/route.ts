import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { Product } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllProductsAdmin, upsertProduct } from "@/lib/products/get-products";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { hasSupabaseServiceRole, createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapProductRow, mapProductToRow, type ProductRow } from "@/lib/products/map";
import { applyOverrides } from "@/lib/overrides";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const products = await getAllProductsAdmin();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const body = (await request.json()) as Product;

  // Try service role key first (bypasses RLS)
  if (hasSupabaseServiceRole()) {
    const result = await upsertProduct(body);
    if (result.ok) {
      return NextResponse.json({ ok: true });
    }
  }

  // Fallback: use admin's own auth session (requires RLS policies)
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const row = {
      ...mapProductToRow(body),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from("products").upsert(row);

    if (!error) {
      // Purge cached pages so new/updated products appear everywhere (including mobile)
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: `Failed to save: ${error.message}. Try setting SUPABASE_SERVICE_ROLE_KEY in Vercel env.` },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "No Supabase environment configured." },
    { status: 400 }
  );
}
