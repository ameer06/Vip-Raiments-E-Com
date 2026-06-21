import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCheckoutPayload } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateCheckoutPayload(body);

    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: 400 });
    }

    const { sanitized } = result;

    const upiId = process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || process.env.MERCHANT_UPI_ID;
    if (!upiId) {
      return Response.json(
        { ok: false, error: "UPI payments not configured" },
        { status: 500 }
      );
    }

    const txnId = `TXN${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const merchantName = "VIP Raiments";
    const amountStr = sanitized.amount.toFixed(2);

    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amountStr}&tr=${txnId}&tn=${encodeURIComponent(`Payment for ${sanitized.orderRef}`)}&cu=INR`;

    const supabase = await createSupabaseServerClient();

    const { error: insertError } = await supabase.from("payment_intents").insert({
      txn_id: txnId,
      order_ref: sanitized.orderRef,
      amount: sanitized.amount,
      status: "pending",
      customer_email: sanitized.email,
      customer_name: sanitized.customerName,
      customer_phone: sanitized.phone || null,
      upi_link: upiLink,
      checkout_payload: {
        email: sanitized.email,
        customerName: sanitized.customerName,
        phone: sanitized.phone || null,
        addressLine: sanitized.addressLine,
        city: sanitized.city,
        postalCode: sanitized.postalCode,
        items: sanitized.items,
      },
    });

    if (insertError) {
      console.error("Failed to save payment intent:", insertError);
      return Response.json(
        { ok: false, error: "Failed to create payment" },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      txnId,
      upiLink,
      merchantName,
      amount: sanitized.amount,
    });
  } catch (error) {
    console.error("UPI payment creation error:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create payment",
      },
      { status: 500 }
    );
  }
}
