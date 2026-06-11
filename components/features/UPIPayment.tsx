"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

type UPIPaymentProps = {
  form: {
    email: string;
    customerName: string;
    phone: string;
    addressLine: string;
    city: string;
    postalCode: string;
  };
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  setError: (v: string) => void;
};

export function UPIPayment({
  form,
  isSubmitting,
  setIsSubmitting,
  setError,
}: UPIPaymentProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"idle" | "linking" | "paid" | "confirming">("idle");
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const confirmAndRedirect = useCallback(
    async (txn: string) => {
      setStep("confirming");
      const res = await fetch("/api/upi/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnId: txn }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Confirmation failed. Contact support.");
        setStep("paid");
        return;
      }

      clearCart();
      router.push(`/order/${data.orderId}`);
    },
    [clearCart, router, setError]
  );

  const startPolling = useCallback(
    (txn: string) => {
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch("/api/upi/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txnId: txn }),
          });
          const data = await res.json();

          if (data.ok && data.status === "paid") {
            stopPolling();
            setStep("paid");
            confirmAndRedirect(txn);
            return;
          }

          if (attempts >= 30) {
            stopPolling();
            setStep("paid");
            setError("Payment not detected automatically. Click 'I've paid' if you completed the payment.");
          }
        } catch {
          if (attempts >= 30) {
            stopPolling();
            setStep("paid");
          }
        }
      }, 2000);
    },
    [stopPolling, confirmAndRedirect, setError]
  );

  async function initiatePayment() {
    setIsSubmitting(true);
    setError("");
    setStep("linking");

    try {
      const res = await fetch("/api/upi/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subtotal,
          orderRef: `ORDER_${Date.now()}`,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone || undefined,
          addressLine: form.addressLine,
          city: form.city,
          postalCode: form.postalCode,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to initiate payment");
        setStep("idle");
        setIsSubmitting(false);
        return;
      }

      setUpiLink(data.upiLink);
      setTxnId(data.txnId);

      window.location.href = data.upiLink;
      startPolling(data.txnId);
    } catch {
      setError("Failed to connect. Please try again.");
      setStep("idle");
      setIsSubmitting(false);
    }
  }

  function handleManualConfirm() {
    if (txnId) confirmAndRedirect(txnId);
  }

  function handleRetry() {
    stopPolling();
    setStep("idle");
    setUpiLink(null);
    setTxnId(null);
    setIsSubmitting(false);
  }

  if (step === "linking" || step === "confirming") {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink border-t-transparent" />
        </div>
        <p className="text-center text-sm font-bold">
          {step === "linking"
            ? "Opening your UPI app…"
            : "Confirming payment…"}
        </p>
        {upiLink && (
          <a
            href={upiLink}
            className="text-center text-xs font-semibold text-electric-blue underline"
          >
            Tap to open UPI app again
          </a>
        )}
      </div>
    );
  }

  if (step === "paid") {
    return (
      <div className="grid gap-4">
        <p className="text-center text-sm font-bold">
          Payment sent? Complete your order below.
        </p>
        <button
          type="button"
          onClick={handleManualConfirm}
          disabled={isSubmitting}
          className="h-12 w-full border-2 border-ink bg-emerald-600 text-sm font-black uppercase text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          I&apos;ve completed the payment
        </button>
        {upiLink && (
          <a
            href={upiLink}
            className="text-center text-xs font-semibold text-electric-blue underline"
          >
            Open UPI app again
          </a>
        )}
        <button
          type="button"
          onClick={handleRetry}
          className="text-center text-xs font-bold text-ink/50 underline"
        >
          Cancel and retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={initiatePayment}
        disabled={isSubmitting}
        className="h-12 w-full border-2 border-ink bg-ink text-sm font-black uppercase text-white hover:bg-ink/90 disabled:opacity-60"
      >
        {isSubmitting ? "Preparing…" : `Pay ₹${subtotal} with UPI`}
      </button>
      <p className="text-center text-[10px] font-semibold text-ink/50 sm:text-xs">
        Pay via Google Pay, PhonePe, Paytm, or any UPI app
      </p>
    </div>
  );
}
