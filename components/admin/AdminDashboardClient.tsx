"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { LogOut, Upload, Loader2 } from "lucide-react";
import type { Product } from "@/data/products";
import { formatInr } from "@/lib/utils";

const STORAGE_KEY = "vip_admin_overrides";

function loadOverrides(): Record<string, Partial<Product>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, Partial<Product>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function applyOverrides(products: Product[], overrides: Record<string, Partial<Product>>): Product[] {
  return products.map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function load() {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders")
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        const apiProducts = data.products ?? [];
        const overrides = loadOverrides();
        setProducts(applyOverrides(apiProducts, overrides));
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders ?? []);
      }

      setLoading(false);
    }

    load();
  }, []);

  const persistOverrides = useCallback((updatedProducts: Product[]) => {
    const overrides: Record<string, Partial<Product>> = {};
    for (const p of updatedProducts) {
      const original = products.find((o) => o.id === p.id);
      if (original && JSON.stringify(p) !== JSON.stringify(original)) {
        overrides[p.id] = p;
      }
    }
    const existing = loadOverrides();
    saveOverrides({ ...existing, ...overrides });
  }, [products]);

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
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

    if (response.ok) {
      setMessage("Saved to Supabase.");
    } else {
      setMessage("Saved locally (no backend). Price updated on storefront.");
      fetch("/api/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payload.id, data: { price: payload.price, stock: payload.stock, images: payload.images } })
      }).catch(() => {});
    }

    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === payload.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = payload;
        persistOverrides(next);
        return next;
      }
      persistOverrides([...prev, payload]);
      return [...prev, payload];
    });
    setIsSaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading) {
    return <p className="text-sm font-bold">Loading admin data…</p>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        {message ? (
          <p className="rounded-control border border-ink/10 bg-surface p-3 text-sm text-ink/60">{message}</p>
        ) : null}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="ml-auto flex items-center gap-2 h-11 rounded-control bg-ink px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={saveProduct}
          className="rounded-card border border-ink/10 bg-white p-card-pad shadow-card"
        >
          <h2 className="text-xl font-semibold">
            Product editor
          </h2>
          <div className="mt-5 grid gap-4">
            <AdminField label="Product ID" value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} />
            <AdminField label="Product name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <AdminField label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <AdminField label="Color" value={draft.color} onChange={(v) => setDraft({ ...draft, color: v })} />
            <AdminField label="Price (INR)" type="number" value={String(draft.price)} onChange={(v) => setDraft((prev) => ({ ...prev, price: Number(v) || 0 }))} />
            <AdminField label="Stock" type="number" value={String(draft.stock)} onChange={(v) => setDraft((prev) => ({ ...prev, stock: Number(v) || 0 }))} />
            <AdminField label="Sizes (comma-separated)" value={draft.sizes.join(", ")} onChange={(v) => setDraft({ ...draft, sizes: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <AdminField label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as Product["status"] })} />
            <AdminImageField label="Front image" value={draft.images[0]} onChange={(v) => setDraft({ ...draft, images: [v, draft.images[1]] })} />
            <AdminImageField label="Hover image" value={draft.images[1]} onChange={(v) => setDraft({ ...draft, images: [draft.images[0], v] })} />
          </div>
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={isSaving} className="h-11 flex-1 rounded-control bg-ink text-sm font-semibold text-white disabled:opacity-50">
              {isSaving ? "Saving..." : "Save product"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(emptyProduct())}
              className="h-11 rounded-control border border-ink/20 px-4 text-sm font-semibold"
            >
              New
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-card border border-ink/10 bg-white shadow-card">
          <div className="border-b border-ink/10 p-card-pad">
            <h2 className="text-xl font-semibold">
              Inventory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="border-b border-ink/10 p-4">Product</th>
                  <th className="border-b border-ink/10 p-4">Price</th>
                  <th className="border-b border-ink/10 p-4">Stock</th>
                  <th className="border-b border-ink/10 p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`cursor-pointer transition-colors ${
                      draft.id === product.id
                        ? "bg-ink/5"
                        : "hover:bg-surface"
                    }`}
                    onClick={() => setDraft(product)}
                  >
                    <td className="border-b border-ink/10 p-4 text-sm font-medium">{product.name}</td>
                    <td className="border-b border-ink/10 p-4 text-sm">{formatInr(product.price)}</td>
                    <td className="border-b border-ink/10 p-4 text-sm">{product.stock}</td>
                    <td className="border-b border-ink/10 p-4 text-sm">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-section overflow-hidden rounded-card border border-ink/10 bg-white shadow-card">
        <div className="border-b border-ink/10 p-card-pad">
          <h2 className="text-xl font-semibold">Recent orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="p-card-pad text-sm text-ink/50">
            No orders yet. Complete a mock checkout to create one (requires Supabase tables).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="border-b border-ink/10 p-4">Order</th>
                  <th className="border-b border-ink/10 p-4">Customer</th>
                  <th className="border-b border-ink/10 p-4">Total</th>
                  <th className="border-b border-ink/10 p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="font-medium">
                    <td className="border-b border-ink/10 p-4 font-mono text-xs">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="border-b border-ink/10 p-4">
                      {order.customer_name}
                      <span className="block text-xs text-ink/50">
                        {order.email}
                      </span>
                    </td>
                    <td className="border-b border-ink/10 p-4">
                      {formatInr(order.total_inr)}
                    </td>
                    <td className="border-b border-ink/10 p-4">
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
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label-mono">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function AdminImageField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/admin/upload-local", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-1.5">
      <span className="label-mono">{label}</span>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/webp,image/jpeg,image/png"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-control bg-ink px-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload image"}
        </button>
        {value && (
          <img src={value} alt="" className="h-11 w-11 shrink-0 rounded-control border border-ink/10 object-cover" />
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
