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
