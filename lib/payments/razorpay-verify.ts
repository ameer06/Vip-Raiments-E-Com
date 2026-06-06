import crypto from "crypto";
import type { RazorpayPaymentVerifyRequest } from "./razorpay-types";

export function verifyRazorpaySignature(
  params: RazorpayPaymentVerifyRequest,
  secret: string
): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
}
