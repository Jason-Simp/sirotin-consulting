import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, MessageSquareText, ReceiptText, Wrench } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { openBillingPortal } from "./actions";

export const metadata: Metadata = { title: "Client Workspace", robots: { index: false, follow: false } };

export default async function PortalPage() {
  if (!hasSupabaseConfig()) return <main className="portal-shell"><div className="portal-empty"><Wrench size={30} /><h1>The workspace foundation is ready.</h1><p>Supabase credentials are required to activate client accounts and private data.</p><Link className="button button-dark" href="/">Return home</Link></div></main>;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in");

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, can_view_billing, member_role")
    .eq("user_id", data.claims.sub)
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  const { data: subscription } = membership ? await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, stripe_customer_id")
    .eq("organization_id", membership.organization_id)
    .limit(1)
    .maybeSingle() : { data: null };
  const canManageBilling = Boolean(subscription?.stripe_customer_id && (membership?.can_view_billing || membership?.member_role === "primary_contact"));

  return <main className="portal-shell"><aside className="portal-nav"><Link href="/" className="wordmark"><span>JS</span><strong>Workspace</strong></Link><nav><a className="active"><LayoutDashboard size={17} /> Dashboard</a><a><MessageSquareText size={17} /> Messages</a><a><ReceiptText size={17} /> Billing</a></nav></aside><section className="portal-content"><p className="section-label">/ Client workspace</p><h1>Welcome back.</h1><div className="portal-grid"><div className="portal-card"><h2>Active work</h2><p>Your workspace will appear here after your request is reviewed and activated.</p></div><div className="portal-card billing-card"><ReceiptText size={22} /><div><p className="eyebrow">Membership billing</p><h2>{subscription ? `${subscription.plan} partner` : "No recurring membership"}</h2><p>{subscription ? `Status: ${subscription.status.replaceAll("_", " ")}. Manage payment details, invoices, or cancel future renewals securely through Stripe.` : "Recurring billing details will appear here after a weekly or monthly membership begins."}</p></div>{canManageBilling ? <form action={openBillingPortal}><button className="button button-primary" type="submit">Manage or cancel membership <ArrowUpRight size={16} /></button></form> : <Link className="button button-secondary" href="mailto:hello@automatemejay.com">Billing help</Link>}</div></div></section></main>;
}
