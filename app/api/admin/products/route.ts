import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { Product } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllProductsAdmin, upsertProduct } from "@/lib/products/get-products";

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
  const result = await upsertProduct(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Purge cached pages so new/updated products appear everywhere (including mobile)
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");

  return NextResponse.json({ ok: true });
}
