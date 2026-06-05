"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { formatInr } from "@/lib/utils";

const emptyProduct = (): Product => ({
  id: `prod_${Date.now()}`,
  slug: "",
  name: "",
  color: "",
  price: 0,
  stock: 0,
  sizes: ["S", "M", "L"],
  status: "draft",
  images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"]
});

type OrderRow = {
  id: string;
  email: string;
  customer_name: string;
  status: string;
  total_inr: number;
  created_at: string;
  order_items?: { product_name: string; quantity: number }[];
};

export function AdminDashboardClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders")
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products ?? []);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders ?? []);
      }

      setLoading(false);
    }

    load();
  }, []);

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    const payload: Product = {
      ...draft,
      sizes: draft.sizes,
      price: Number(draft.price),
      stock: Number(draft.stock)
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not save product.");
      return;
    }

    setMessage("Product saved.");
    const list = await fetch("/api/admin/products");
    if (list.ok) {
      const refreshed = await list.json();
      setProducts(refreshed.products ?? []);
    }
  }

  if (loading) {
    return <p className="text-sm font-bold">Loading admin data…</p>;
  }

  return (
    <>
      {message ? (
        <p className="mb-4 border-2 border-ink bg-bone p-3 text-sm font-bold">{message}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={saveProduct}
          className="border-2 border-ink bg-white p-5 shadow-brutal"
        >
          <h2 className="text-2xl font-black uppercase tracking-normal">
            Product editor
          </h2>
          <div className="mt-5 grid gap-4">
            <AdminField label="Product ID" value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} />
            <AdminField label="Product name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <AdminField label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <AdminField label="Color" value={draft.color} onChange={(v) => setDraft({ ...draft, color: v })} />
            <AdminField label="Price (INR)" value={String(draft.price)} onChange={(v) => setDraft({ ...draft, price: Number(v) || 0 })} />
            <AdminField label="Stock" value={String(draft.stock)} onChange={(v) => setDraft({ ...draft, stock: Number(v) || 0 })} />
            <AdminField label="Sizes (comma-separated)" value={draft.sizes.join(", ")} onChange={(v) => setDraft({ ...draft, sizes: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <AdminField label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as Product["status"] })} />
            <AdminField label="Front image URL" value={draft.images[0]} onChange={(v) => setDraft({ ...draft, images: [v, draft.images[1]] })} />
            <AdminField label="Hover image URL" value={draft.images[1]} onChange={(v) => setDraft({ ...draft, images: [draft.images[0], v] })} />
          </div>
          <div className="mt-5 flex gap-2">
            <button type="submit" className="h-11 flex-1 border-2 border-ink bg-ink text-sm font-black uppercase text-white">
              Save product
            </button>
            <button
              type="button"
              onClick={() => setDraft(emptyProduct())}
              className="h-11 border-2 border-ink px-4 text-sm font-black uppercase"
            >
              New
            </button>
          </div>
        </form>

        <div className="overflow-hidden border-2 border-ink bg-white shadow-brutal">
          <div className="border-b-2 border-ink p-5">
            <h2 className="text-2xl font-black uppercase tracking-normal">
              Inventory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-bone text-xs font-black uppercase">
                <tr>
                  <th className="border-b-2 border-ink p-4">Product</th>
                  <th className="border-b-2 border-ink p-4">Price</th>
                  <th className="border-b-2 border-ink p-4">Stock</th>
                  <th className="border-b-2 border-ink p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="cursor-pointer font-bold hover:bg-bone/60"
                    onClick={() => setDraft(product)}
                  >
                    <td className="border-b border-ink/15 p-4">{product.name}</td>
                    <td className="border-b border-ink/15 p-4">{formatInr(product.price)}</td>
                    <td className="border-b border-ink/15 p-4">{product.stock}</td>
                    <td className="border-b border-ink/15 p-4 uppercase">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden border-2 border-ink bg-white shadow-brutal">
        <div className="border-b-2 border-ink p-5">
          <h2 className="text-2xl font-black uppercase tracking-normal">Recent orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="p-5 text-sm font-semibold text-ink/65">
            No orders yet. Complete a mock checkout to create one (requires Supabase tables).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-bone text-xs font-black uppercase">
                <tr>
                  <th className="border-b-2 border-ink p-4">Order</th>
                  <th className="border-b-2 border-ink p-4">Customer</th>
                  <th className="border-b-2 border-ink p-4">Total</th>
                  <th className="border-b-2 border-ink p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="font-bold">
                    <td className="border-b border-ink/15 p-4 font-mono text-xs">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="border-b border-ink/15 p-4">
                      {order.customer_name}
                      <span className="block text-xs font-semibold text-ink/55">
                        {order.email}
                      </span>
                    </td>
                    <td className="border-b border-ink/15 p-4">
                      {formatInr(order.total_inr)}
                    </td>
                    <td className="border-b border-ink/15 p-4 uppercase">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AdminField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 border-2 border-ink bg-bone px-3 text-sm font-bold normal-case outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
      />
    </label>
  );
}
