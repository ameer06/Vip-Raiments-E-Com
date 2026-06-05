import type { CheckoutPayload, CheckoutResult } from "@/lib/orders/types";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

export async function createMockOrder(
  payload: CheckoutPayload
): Promise<CheckoutResult> {
  if (!payload.items.length) {
    return { ok: false, error: "Cart is empty." };
  }

  if (!hasSupabaseServiceRole()) {
    return {
      ok: false,
      error: "Orders require SUPABASE_SERVICE_ROLE_KEY on the server."
    };
  }

  const supabase = createSupabaseAdminClient();
  const totalInr = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  for (const item of payload.items) {
    const { data: product, error } = await supabase
      .from("products")
      .select("stock, name, status")
      .eq("id", item.productId)
      .maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!product) {
      continue;
    }

    if (product.status !== "active") {
      return { ok: false, error: `${item.name} is not available.` };
    }

    if (product.stock < item.quantity) {
      return {
        ok: false,
        error: `Not enough stock for ${item.name}. Available: ${product.stock}.`
      };
    }
  }

  const paymentReference = `mock_${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email: payload.email,
      customer_name: payload.customerName,
      phone: payload.phone ?? null,
      address_line: payload.addressLine,
      city: payload.city,
      postal_code: payload.postalCode,
      status: "paid",
      total_inr: totalInr,
      payment_provider: "mock",
      payment_reference: paymentReference
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message ?? "Could not create order." };
  }

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    product_slug: item.slug,
    size: item.size,
    quantity: item.quantity,
    unit_price_inr: item.price,
    line_total_inr: item.price * item.quantity
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { ok: false, error: itemsError.message };
  }

  for (const item of payload.items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.productId)
      .maybeSingle();

    if (!product) {
      continue;
    }

    await supabase
      .from("products")
      .update({
        stock: Math.max(0, product.stock - item.quantity),
        updated_at: new Date().toISOString()
      })
      .eq("id", item.productId);
  }

  return { ok: true, orderId: order.id };
}
