import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { publicEnv } from "@/lib/env";

type RequestLike = { headers: Headers };

type SecuritySeverity = "info" | "warning" | "critical";

export class SecurityControlError extends Error {
  constructor(message: string, readonly status = 503) {
    super(message);
    this.name = "SecurityControlError";
  }
}

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "RequestBodyTooLargeError";
  }
}

function cleanLogValue(value: unknown) {
  return String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/(sk_(?:live|test)_|whsec_|re_|sb_secret_)[A-Za-z0-9_\-]+/gi, "$1[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._~+\/-]+=*/gi, "Bearer [redacted]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .slice(0, 500);
}

function cleanLogDetail(detail: Record<string, string | number | boolean | null> | undefined) {
  if (!detail) return undefined;
  return Object.fromEntries(Object.entries(detail).map(([key, value]) => [
    cleanLogValue(key),
    typeof value === "string" ? cleanLogValue(value) : value,
  ]));
}

export function safeLog(
  level: "info" | "warn" | "error",
  event: string,
  input: { requestId?: string; error?: unknown; detail?: Record<string, string | number | boolean | null> } = {},
) {
  const error = input.error;
  const errorRecord = error && typeof error === "object" ? error as { name?: unknown; message?: unknown; code?: unknown } : null;
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event: cleanLogValue(event),
    request_id: input.requestId ? cleanLogValue(input.requestId) : undefined,
    detail: cleanLogDetail(input.detail),
    error: error ? {
      name: cleanLogValue(errorRecord?.name ?? "Error"),
      message: cleanLogValue(errorRecord?.message ?? error),
      code: errorRecord?.code ? cleanLogValue(errorRecord.code) : undefined,
    } : undefined,
  };
  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export function getRequestId(request: RequestLike) {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && /^[a-zA-Z0-9._:-]{8,128}$/.test(supplied) ? supplied : randomUUID();
}

function getClientAddress(request: RequestLike) {
  const candidate = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-render-forwarded-for")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]
    ?? "unknown";
  const normalized = candidate.trim();
  return /^[0-9a-fA-F:.]{3,64}$/.test(normalized) ? normalized : "unknown";
}

function fingerprint(request: RequestLike, subject?: string) {
  const secret = process.env.SECURITY_RATE_LIMIT_SECRET
    ?? process.env.AGENT_TOOL_SECRET
    ?? process.env.SUPABASE_SECRET_KEY;
  if (!secret || secret.length < 24) throw new SecurityControlError("Security rate limiting is not configured.");
  return createHmac("sha256", secret)
    .update(`${getClientAddress(request)}|${subject?.trim().toLowerCase() ?? ""}`)
    .digest("hex");
}

export async function logSecurityEvent(input: {
  request: RequestLike;
  requestId: string;
  eventType: string;
  route: string;
  severity?: SecuritySeverity;
  subject?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("security_events").insert({
    request_id: input.requestId,
    event_type: input.eventType,
    route: input.route,
    severity: input.severity ?? "info",
    request_key_hash: fingerprint(input.request, input.subject),
    metadata: input.metadata ?? {},
  });
  if (error) throw new SecurityControlError("Security event logging is unavailable.");
}

export async function enforceRateLimit(input: {
  request: RequestLike;
  requestId: string;
  route: string;
  limit: number;
  windowSeconds: number;
  subject?: string;
}) {
  const requestKeyHash = fingerprint(input.request, input.subject);
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("security_enforce_rate_limit", {
    p_request_id: input.requestId,
    p_route: input.route,
    p_request_key_hash: requestKeyHash,
    p_limit: input.limit,
    p_window_seconds: input.windowSeconds,
  });
  if (error || typeof data !== "boolean") {
    throw new SecurityControlError("Security rate limiting is unavailable.");
  }
  return { allowed: data, retryAfter: input.windowSeconds };
}

export function isSameOriginRequest(request: RequestLike) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const canonical = new URL(publicEnv.siteUrl ?? "https://automatemejay.com").origin;
  return origin === canonical || origin === canonical.replace("://", "://www.");
}

export async function readLimitedText(request: Request, maxBytes: number) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) throw new RequestBodyTooLargeError();
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let output = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }
    output += decoder.decode(value, { stream: true });
  }
  return output + decoder.decode();
}

export async function readLimitedJson(request: Request, maxBytes = 32_768) {
  const text = await readLimitedText(request, maxBytes);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function rateLimitResponse(retryAfter: number) {
  return Response.json(
    { error: "Too many requests. Please wait and try again." },
    { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } },
  );
}
