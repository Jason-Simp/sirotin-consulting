import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, MessageSquareText, ReceiptText, Wrench } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Client Workspace", robots: { index: false, follow: false } };

export default async function PortalPage() {
  if (!hasSupabaseConfig()) return <main className="portal-shell"><div className="portal-empty"><Wrench size={30} /><h1>The workspace foundation is ready.</h1><p>Supabase credentials are required to activate client accounts and private data.</p><Link className="button button-dark" href="/">Return home</Link></div></main>;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in");

  return <main className="portal-shell"><aside className="portal-nav"><Link href="/" className="wordmark"><span>JS</span><strong>Workspace</strong></Link><nav><a className="active"><LayoutDashboard size={17} /> Dashboard</a><a><MessageSquareText size={17} /> Messages</a><a><ReceiptText size={17} /> Billing</a></nav></aside><section className="portal-content"><p className="section-label">/ Client workspace</p><h1>Welcome back.</h1><div className="portal-card"><p>Your workspace will appear here after your request is reviewed and activated.</p></div></section></main>;
}
