export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

export type OrderRow = {
  id: string;
  email: string;
  customer_name: string;
  phone: string | null;
  address_line: string;
  city: string;
  postal_code: string;
  status: OrderStatus;
  total_inr: number;
  payment_provider: string;
  payment_reference: string | null;
  notes: string | null;
  tracking_number: string | null;
  shipping_carrier: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItemRow[];
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  size: string;
  quantity: number;
  unit_price_inr: number;
  line_total_inr: number;
};

export type OrderStatusHistory = {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
};

export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["paid", "cancelled"],
  paid: ["processing", "cancelled", "refunded"],
  processing: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "cancelled"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};
