import { NextResponse } from "next/server";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import { sanitizeInput, isValidEmail } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawOrderId = url.searchParams.get("orderId");
  const rawEmail = url.searchParams.get("email");

  if (!rawOrderId && !rawEmail) {
    return NextResponse.json({ error: "orderId or email required" }, { status: 400 });
  }

  if (rawOrderId && typeof rawOrderId === "string") {
    const orderId = sanitizeInput(rawOrderId, 100);
    if (orderId.length < 3) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
  }

  if (rawEmail && typeof rawEmail === "string") {
    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
  }

  const orderId = rawOrderId ? sanitizeInput(rawOrderId, 100) : null;
  const email = rawEmail ? sanitizeInput(rawEmail, 254) : null;

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("orders")
    .select("id, email, customer_name, status, total_inr, payment_provider, created_at, updated_at, tracking_number, shipping_carrier, estimated_delivery, delivered_at, address_line, city, postal_code")
    .order("created_at", { ascending: false })
    .limit(20);

  if (orderId) {
    query = query.ilike("id", `%${orderId}%`);
  }

  if (email) {
    query = query.eq("email", email);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ordersWithItems = await Promise.all(
    (orders ?? []).map(async (order) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, product_slug, size, quantity, unit_price_inr, line_total_inr")
        .eq("order_id", order.id);

      const { data: history } = await supabase
        .from("order_status_history")
        .select("status, note, created_at")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });

      return { ...order, order_items: items ?? [], status_history: history ?? [] };
    })
  );

  return NextResponse.json({ orders: ordersWithItems });
}
