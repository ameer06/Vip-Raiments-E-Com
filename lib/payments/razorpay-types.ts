export interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: number;
  notes: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null | string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentResult {
  ok: boolean;
  orderId?: string;
  paymentStatus?: "succeeded" | "failed";
  provider?: "razorpay";
  error?: string;
}
