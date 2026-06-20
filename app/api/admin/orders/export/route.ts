import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Service role key required" }, { status: 500 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";

  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "Order ID",
    "Date",
    "Customer",
    "Email",
    "Phone",
    "Address",
    "City",
    "Postal Code",
    "Items",
    "Total (INR)",
    "Payment Method",
    "Payment Reference",
    "Status",
    "Tracking Number",
    "Carrier",
  ].join(",");

  const rows = (orders ?? []).map((order) => {
    const items = (order.order_items ?? [])
      .map((i: { product_name: string; size: string; quantity: number }) => `${i.product_name} (${i.size}) x${i.quantity}`)
      .join("; ");

    return [
      order.id.slice(0, 8),
      new Date(order.created_at).toLocaleDateString("en-IN"),
      escapeCsv(order.customer_name),
      order.email,
      order.phone || "",
      escapeCsv(order.address_line),
      order.city,
      order.postal_code,
      escapeCsv(items),
      order.total_inr,
      order.payment_provider,
      order.payment_reference || "",
      order.status,
      order.tracking_number || "",
      order.shipping_carrier || "",
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
