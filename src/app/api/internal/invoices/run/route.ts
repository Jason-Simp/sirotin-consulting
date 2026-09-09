import { timingSafeEqual } from "node:crypto";
import { runDueInvoices } from "@/lib/invoices";
import { getRequestId, safeLog } from "@/lib/security";

function authorized(request: Request) {
  const secret = process.env.INVOICE_CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || secret.length < 32 || supplied.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(secret));
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!authorized(request)) {
    safeLog("warn", "invoice.cron_unauthorized", { requestId });
    return Response.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const results = await runDueInvoices();
    return Response.json({ ok: true, results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    safeLog("error", "invoice.cron_failed", { requestId, error });
    return Response.json({ error: "Invoice run failed." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
