import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/validation";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import type { CartLineItem } from "@/lib/cart/types";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const rl = checkRateLimit(`upi-confirm:${ip}`, 10, 60_000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs);
    const { txnId: rawTxnId } = await request.json();
    if (!rawTxnId || typeof rawTxnId !== "string") {
      return Response.json(
        { ok: false, error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const txnId = sanitizeInput(rawTxnId, 100);
    if (!/^TXN\d{13,}[A-Z0-9]{4,}$/.test(txnId)) {
      return Response.json(
        { ok: false, error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: intent, error: fetchError } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("txn_id", txnId)
      .single();

    if (fetchError || !intent) {
      return Response.json(
        { ok: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (intent.status !== "pending") {
      return Response.json(
        { ok: false, error: "Payment already processed" },
        { status: 400 }
      );
    }

    const payload = intent.checkout_payload as {
      email: string;
      customerName: string;
      phone: string | null;
      addressLine: string;
      city: string;
      postalCode: string;
      items: CartLineItem[];
    } | null;

    if (!payload || !payload.items?.length) {
      return Response.json(
        { ok: false, error: "Missing checkout data" },
        { status: 500 }
      );
    }

    const totalInr = payload.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of payload.items) {
      try {
        const { data: deducted } = await supabase.rpc("deduct_stock", {
          p_product_id: item.productId,
          p_quantity: item.quantity,
        });

        if (deducted === false) {
          return Response.json(
            {
              ok: false,
              error: `Not enough stock for ${item.name}.`,
            },
            { status: 400 }
          );
        }
      } catch {
        // products table doesn't exist — skip stock update
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email: payload.email,
        customer_name: payload.customerName,
        phone: payload.phone || null,
        address_line: payload.addressLine,
        city: payload.city,
        postal_code: payload.postalCode,
        status: "paid",
        total_inr: totalInr,
        payment_provider: "upi",
        payment_reference: txnId,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return Response.json(
        { ok: false, error: orderError?.message ?? "Could not create order." },
        { status: 500 }
      );
    }

    const orderItems = payload.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_slug: item.slug,
      size: item.size,
      quantity: item.quantity,
      unit_price_inr: item.price,
      line_total_inr: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      return Response.json(
        { ok: false, error: itemsError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("payment_intents")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("txn_id", txnId);

    // Create initial status history entry
    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "paid",
      note: "Payment confirmed via UPI",
    });

    return Response.json({
      ok: true,
      orderId: order.id,
      paymentStatus: "succeeded",
      provider: "upi",
    });
  } catch (error) {
    console.error("UPI confirm error:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Confirmation failed",
      },
      { status: 500 }
    );
  }
}
