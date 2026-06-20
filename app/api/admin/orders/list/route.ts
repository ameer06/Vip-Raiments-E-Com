import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ orders: [] });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const sortBy = url.searchParams.get("sort") || "created_at";
  const sortOrder = url.searchParams.get("order") || "desc";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", { count: "exact" });

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,email.ilike.%${search}%,id.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const offset = (page - 1) * limit;
  query = query
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
