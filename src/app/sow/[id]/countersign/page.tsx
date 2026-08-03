import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubpageHeader } from "@/components/subpage-header";
import { CountersignForm } from "@/components/countersign-form";
import { SowDocument } from "@/components/sow-document";
import { createAdminClient } from "@/lib/supabase/admin";
import { tokensMatch } from "@/lib/sow-security";
import type { SowDocument as SowDocumentData } from "@/lib/sow";

export const metadata: Metadata = { title: "Counter-sign SOW", robots: { index: false, follow: false }, alternates: { canonical: "/legal/sow/monthly" } };
export const dynamic = "force-dynamic";

export default async function CountersignPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ id }, { token }] = await Promise.all([params, searchParams]);
  if (!token || token.length > 200) notFound();
  const { data } = await createAdminClient().from("service_sows").select("*").eq("id", id).maybeSingle();
  if (!data || !data.jason_signing_token_hash || !data.jason_signing_token_expires_at || !tokensMatch(token, data.jason_signing_token_hash) || new Date(data.jason_signing_token_expires_at) < new Date()) notFound();

  const executed = data.status === "fully_executed";
  return <main className="subpage sow-page"><SubpageHeader />
    <div className="sow-private-banner">Private signature record · Payment {data.payment_confirmed_at ? "confirmed" : "pending"}</div>
    <SowDocument document={data.document_snapshot as SowDocumentData} client={{ name: data.client_signature, title: data.signer_title, company: data.company_name, signedAt: data.client_signed_at }} consultant={executed ? { name: data.jason_signature, title: "Jason Sirotin · AutomateMeJay", signedAt: data.jason_signed_at } : undefined} />
    {executed ? <div className="sow-sign-panel sow-sign-complete"><h2>Already fully executed</h2><p>No further signature is needed.</p></div> : data.status === "payment_confirmed" ? <CountersignForm sowId={id} token={token} /> : <div className="sow-sign-panel"><h2>Payment has not been confirmed</h2><p>This SOW cannot be counter-signed until Stripe confirms payment.</p></div>}
  </main>;
}
