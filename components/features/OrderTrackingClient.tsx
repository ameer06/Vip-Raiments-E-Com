"use client";

import { useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/orders/types";
import type { OrderStatus } from "@/lib/orders/types";

type OrderItem = {
  product_name: string;
  size: string;
  quantity: number;
  line_total_inr: number;
};

type StatusEntry = {
  status: string;
  note: string | null;
  created_at: string;
};

type TrackedOrder = {
  id: string;
  email: string;
  customer_name: string;
  status: OrderStatus;
  total_inr: number;
  payment_provider: string;
  created_at: string;
  updated_at: string;
  tracking_number: string | null;
  shipping_carrier: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  address_line: string;
  city: string;
  postal_code: string;
  order_items: OrderItem[];
  status_history: StatusEntry[];
};

const STEP_STATUSES: OrderStatus[] = ["pending_payment", "paid", "processing", "shipped", "delivered"];

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelled" || status === "refunded") return -1;
  return STEP_STATUSES.indexOf(status);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTrackingClient() {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrders([]);
    setSelectedOrder(null);

    if (!query && !email) {
      setError("Enter an order ID or email address");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (query) params.set("orderId", query);
      if (email) params.set("email", email);

      const res = await fetch(`/api/track?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to find orders");
        return;
      }

      if (data.orders.length === 0) {
        setError("No orders found. Please check your order ID or email.");
        return;
      }

      setOrders(data.orders);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (selectedOrder) {
    const stepIdx = getStepIndex(selectedOrder.status);

    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <button onClick={() => setSelectedOrder(null)} className="mb-6 text-sm font-medium text-ink/50 underline">
          ← Back to all orders
        </button>
        <p className="label-mono mb-1 text-ink/50">Order details</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Order {selectedOrder.id.slice(0, 8).toUpperCase()}</h1>
        <p className="text-sm text-ink/50">Placed on {formatDate(selectedOrder.created_at)}</p>

        <div className="mt-6 rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[selectedOrder.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
              {ORDER_STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
            </span>
            {selectedOrder.tracking_number && (
              <span className="text-xs text-ink/50">
                Tracking: {selectedOrder.tracking_number}
                {selectedOrder.shipping_carrier ? ` (${selectedOrder.shipping_carrier})` : ""}
              </span>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              {STEP_STATUSES.map((stepStatus, i) => (
                <div key={stepStatus} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i <= stepIdx ? "bg-ink text-white" : "bg-ink/10 text-ink/40"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="mt-2 text-center text-[10px] font-medium leading-tight text-ink/60 max-w-[64px]">
                      {ORDER_STATUS_LABELS[stepStatus]}
                    </span>
                  </div>
                  {i < STEP_STATUSES.length - 1 && (
                    <div className={`mx-1 h-0.5 flex-1 ${i < stepIdx ? "bg-ink" : "bg-ink/10"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <h2 className="text-lg font-semibold">Items</h2>
          <ul className="mt-3 divide-y divide-ink/10">
            {selectedOrder.order_items.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="font-medium">{item.product_name} <span className="text-ink/50">({item.size})</span> × {item.quantity}</span>
                <span className="font-semibold">{formatInr(item.line_total_inr)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">{formatInr(selectedOrder.total_inr)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <p className="mt-2 text-sm text-ink/60">
            {selectedOrder.address_line}<br />
            {selectedOrder.city}, {selectedOrder.postal_code}
          </p>
        </div>

        {selectedOrder.status_history.length > 0 && (
          <div className="mt-4 rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
            <h2 className="text-lg font-semibold">Order History</h2>
            <ul className="mt-3 space-y-3">
              {selectedOrder.status_history.map((entry, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 text-ink/40">{formatDate(entry.created_at)}</span>
                  <div>
                    <span className="font-semibold">{ORDER_STATUS_LABELS[entry.status as OrderStatus] || entry.status}</span>
                    {entry.note && <span className="text-ink/50"> — {entry.note}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="label-mono mb-1 text-ink/50">Order tracking</p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Track your order</h1>

      <form onSubmit={handleSearch} className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="label-mono">Order ID</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. abc12345..."
              className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="label-mono">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-11 w-full rounded-control bg-ink px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {orders.length > 0 && (
        <div className="mt-6 grid gap-3">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="rounded-card border border-ink/10 bg-white p-4 text-left shadow-card transition-colors hover:bg-surface"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="mt-1 text-xs text-ink/50">{formatDate(order.created_at)}</p>
                </div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-ink/60">{order.order_items?.length} item(s)</p>
                <p className="text-sm font-semibold">{formatInr(order.total_inr)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-sm text-ink/50">
        Need help? <Link href="/#contact" className="font-medium text-ink underline">Contact us</Link>
      </p>
    </div>
  );
}
