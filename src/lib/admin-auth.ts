import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const JASON_ADMIN_EMAILS = [
  "jason@simplsolutions.app",
  "sirotin@ecgprod.com",
  "jason@brainbytescreative.com",
] as const;

export function isJasonAdminEmail(value: unknown): value is (typeof JASON_ADMIN_EMAILS)[number] {
  return typeof value === "string" && JASON_ADMIN_EMAILS.includes(value.trim().toLowerCase() as (typeof JASON_ADMIN_EMAILS)[number]);
}

export async function requireJasonAdmin(nextPath = "/admin/invoices") {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  if (!data?.claims?.sub) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  if (!isJasonAdminEmail(email)) redirect("/portal");
  return { userId: data.claims.sub, email };
}
