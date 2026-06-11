import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CartLineItem } from "@/lib/cart/types";

interface CreateUPIRequest {
  amount: number;
  orderRef: string;
  customerName: string;
  email: string;
  phone?: string;
  addressLine: string;
  city: string;
  postalCode: string;
  items: CartLineItem[];
}

export async function POST(request: Request) {
  try {
    const body: CreateUPIRequest = await request.json();

    if (!body.amount || !body.orderRef || !body.customerName || !body.email) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return Response.json(
        { ok: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    const upiId = process.env.MERCHANT_UPI_ID;
    if (!upiId) {
      return Response.json(
        { ok: false, error: "UPI payments not configured" },
        { status: 500 }
      );
    }

    const txnId = `TXN${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const merchantName = "VIP Raiments";
    const amountStr = body.amount.toFixed(2);

    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amountStr}&tr=${txnId}&tn=${encodeURIComponent(`Payment for ${body.orderRef}`)}&cu=INR`;

    const supabase = await createSupabaseServerClient();

    const checkoutPayload = {
      email: body.email,
      customerName: body.customerName,
      phone: body.phone || null,
      addressLine: body.addressLine,
      city: body.city,
      postalCode: body.postalCode,
      items: body.items,
    };

    const { error: insertError } = await supabase.from("payment_intents").insert({
      txn_id: txnId,
      order_ref: body.orderRef,
      amount: Math.round(body.amount),
      status: "pending",
      customer_email: body.email,
      customer_name: body.customerName,
      customer_phone: body.phone || null,
      upi_link: upiLink,
      checkout_payload: checkoutPayload,
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
      amount: body.amount,
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
