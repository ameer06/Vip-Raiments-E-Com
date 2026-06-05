import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/orders/types";
import { createMockOrder } from "@/lib/orders/create-order";

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutPayload;

  if (
    !body.email ||
    !body.customerName ||
    !body.addressLine ||
    !body.city ||
    !body.postalCode ||
    !Array.isArray(body.items)
  ) {
    return NextResponse.json(
      { error: "Missing required checkout fields." },
      { status: 400 }
    );
  }

  const result = await createMockOrder(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    orderId: result.orderId,
    paymentStatus: "succeeded",
    provider: "mock"
  });
}
