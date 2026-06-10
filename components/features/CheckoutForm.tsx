"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatInr } from "@/lib/utils";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const hasRazorpay =
  RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.startsWith("your-");

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
      <div className="border-2 border-ink bg-white p-6 text-center shadow-brutal sm:p-8">
        <p className="font-black uppercase">Nothing to checkout</p>
        <Link
          href="/cart"
          className="mt-4 inline-flex h-11 items-center justify-center border-2 border-ink bg-ink px-5 text-sm font-black uppercase text-white sm:mt-5"
        >
          Return to cart
        </Link>
      </div>
    );
  }

  const payWithRazorpay = useCallback(async () => {
    if (!hasRazorpay) return false;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway. Try the mock option.");
      return false;
    }

    const orderRes = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        email: form.email,
        customerName: form.customerName
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.ok) {
      setError(orderData.error ?? "Failed to create payment order.");
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const razorpay = new window.Razorpay({
        key: RAZORPAY_KEY_ID!,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "VIP Raiments",
        description: `Order for ${orderData.customer_name}`,
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: orderData.customer_name,
          email: orderData.email
        },
        theme: { color: "#175cff" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: items.map((item) => ({
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                size: item.size,
                quantity: item.quantity
              })),
              email: form.email,
              customerName: form.customerName,
              phone: form.phone || undefined,
              addressLine: form.addressLine,
              city: form.city,
              postalCode: form.postalCode
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.ok) {
            setError(verifyData.error ?? "Payment verification failed.");
            resolve(false);
            return;
          }

          clearCart();
          router.push(`/order/${verifyData.orderId}`);
          resolve(true);
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            resolve(false);
          }
        }
      });

      razorpay.open();
    });
  }, [items, form, clearCart, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (hasRazorpay) {
      const paid = await payWithRazorpay();
      if (paid) return;
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
      <div className="grid gap-4 border-2 border-ink bg-white p-4 shadow-brutal sm:p-5">
        <h2 className="text-xl font-black uppercase sm:text-2xl">Shipping</h2>
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

      <aside className="h-fit border-2 border-ink bg-white p-4 shadow-brutal-blue sm:p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-black uppercase sm:text-2xl">
          {hasRazorpay ? "Payment" : "Payment (mock)"}
        </h2>
        {hasRazorpay ? (
          <p className="mt-3 text-sm font-semibold text-ink/65">
            Pay securely via Razorpay. Your card or UPI details are processed
            by Razorpay, not stored here.
          </p>
        ) : (
          <p className="mt-3 text-sm font-semibold text-ink/65">
            No real charge. Click pay to simulate a successful payment and create
            an order in Supabase. Set <code className="bg-bone px-1">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to enable live payments.
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
          <p className="text-sm font-bold">Total</p>
          <p className="text-xl font-black sm:text-2xl">{formatInr(subtotal)}</p>
        </div>
        <ul className="mt-4 grid gap-2 text-xs font-semibold text-ink/60">
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
          <p className="mt-4 border-2 border-ink bg-bone p-3 text-sm font-bold text-ink/75">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 inline-flex h-12 w-full items-center justify-center border-2 border-ink bg-ink text-sm font-black uppercase text-white disabled:opacity-60 sm:mt-6"
        >
          {isSubmitting
            ? "Processing…"
            : hasRazorpay
              ? `Pay ₹${subtotal} via Razorpay`
              : "Pay with mock gateway"}
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
