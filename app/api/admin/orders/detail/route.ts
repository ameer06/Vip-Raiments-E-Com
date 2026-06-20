import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Service role key required" }, { status: 500 });
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: history } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ order, history: history ?? [] });
}
