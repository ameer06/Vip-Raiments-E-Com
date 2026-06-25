"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Smartphone, QrCode, CheckCircle, XCircle } from "lucide-react";

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
  validate: () => boolean;
};

const UPI_APPS = [
  { name: "GPay", scheme: "gpay", color: "#4285F4", icon: "G" },
  { name: "PhonePe", scheme: "phonepe", color: "#5F259F", icon: "Ph" },
  { name: "Paytm", scheme: "paytm", color: "#00BAF2", icon: "Py" },
  { name: "BHIM", scheme: "bhim", color: "#097969", icon: "B" },
  { name: "Amazon Pay", scheme: "amazonpay", color: "#FF9900", icon: "A" },
];

function getUpiAppsForDevice() {
  if (typeof navigator === "undefined") return UPI_APPS;
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const isIOS = ua.includes("iphone") || ua.includes("ipad");
  if (!isAndroid && !isIOS) return [];
  return UPI_APPS;
}

export function UPIPayment({
  form,
  isSubmitting,
  setIsSubmitting,
  setError,
  validate,
}: UPIPaymentProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"idle" | "processing" | "paid" | "confirming">("idle");
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [manualUpiId, setManualUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
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
      setPaymentStatus("Confirming your order...");
      const res = await fetch("/api/upi/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnId: txn }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Confirmation failed. Contact support.");
        setStep("paid");
        setPaymentStatus("");
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
            setPaymentStatus("Payment detected! Confirming order...");
            confirmAndRedirect(txn);
            return;
          }

          if (attempts >= 30) {
            stopPolling();
            setStep("paid");
            setPaymentStatus("");
          }
        } catch {
          if (attempts >= 30) {
            stopPolling();
            setStep("paid");
            setPaymentStatus("");
          }
        }
      }, 2000);
    },
    [stopPolling, confirmAndRedirect]
  );

  async function initiatePayment() {
    setIsSubmitting(true);
    setError("");
    setPaymentStatus("Creating secure payment...");

    if (!validate()) {
      setIsSubmitting(false);
      setStep("idle");
      setPaymentStatus("");
      return;
    }

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
        setPaymentStatus("");
        return;
      }

      setUpiLink(data.upiLink);
      setTxnId(data.txnId);
      setStep("processing");
      setPaymentStatus("");
      startPolling(data.txnId);

      setTimeout(() => setShowQr(true), 500);
      setTimeout(() => setShowApps(true), 800);
    } catch {
      setError("Failed to connect. Please try again.");
      setStep("idle");
      setIsSubmitting(false);
      setPaymentStatus("");
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
    setShowQr(false);
    setShowApps(false);
    setManualUpiId("");
    setIsSubmitting(false);
    setPaymentStatus("");
  }

  function openUpiApp() {
    if (!upiLink) return;
    window.location.href = upiLink;
  }

  const mobileApps = getUpiAppsForDevice();

  if (step === "confirming") {
    return (
      <div className="grid gap-4 text-center">
        <div className="flex items-center justify-center py-8">
          <CheckCircle className="h-12 w-12 animate-pulse text-emerald-500" />
        </div>
        <p className="text-sm font-bold">{paymentStatus || "Confirming payment..."}</p>
      </div>
    );
  }

  if (step === "processing" && upiLink) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Complete Payment</p>
          <button onClick={handleRetry} className="text-xs font-medium text-ink/50 underline">
            Cancel
          </button>
        </div>

        {paymentStatus && (
          <div className="rounded-control bg-blue-50 p-3 text-center text-xs font-medium text-blue-700">
            {paymentStatus}
          </div>
        )}

        <div className="rounded-card border border-ink/10 bg-surface p-4 text-center">
          <p className="text-lg font-bold">₹{subtotal.toFixed(2)}</p>
          <p className="mt-1 text-xs text-ink/50">to VIP Raiments</p>
        </div>

        {showQr && (
          <div className="grid gap-3">
            <p className="text-center text-xs font-semibold text-ink/60">Scan QR code with any UPI app</p>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(upiLink)}`}
                alt="Scan to pay with UPI"
                className="h-56 w-56 rounded-control border border-ink/10 bg-white p-2"
              />
            </div>
            <p className="text-center text-[11px] text-ink/40">
              Open any UPI app → Scan QR → Enter amount if asked
            </p>
          </div>
        )}

        {showApps && mobileApps.length > 0 && (
          <div className="grid gap-2">
            <p className="text-center text-xs font-semibold text-ink/60">Or tap to pay directly</p>
            <div className="grid grid-cols-5 gap-2">
              {mobileApps.map((app) => (
                <button
                  key={app.scheme}
                  type="button"
                  onClick={() => openUpiApp()}
                  className="flex flex-col items-center gap-1.5 rounded-control border border-ink/10 bg-white p-3 text-center transition-colors hover:bg-surface"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.icon}
                  </div>
                  <span className="text-[10px] font-medium text-ink/70">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showApps && mobileApps.length === 0 && (
          <div className="rounded-card border border-ink/10 bg-surface p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 shrink-0 text-ink/40" />
              <div>
                <p className="text-xs font-semibold">On desktop?</p>
                <p className="text-[11px] text-ink/50">
                  Scan the QR code with your phone&apos;s UPI app, or copy the UPI ID below.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <button
            type="button"
            onClick={handleManualConfirm}
            disabled={isSubmitting}
            className="h-12 w-full rounded-control bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            I&apos;ve completed the payment
          </button>
          <p className="text-center text-[11px] text-ink/40">
            Click after you have made the payment. We&apos;ll verify automatically.
          </p>
        </div>
      </div>
    );
  }

  if (step === "paid") {
    return (
      <div className="grid gap-4">
        <div className="flex items-center gap-3 rounded-card bg-amber-50 p-4">
          <XCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-800">Payment not detected</p>
            <p className="text-xs text-amber-600">
              If you&apos;ve completed the payment, click the button below.
            </p>
          </div>
        </div>

        {upiLink && (
          <div className="grid gap-2">
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                alt="Scan to pay with UPI"
                className="h-40 w-40 rounded-control border border-ink/10"
              />
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <button
            type="button"
            onClick={handleManualConfirm}
            disabled={isSubmitting}
            className="h-12 w-full rounded-control bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            I&apos;ve completed the payment
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="text-center text-xs font-medium text-ink/50 underline"
          >
            Cancel and retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={initiatePayment}
        disabled={isSubmitting}
        className="h-12 w-full rounded-control bg-ink px-5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Preparing..." : `Pay ₹${subtotal} with UPI`}
      </button>
      <div className="flex items-center justify-center gap-4 text-xs text-ink/50">
        <span className="flex items-center gap-1">
          <QrCode className="h-3 w-3" /> Scan & Pay
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> Any UPI App
        </span>
      </div>
    </div>
  );
}
