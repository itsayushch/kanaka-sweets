/**
 * Tiny helper the admin forms use to call the /api/admin endpoints.
 * It returns the status and the parsed JSON, and never throws.
 */
export interface AdminResult {
  ok: boolean;
  status: number;
  data: {
    error?: string;
    message?: string;
    url?: string;
    id?: string;
    archived?: boolean;
    issues?: { path: string; message: string }[];
  };
}

export async function adminFetch(
  method: "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
): Promise<AdminResult> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { message: "Could not reach the server. Check your connection and try again." },
    };
  }
}

/** Turn the server's list of issues into { "variants.0.price": "message" }. */
export function issuesToMap(issues: { path: string; message: string }[] | undefined) {
  const map: Record<string, string> = {};
  for (const issue of issues ?? []) {
    if (!(issue.path in map)) map[issue.path] = issue.message;
  }
  return map;
}
