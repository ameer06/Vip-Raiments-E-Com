"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatInr } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    customerName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: ""
  });

  if (items.length === 0) {
    return (
      <div className="border-2 border-ink bg-white p-8 text-center shadow-brutal">
        <p className="font-black uppercase">Nothing to checkout</p>
        <Link href="/cart" className="mt-4 inline-block text-sm font-bold underline">
          Return to cart
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/checkout/mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items
      })
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Checkout failed.");
      return;
    }

    clearCart();
    router.push(`/order/${data.orderId}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="grid gap-4 border-2 border-ink bg-white p-5 shadow-brutal">
        <h2 className="text-2xl font-black uppercase">Shipping</h2>
        <CheckoutField
          label="Full name"
          value={form.customerName}
          onChange={(v) => setForm({ ...form, customerName: v })}
          required
        />
        <CheckoutField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
        />
        <CheckoutField
          label="Phone (optional)"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <CheckoutField
          label="Address"
          value={form.addressLine}
          onChange={(v) => setForm({ ...form, addressLine: v })}
          required
        />
        <CheckoutField
          label="City"
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
          required
        />
        <CheckoutField
          label="Postal code"
          value={form.postalCode}
          onChange={(v) => setForm({ ...form, postalCode: v })}
          required
        />
      </div>

      <aside className="h-fit border-2 border-ink bg-white p-5 shadow-brutal-blue lg:sticky lg:top-24">
        <h2 className="text-2xl font-black uppercase">Payment (mock)</h2>
        <p className="mt-3 text-sm font-semibold text-ink/65">
          No real charge. Click pay to simulate a successful payment and create
          an order in Supabase.
        </p>
        <p className="mt-6 text-sm font-bold">Total</p>
        <p className="text-2xl font-black">{formatInr(subtotal)}</p>
        <ul className="mt-4 grid gap-2 text-xs font-semibold text-ink/60">
          {items.map((item) => (
            <li key={item.lineId}>
              {item.name} × {item.quantity} ({item.size})
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-4 border-2 border-ink bg-bone p-3 text-sm font-bold text-ink/75">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex h-12 w-full items-center justify-center border-2 border-ink bg-ink text-sm font-black uppercase text-white disabled:opacity-60"
        >
          {isSubmitting ? "Processing…" : "Pay with mock gateway"}
        </button>
      </aside>
    </form>
  );
}

function CheckoutField({
  label,
  value,
  onChange,
  required,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 border-2 border-ink bg-bone px-3 text-sm font-bold normal-case outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
      />
    </label>
  );
}
