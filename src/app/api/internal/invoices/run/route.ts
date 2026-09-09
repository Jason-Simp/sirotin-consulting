import { createHash } from "node:crypto";
import { runDueInvoices } from "@/lib/invoices";
import { getRequestId, safeLog } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";

async function authorized(request: Request) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (supplied.length < 32 || supplied.length > 256) return false;
  const keyHash = createHash("sha256").update(supplied).digest("hex");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("invoice_scheduler_keys").select("key_hash").eq("key_hash", keyHash).eq("active", true).maybeSingle();
  return !error && Boolean(data);
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!await authorized(request)) {
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
