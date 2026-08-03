import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubpageHeader } from "@/components/subpage-header";
import { SowDocument } from "@/components/sow-document";
import { PrintButton } from "@/components/print-button";
import { isSowPlan, sowDocuments } from "@/lib/sow";

export const metadata: Metadata = {
  title: "Plan Statement of Work",
  robots: { index: false, follow: false },
};

export default async function PlanSowPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  if (!isSowPlan(plan)) notFound();
  return <main className="subpage sow-page">
    <SubpageHeader />
    <div className="sow-page-actions"><PrintButton /></div>
    <SowDocument document={sowDocuments[plan]} />
    <p className="sow-legal-note">This template is part of the service contracting workflow. Each engagement becomes complete only when the client and Jason Sirotin electronically sign the same version.</p>
  </main>;
}
