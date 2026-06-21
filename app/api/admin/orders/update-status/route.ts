import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import { sanitizeInput } from "@/lib/validation";
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

  const body = await request.json();

  if (!body.orderId || !body.status) {
    return NextResponse.json({ error: "orderId and status required" }, { status: 400 });
  }

  const orderId = sanitizeInput(String(body.orderId), 100);
  const status = sanitizeInput(String(body.status), 50) as OrderStatus;
  const note = body.note ? sanitizeInput(String(body.note), 1000) : undefined;
  const trackingNumber = body.trackingNumber ? sanitizeInput(String(body.trackingNumber), 200) : undefined;
  const shippingCarrier = body.shippingCarrier ? sanitizeInput(String(body.shippingCarrier), 100) : undefined;

  const supabase = createSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const currentStatus = order.status as OrderStatus;
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed || !allowed.includes(status)) {
    return NextResponse.json(
      { error: `Cannot transition from "${currentStatus}" to "${status}"` },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {
    status: status,
    updated_at: new Date().toISOString(),
  };

  if (status === "shipped") {
    if (trackingNumber) updates.tracking_number = trackingNumber;
    if (shippingCarrier) updates.shipping_carrier = shippingCarrier;
  }

  if (status === "delivered") {
    updates.delivered_at = new Date().toISOString();
  }

  if (status === "cancelled") {
    updates.cancelled_at = new Date().toISOString();
  }

  if (note) {
    updates.notes = note;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    status: status,
    note: note || null,
    created_by: admin.user.id,
  });

  return NextResponse.json({ ok: true });
}
