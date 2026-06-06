import { getRazorpayClient } from "@/lib/payments/razorpay-client";
import type { RazorpayOrderRequest } from "@/lib/payments/razorpay-types";

interface CreateOrderRequest {
  cartItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  email: string;
  customerName: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();

    if (
      !body.email ||
      !body.customerName ||
      !body.cartItems ||
      body.cartItems.length === 0
    ) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = body.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      return Response.json(
        { ok: false, error: "Invalid cart total" },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(totalAmount * 100);

    const orderRequest: RazorpayOrderRequest = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        customer_name: body.customerName,
        customer_email: body.email
      }
    };

    const razorpayOrder = await razorpay.orders.create(orderRequest);

    return Response.json({
      ok: true,
      razorpay_order_id: razorpayOrder.id,
      amount: totalAmount,
      customer_name: body.customerName,
      email: body.email
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create order"
      },
      { status: 500 }
    );
  }
}
