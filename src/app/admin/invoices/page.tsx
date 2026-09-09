import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, ReceiptText } from "lucide-react";
import { requireJasonAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordInvoicePaid, remindInvoice } from "./actions";

export const metadata: Metadata = { title: "Invoice Center", robots: { index: false, follow: false } };

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function InvoiceAdminPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  await requireJasonAdmin();
  const params = await searchParams;
  const supabase = createAdminClient();
  const [{ data: accounts }, { data: invoices }] = await Promise.all([
    supabase.from("invoice_accounts").select("slug,client_name,billing_emails,amount_cents,send_day,due_day,active").order("client_name"),
    supabase.from("invoice_records").select("id,client_slug,invoice_number,issue_date,due_date,amount_cents,status,sent_at,paid_at,reminder_count,last_reminder_at,last_error").order("issue_date", { ascending: false }).limit(36),
  ]);

  return <main className="invoice-admin-shell">
    <header className="invoice-admin-header"><Link href="/portal">← Client workspace</Link><span>Jason Sirotin / private administration</span></header>
    <section className="invoice-admin-intro"><p className="section-label">/ Invoice center</p><h1>Bank-transfer invoices, without Stripe.</h1><p>The monthly run creates one invoice per client and month, attaches a PDF, copies Jason, and keeps delivery evidence. Reminders are always deliberate.</p></section>
    {params.sent && <p className="invoice-notice success"><CheckCircle2 size={17} /> {params.sent === "paid" ? "Invoice marked paid." : "Reminder accepted by the email provider."}</p>}
    {params.error && <p className="invoice-notice error">That action could not be completed. No duplicate email was intentionally sent.</p>}
    <section className="invoice-admin-grid">
      {(accounts ?? []).map((account) => <article className="invoice-account-card" key={account.slug}><div><ReceiptText size={24} /><p className="eyebrow">Recurring account</p><h2>{account.client_name}</h2><p>{money(account.amount_cents)} monthly · sends on the {account.send_day}th · due on the {account.due_day}th</p></div><div><span>{account.active ? "Active" : "Paused"}</span>{account.billing_emails.map((email: string) => <small key={email}>{email}</small>)}</div></article>)}
    </section>
    <section className="invoice-ledger"><div className="invoice-ledger-heading"><Mail size={22} /><div><p className="eyebrow">Invoice ledger</p><h2>Sent, paid, and reminder history</h2></div></div>
      {!invoices?.length ? <p className="invoice-empty">The September invoice will appear here after the scheduled run on September 10.</p> : <div className="invoice-table-wrap"><table><thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th>Reminders</th><th>Actions</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.invoice_number}</strong><small>{invoice.client_slug}</small></td><td>{invoice.issue_date}</td><td>{invoice.due_date}</td><td>{money(invoice.amount_cents)}</td><td><span className={`invoice-status ${invoice.status}`}>{invoice.status}</span>{invoice.last_error && <small>Delivery needs review</small>}</td><td>{invoice.reminder_count}</td><td><div className="invoice-actions">{invoice.status === "sent" && <><form action={remindInvoice}><input type="hidden" name="invoiceId" value={invoice.id} /><button type="submit">Send reminder</button></form><form action={recordInvoicePaid}><input type="hidden" name="invoiceId" value={invoice.id} /><button type="submit">Mark paid</button></form></>}</div></td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}
