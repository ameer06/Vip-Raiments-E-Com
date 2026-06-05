import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

export type OrderWithItems = {
  id: string;
  email: string;
  customer_name: string;
  status: string;
  total_inr: number;
  payment_provider: string;
  payment_reference: string | null;
  created_at: string;
  order_items: {
    product_name: string;
    size: string;
    quantity: number;
    line_total_inr: number;
  }[];
};

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  if (!hasSupabaseServiceRole()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OrderWithItems;
}
