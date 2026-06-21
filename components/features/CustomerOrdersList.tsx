"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatInr } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: { name: string; quantity: number }[];
};

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800"
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded"
};

export function CustomerOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("id, status, total, created_at, order_items(name, quantity)")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      setOrders(
        (data ?? []).map((o) => ({
          id: o.id,
          status: o.status,
          total: o.total,
          created_at: o.created_at,
          items: (o.order_items as unknown as { name: string; quantity: number }[]) ?? []
        }))
      );
      setIsLoading(false);
    }

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-control border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <Package className="mx-auto h-12 w-12 text-ink/20" />
        <p className="mt-4 text-lg font-semibold text-ink/60">No orders yet</p>
        <p className="mt-1 text-sm text-ink/40">
          Your orders will appear here after your first purchase.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-control bg-ink px-6 text-sm font-semibold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/order/${order.id}`}
          className="group flex items-center justify-between gap-4 rounded-card border border-ink/10 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover sm:p-5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  statusColors[order.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-ink/50">
              {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ") ||
                "Order items"}
            </p>
            <p className="mt-0.5 text-xs text-ink/40">
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-semibold">{formatInr(order.total)}</span>
            <ChevronRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
