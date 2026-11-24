"use client";

/**
 * Opens the Razorpay payment window for an unpaid order and sends the result
 * to our server to verify (Rule F2).
 *
 * Important: this component NEVER decides that an order is paid. The Razorpay
 * window returns three values; we pass them to /api/payments/verify and the
 * server checks the signature. Only then does the order page show "Paid".
 * It also never sends an amount: the server uses the order total it saved.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** The small part of Razorpay's browser API that we use. */
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
}
type RazorpayConstructor = new (options: {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/** Load Razorpay's script only when the customer is about to pay (keeps JS small, D8). */
function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Phase = "idle" | "starting" | "paying" | "verifying" | "failed" | "closed" | "error";

export function PayNowButton({
  orderNumber,
  autoStart = false,
}: {
  orderNumber: string;
  autoStart?: boolean;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const started = useRef(false);

  async function startPayment() {
    setPhase("starting");
    setMessage(null);

    try {
      // 1. Ask our server for the Razorpay order (amount comes from our database).
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhase("error");
        setMessage(data.message ?? "We couldn't start the payment. Please try again.");
        return;
      }

      // 2. Load Razorpay's window.
      if (!(await loadRazorpayScript()) || !window.Razorpay) {
        setPhase("error");
        setMessage("The payment window could not load. Check your connection and try again.");
        return;
      }

      // 3. Open it.
      const razorpay = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amountPaise,
        currency: "INR",
        name: "Kanaka Sweets & Bakery",
        description: `Order ${data.orderNumber}`,
        theme: { color: "#871a45" },
        // Razorpay calls this after a successful payment.
        handler: async (response) => {
          setPhase("verifying");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              router.refresh(); // order page now loads the PAID status from the server
              return;
            }
            setPhase("error");
            setMessage(
              verifyData.message ??
                "We couldn't confirm your payment. If money was deducted, please contact the shop.",
            );
          } catch {
            setPhase("error");
            setMessage(
              "We couldn't confirm your payment. If money was deducted, please contact the shop.",
            );
          }
        },
        modal: {
          // Customer closed the window without paying.
          ondismiss: () => setPhase((p) => (p === "verifying" ? p : "closed")),
        },
      });
      razorpay.on("payment.failed", () => setPhase("failed"));
      setPhase("paying");
      razorpay.open();
    } catch {
      setPhase("error");
      setMessage("We couldn't reach the server. Check your connection and try again.");
    }
  }

  // After checkout we land here with ?pay=1 and open the payment window straight away.
  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true;
      void startPayment();
    }
    // startPayment only uses orderNumber/router, which don't change for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const busy = phase === "starting" || phase === "verifying" || phase === "paying";

  return (
    <div className="space-y-3">
      {/* Designed failed-payment state (B8) */}
      {phase === "failed" && (
        <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 space-y-1">
          <p className="font-bold">Your payment didn&apos;t go through.</p>
          <p>
            Your order is still saved for a short time. You can try again, or
            call the shop and we&apos;ll help you.
          </p>
        </div>
      )}
      {phase === "closed" && (
        <p role="status" className="text-sm text-stone-600">
          The payment window was closed. Your order is saved. Tap below when you are ready to pay.
        </p>
      )}
      {phase === "verifying" && (
        <p role="status" className="text-sm font-semibold text-[#871a45]">
          Confirming your payment. Please don&apos;t close this page...
        </p>
      )}
      {phase === "error" && message && (
        <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={startPayment}
        disabled={busy}
        className="w-full bg-[#871a45] hover:bg-[#691436] disabled:opacity-60 text-white py-3.5 px-6 rounded-xl font-bold text-sm min-h-[52px] shadow-sm"
      >
        {phase === "starting"
          ? "Opening payment..."
          : phase === "verifying"
            ? "Confirming..."
            : phase === "failed" || phase === "error"
              ? "Try payment again"
              : "Pay now"}
      </button>
    </div>
  );
}
