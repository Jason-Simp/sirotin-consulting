import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubpageHeader } from "@/components/subpage-header";
import { PrintButton } from "@/components/print-button";
import { SowDocument } from "@/components/sow-document";
import { createAdminClient } from "@/lib/supabase/admin";
import { tokensMatch } from "@/lib/sow-security";
import type { SowDocument as SowDocumentData } from "@/lib/sow";

export const metadata: Metadata = { title: "Executed Statement of Work", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ExecutedSowPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ id }, { token }] = await Promise.all([params, searchParams]);
  if (!token || token.length > 200) notFound();
  const { data } = await createAdminClient().from("service_sows").select("*").eq("id", id).eq("status", "fully_executed").maybeSingle();
  if (!data || !data.client_access_token_hash || !tokensMatch(token, data.client_access_token_hash)) notFound();
  return <main className="subpage sow-page"><SubpageHeader />
    <div className="sow-page-actions"><span className="legal-status">Fully executed</span><PrintButton /></div>
    <SowDocument document={data.document_snapshot as SowDocumentData} client={{ name: data.client_signature, title: data.signer_title, company: data.company_name, signedAt: data.client_signed_at }} consultant={{ name: data.jason_signature, title: "Jason Sirotin · AutomateMeJay", signedAt: data.jason_signed_at }} />
    <p className="sow-legal-note">Document version {data.sow_version} · SHA-256 {data.document_hash}</p>
  </main>;
}
