/**
 * Rate limiting for the admin login, checkout and payment endpoints (Rule F8).
 * SERVER ONLY.
 *
 * "Rate limiting" means: one visitor can only try so many times in a window of
 * time, so nobody can guess admin passwords or hammer checkout.
 *
 * How it works:
 *  - With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set (production),
 *    the counts live in Upstash Redis, so every server instance shares them.
 *  - Without them (local development), an in-memory counter is used. It only
 *    counts inside one running server, so it is NOT enough for production.
 *  - If Upstash is temporarily unreachable we fall back to the in-memory
 *    counter for that call instead of blocking real customers.
 */
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** The limits. `max` attempts per `windowSec` seconds, per visitor. */
export const RATE_RULES = {
  login: { max: 10, windowSec: 600 }, // per IP address
  loginEmail: { max: 5, windowSec: 600 }, // per email, stops guessing from many IPs
  checkout: { max: 10, windowSec: 600 },
  paymentCreate: { max: 20, windowSec: 600 },
  paymentVerify: { max: 30, windowSec: 600 },
} as const;

export type RateRule = keyof typeof RATE_RULES;

export interface RateResult {
  allowed: boolean;
  retryAfterSec: number;
}

// ── In-memory fallback (sliding window of timestamps per key) ────────────────
const memory = new Map<string, number[]>();

function limitInMemory(rule: RateRule, key: string): RateResult {
  const { max, windowSec } = RATE_RULES[rule];
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const id = `${rule}:${key}`;

  // Keep only the attempts that are still inside the window.
  const recent = (memory.get(id) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    memory.set(id, recent);
    return { allowed: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
  }
  recent.push(now);
  memory.set(id, recent);

  // Stop the map growing forever on a long-running server.
  if (memory.size > 5000) {
    for (const [k, times] of memory) {
      if (times.every((t) => now - t >= windowMs * 2)) memory.delete(k);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

// ── Upstash (production) ─────────────────────────────────────────────────────
const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);
const upstashLimiters = new Map<RateRule, Ratelimit>();
let warnedAboutMemory = false;

function upstashFor(rule: RateRule): Ratelimit {
  let limiter = upstashLimiters.get(rule);
  if (!limiter) {
    const { max, windowSec } = RATE_RULES[rule];
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: `kanaka:${rule}`,
    });
    upstashLimiters.set(rule, limiter);
  }
  return limiter;
}

/** Count one attempt for `key` under `rule` and say whether it is allowed. */
export async function checkRateLimit(rule: RateRule, key: string): Promise<RateResult> {
  if (!upstashConfigured) {
    if (!warnedAboutMemory && process.env.NODE_ENV === "production") {
      warnedAboutMemory = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / TOKEN are not set: using per-server memory. Set them for real protection.",
      );
    }
    return limitInMemory(rule, key);
  }

  try {
    const result = await upstashFor(rule).limit(key);
    return {
      allowed: result.success,
      retryAfterSec: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[rate-limit] Upstash failed, using memory for this call:", error instanceof Error ? error.message : "unknown");
    return limitInMemory(rule, key);
  }
}

/**
 * The visitor's IP address. On Vercel the platform sets these headers itself
 * (a visitor can't fake them there). Locally they come from the request.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return headers.get("x-real-ip")?.trim() || forwarded || "unknown";
}

/** Human-friendly wait, e.g. "10 minutes". */
export function waitText(seconds: number): string {
  if (seconds < 90) return `${seconds} seconds`;
  return `${Math.ceil(seconds / 60)} minutes`;
}

/**
 * For API route handlers. Returns a 429 response if this visitor (by IP) has
 * used up the rule, otherwise null:
 *
 *   const limited = await limitByIp(request, "checkout");
 *   if (limited) return limited;
 */
export async function limitByIp(request: Request, rule: RateRule): Promise<NextResponse | null> {
  const result = await checkRateLimit(rule, clientIp(request.headers));
  if (result.allowed) return null;
  return NextResponse.json(
    {
      error: "RATE_LIMITED",
      message: `Too many attempts. Please try again in ${waitText(result.retryAfterSec)}.`,
    },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSec) } },
  );
}
