"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download, ChevronDown, Package, X, Loader2 } from "lucide-react";
import { formatInr } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, VALID_STATUS_TRANSITIONS } from "@/lib/orders/types";
import type { OrderStatus, OrderRow, OrderItemRow, OrderStatusHistory } from "@/lib/orders/types";

type OrderDetail = {
  order: OrderRow & { order_items: OrderItemRow[] };
  history: OrderStatusHistory[];
};

type OrdersResponse = {
  orders: OrderRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export function AdminOrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/admin/orders/list?${params}`);
      if (res.ok) {
        const data: OrdersResponse = await res.json();
        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function fetchOrderDetail(orderId: string) {
    const res = await fetch(`/api/admin/orders/detail?orderId=${orderId}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedOrder(data);
    }
  }

  async function updateStatus(orderId: string, newStatus: OrderStatus, note?: string, trackingNumber?: string, shippingCarrier?: string) {
    setUpdating(true);
    setUpdateMessage("");
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus, note, trackingNumber, shippingCarrier }),
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMessage("Status updated successfully");
        fetchOrderDetail(orderId);
        fetchOrders();
      } else {
        setUpdateMessage(data.error || "Failed to update");
      }
    } catch {
      setUpdateMessage("Network error");
    } finally {
      setUpdating(false);
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    window.open(`/api/admin/orders/export?${params}`, "_blank");
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-sm text-ink/50">{total} total orders</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-control border border-ink/20 px-4 py-2.5 text-sm font-semibold hover:bg-surface">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-11 w-full rounded-control border border-ink/20 bg-white pl-10 pr-3 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-11 appearance-none rounded-control border border-ink/20 bg-white pl-4 pr-10 text-sm text-ink outline-none focus:border-ink"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          detail={selectedOrder}
          updating={updating}
          updateMessage={updateMessage}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateStatus}
        />
      )}

      <div className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-ink/30" />
          </div>
        ) : orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="border-b border-ink/10 p-4">Order</th>
                  <th className="border-b border-ink/10 p-4">Customer</th>
                  <th className="border-b border-ink/10 p-4">Items</th>
                  <th className="border-b border-ink/10 p-4">Total</th>
                  <th className="border-b border-ink/10 p-4">Status</th>
                  <th className="border-b border-ink/10 p-4">Date</th>
                  <th className="border-b border-ink/10 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="border-b border-ink/10 p-4 font-mono text-xs font-bold">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="border-b border-ink/10 p-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-ink/50">{order.email}</p>
                    </td>
                    <td className="border-b border-ink/10 p-4 text-xs text-ink/60">
                      {(order.order_items ?? []).length} item(s)
                    </td>
                    <td className="border-b border-ink/10 p-4 font-semibold">
                      {formatInr(order.total_inr)}
                    </td>
                    <td className="border-b border-ink/10 p-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                        {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                      </span>
                    </td>
                    <td className="border-b border-ink/10 p-4 text-xs text-ink/50">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="border-b border-ink/10 p-4">
                      <button
                        onClick={() => fetchOrderDetail(order.id)}
                        className="text-xs font-semibold text-ink underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink/10 p-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-control border border-ink/20 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-ink/50">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-control border border-ink/20 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderDetailModal({
  detail,
  updating,
  updateMessage,
  onClose,
  onUpdate,
}: {
  detail: OrderDetail;
  updating: boolean;
  updateMessage: string;
  onClose: () => void;
  onUpdate: (orderId: string, status: OrderStatus, note?: string, trackingNumber?: string, carrier?: string) => void;
}) {
  const { order, history } = detail;
  const currentStatus = order.status as OrderStatus;
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");

  function handleSubmit() {
    if (!newStatus) return;
    onUpdate(order.id, newStatus, note || undefined, trackingNumber || undefined, shippingCarrier || undefined);
    setNewStatus("");
    setNote("");
    setTrackingNumber("");
    setShippingCarrier("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">Order {order.id.slice(0, 8).toUpperCase()}</h3>
            <p className="text-sm text-ink/50">Placed {new Date(order.created_at).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={onClose} className="rounded-control p-1 hover:bg-surface">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-control border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase text-ink/50">Customer</p>
            <p className="mt-1 font-medium">{order.customer_name}</p>
            <p className="text-sm text-ink/60">{order.email}</p>
            {order.phone && <p className="text-sm text-ink/60">{order.phone}</p>}
          </div>
          <div className="rounded-control border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase text-ink/50">Shipping</p>
            <p className="mt-1 text-sm text-ink/60">
              {order.address_line}<br />
              {order.city}, {order.postal_code}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-control border border-ink/10 p-4">
          <p className="text-xs font-semibold uppercase text-ink/50">Items</p>
          <ul className="mt-2 divide-y divide-ink/10">
            {(order.order_items ?? []).map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                <span>{item.product_name} ({item.size}) × {item.quantity}</span>
                <span className="font-semibold">{formatInr(item.line_total_inr)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatInr(order.total_inr)}</span>
          </div>
        </div>

        {order.tracking_number && (
          <div className="mt-4 rounded-control border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase text-ink/50">Tracking</p>
            <p className="mt-1 font-mono text-sm">{order.tracking_number}</p>
            {order.shipping_carrier && <p className="text-sm text-ink/60">{order.shipping_carrier}</p>}
          </div>
        )}

        {allowed.length > 0 && (
          <div className="mt-4 rounded-control border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase text-ink/50">Update Status</p>
            <div className="mt-2 grid gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm outline-none focus:border-ink"
              >
                <option value="">Select new status</option>
                {allowed.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              {newStatus === "shipped" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm outline-none focus:border-ink"
                  />
                  <input
                    type="text"
                    placeholder="Carrier (e.g. Delhivery, BlueDart)"
                    value={shippingCarrier}
                    onChange={(e) => setShippingCarrier(e.target.value)}
                    className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm outline-none focus:border-ink"
                  />
                </div>
              )}
              <textarea
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="rounded-control border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
              />
              {updateMessage && (
                <p className={`text-sm ${updateMessage.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                  {updateMessage}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={updating || !newStatus}
                className="h-11 rounded-control bg-ink px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-4 rounded-control border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase text-ink/50">History</p>
            <ul className="mt-2 space-y-2">
              {history.map((h) => (
                <li key={h.id} className="flex gap-3 text-sm">
                  <span className="shrink-0 text-ink/40">{new Date(h.created_at).toLocaleString("en-IN")}</span>
                  <span className="font-semibold">{ORDER_STATUS_LABELS[h.status as OrderStatus] || h.status}</span>
                  {h.note && <span className="text-ink/50">— {h.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
