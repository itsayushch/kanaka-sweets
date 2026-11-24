/**
 * Razorpay helpers. SERVER ONLY: this file reads the secret key, so it must
 * never be imported from a "use client" component (Rule F4).
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

/** Read a required environment variable, or fail with a clear message. */
function requireEnv(name: "RAZORPAY_KEY_ID" | "RAZORPAY_KEY_SECRET"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add your Razorpay TEST keys to .env`);
  }
  return value;
}

/** Public key id: safe to send to the browser (it only identifies the shop). */
export function getRazorpayKeyId(): string {
  return requireEnv("RAZORPAY_KEY_ID");
}

/** Razorpay API client, created on demand with the secret from the environment. */
export function getRazorpayClient(): Razorpay {
  return new Razorpay({
    key_id: requireEnv("RAZORPAY_KEY_ID"),
    key_secret: requireEnv("RAZORPAY_KEY_SECRET"),
  });
}

/**
 * Check a Razorpay payment signature (Rule F2).
 *
 * After a successful payment Razorpay gives the browser three values. The
 * signature is proof that they came from Razorpay, because only Razorpay and
 * we know the secret key:
 *
 *   expected = HMAC_SHA256( razorpay_order_id + "|" + razorpay_payment_id,
 *                           RAZORPAY_KEY_SECRET )
 *
 * We recompute `expected` ourselves and compare it with the signature we were
 * sent. timingSafeEqual compares every byte in the same time, so an attacker
 * can't learn the right signature by measuring how fast we reject a guess.
 */
export function isValidPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  const secret = requireEnv("RAZORPAY_KEY_SECRET");

  const expected = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedBytes = Buffer.from(expected, "utf8");
  const givenBytes = Buffer.from(signature, "utf8");

  // timingSafeEqual throws if the lengths differ, so check that first.
  if (expectedBytes.length !== givenBytes.length) return false;
  return timingSafeEqual(expectedBytes, givenBytes);
}

/**
 * Turn whatever a failed Razorpay call threw into a short, safe log line.
 * The SDK throws a plain object like { statusCode, error: { description } },
 * not an Error. We log only the status and description, never keys.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const e = error as { statusCode?: number; error?: { description?: string } };
    return `Razorpay error ${e.statusCode ?? "?"}: ${e.error?.description ?? "no description"}`;
  }
  return "Unknown error";
}

/** Stop waiting for a slow call after `ms` so the customer is never stuck. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}
