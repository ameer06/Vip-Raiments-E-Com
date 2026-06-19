import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay-verify";
import type { RazorpayPaymentVerifyRequest } from "@/lib/payments/razorpay-types";

interface VerifyPaymentRequest extends RazorpayPaymentVerifyRequest {
  cartItems: Array<{
    productId: string;
    slug: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
  }>;
  email: string;
  customerName: string;
  phone?: string;
  addressLine: string;
  city: string;
  postalCode: string;
}

export async function POST(request: Request) {
  try {
    const body: VerifyPaymentRequest = await request.json();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return Response.json(
        { ok: false, error: "Payment processing not configured" },
        { status: 500 }
      );
    }

    // Verify signature
    const isValidSignature = verifyRazorpaySignature(
      {
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature
      },
      keySecret
    );

    if (!isValidSignature) {
      return Response.json(
        { ok: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Calculate total
    const totalInr = body.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email: body.email,
        customer_name: body.customerName,
        phone: body.phone || null,
        address_line: body.addressLine,
        city: body.city,
        postal_code: body.postalCode,
        status: "paid",
        total_inr: Math.round(totalInr),
        payment_provider: "razorpay",
        payment_reference: body.razorpay_payment_id
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return Response.json(
        { ok: false, error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = body.cartItems.map((item) => ({
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
      console.error("Order items error:", itemsError);
      return Response.json(
        { ok: false, error: "Failed to create order items" },
        { status: 500 }
      );
    }

    // Update product stock (silently skip if products table doesn't exist)
    for (const item of body.cartItems) {
      try {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.productId)
          .single();

        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.productId);
        }
      } catch {
        // products table doesn't exist — skip stock update
      }
    }

    return Response.json({
      ok: true,
      orderId: order.id,
      paymentStatus: "succeeded",
      provider: "razorpay"
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Payment verification failed"
      },
      { status: 500 }
    );
  }
}
