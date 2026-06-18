"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatInr } from "@/lib/utils";
import { UPIPayment } from "@/components/features/UPIPayment";

const MERCHANT_UPI_ID = process.env.NEXT_PUBLIC_MERCHANT_UPI_ID;
const hasUPI = MERCHANT_UPI_ID && !MERCHANT_UPI_ID.startsWith("your-");

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    email: "",
    customerName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: ""
  });

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) errs.customerName = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email address";
    if (form.phone.trim() && !/^\+?\d{10,15}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number (10-15 digits)";
    if (!form.addressLine.trim()) errs.addressLine = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.postalCode.trim()) errs.postalCode = "Postal code is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-ink/10 bg-white p-6 text-center shadow-card sm:p-8">
        <p className="text-lg font-semibold">Nothing to checkout</p>
        <Link
          href="/cart"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-control bg-ink px-5 text-sm font-semibold text-white sm:mt-5"
        >
          Return to cart
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setFormErrors({});

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    if (hasUPI) {
      setIsSubmitting(false);
      return;
    }

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
      <div className="grid gap-4 rounded-card border border-ink/10 bg-white p-card-pad shadow-card sm:p-card-pad">
        <h2 className="text-xl font-semibold sm:text-2xl">Shipping</h2>
        <CheckoutField
          label="Full name"
          value={form.customerName}
          onChange={(v) => setForm({ ...form, customerName: v })}
          error={formErrors.customerName}
          required
        />
        <CheckoutField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          error={formErrors.email}
          required
        />
        <CheckoutField
          label="Phone (optional)"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          error={formErrors.phone}
        />
        <CheckoutField
          label="Address"
          value={form.addressLine}
          onChange={(v) => setForm({ ...form, addressLine: v })}
          error={formErrors.addressLine}
          required
        />
        <CheckoutField
          label="City"
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
          error={formErrors.city}
          required
        />
        <CheckoutField
          label="Postal code"
          value={form.postalCode}
          onChange={(v) => setForm({ ...form, postalCode: v })}
          error={formErrors.postalCode}
          required
        />
      </div>

      <aside className="h-fit rounded-card border border-ink/10 bg-white p-card-pad shadow-card lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold sm:text-2xl">
          {hasUPI ? "Pay with UPI" : "Payment (mock)"}
        </h2>
        {hasUPI ? (
          <p className="mt-3 text-sm text-ink/50">
            Pay via Google Pay, PhonePe, Paytm, or any UPI app. No card details needed.
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink/50">
            No real charge. Click pay to simulate a successful payment and create
            an order in Supabase. Set{" "}
            <code className="bg-surface px-1">NEXT_PUBLIC_MERCHANT_UPI_ID</code> to enable UPI payments.
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
          <p className="text-sm font-medium">Total</p>
          <p className="text-xl font-semibold sm:text-2xl">{formatInr(subtotal)}</p>
        </div>
        <ul className="mt-4 grid gap-2 text-xs text-ink/50">
          {items.map((item) => (
            <li
              key={item.lineId}
              className="flex items-start justify-between gap-3"
            >
              <span className="min-w-0 truncate">
                {item.name} × {item.quantity} ({item.size})
              </span>
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-4 rounded-control border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
        {hasUPI ? (
          <div className="mt-5 sm:mt-6">
            <UPIPayment
              form={form}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setError={setError}
              validate={validateForm}
            />
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-control bg-ink text-sm font-semibold text-white disabled:opacity-60 sm:mt-6"
          >
            {isSubmitting ? "Processing…" : "Pay with mock gateway"}
          </button>
        )}
      </aside>
    </form>
  );
}

function CheckoutField({
  label,
  value,
  onChange,
  required,
  type = "text",
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  error?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label-mono">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 rounded-control border border-ink/20 bg-white px-3 text-sm font-normal text-ink outline-none transition-colors focus:border-ink"
      />
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
