import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/orders/types";
import { VALID_STATUS_TRANSITIONS as VALID_TRANSITIONS } from "@/lib/orders/types";

interface UpdateStatusRequest {
  orderId: string;
  status: OrderStatus;
  note?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Service role key required" }, { status: 500 });
  }

  const body: UpdateStatusRequest = await request.json();

  if (!body.orderId || !body.status) {
    return NextResponse.json({ error: "orderId and status required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", body.orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const currentStatus = order.status as OrderStatus;
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed || !allowed.includes(body.status)) {
    return NextResponse.json(
      { error: `Cannot transition from "${currentStatus}" to "${body.status}"` },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {
    status: body.status,
    updated_at: new Date().toISOString(),
  };

  if (body.status === "shipped") {
    if (body.trackingNumber) updates.tracking_number = body.trackingNumber;
    if (body.shippingCarrier) updates.shipping_carrier = body.shippingCarrier;
  }

  if (body.status === "delivered") {
    updates.delivered_at = new Date().toISOString();
  }

  if (body.status === "cancelled") {
    updates.cancelled_at = new Date().toISOString();
  }

  if (body.note) {
    updates.notes = body.note;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", body.orderId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from("order_status_history").insert({
    order_id: body.orderId,
    status: body.status,
    note: body.note || null,
    created_by: admin.user.id,
  });

  return NextResponse.json({ ok: true });
}
