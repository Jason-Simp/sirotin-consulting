import "server-only";

import { Resend } from "resend";
import { createInvoicePdf, formatMoney, type InvoiceDocument } from "@/lib/invoice-pdf";
import { safeLog } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";

type InvoiceAccount = {
  slug: string;
  client_name: string;
  billing_emails: string[];
  cc_emails: string[];
  amount_cents: number;
  currency: string;
  service_description: string;
  seller_name: string;
  seller_address_lines: string[];
  send_day: number;
  due_day: number;
  timezone: string;
  invoice_prefix: string;
  payment_instructions: string;
};

type InvoiceRecord = {
  id: string;
  client_slug: string;
  period_month: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  amount_cents: number;
  currency: string;
  service_description: string;
  status: "pending" | "sending" | "sent" | "paid" | "void";
  reminder_count: number;
};

export function localDateParts(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: Number(value.year), month: Number(value.month), day: Number(value.day) };
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function periodLabel(periodMonth: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${periodMonth}T12:00:00Z`));
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

function toDocument(account: InvoiceAccount, invoice: InvoiceRecord): InvoiceDocument {
  return {
    invoiceNumber: invoice.invoice_number,
    issueDate: displayDate(invoice.issue_date),
    dueDate: displayDate(invoice.due_date),
    periodLabel: periodLabel(invoice.period_month),
    clientName: account.client_name,
    sellerName: account.seller_name,
    sellerAddressLines: account.seller_address_lines,
    serviceDescription: invoice.service_description,
    amountCents: invoice.amount_cents,
    currency: invoice.currency,
    paymentInstructions: account.payment_instructions,
  };
}

async function loadInvoice(invoiceId: string) {
  const supabase = createAdminClient();
  const { data: invoice, error: invoiceError } = await supabase.from("invoice_records").select("*").eq("id", invoiceId).single();
  if (invoiceError) throw invoiceError;
  const { data: account, error: accountError } = await supabase.from("invoice_accounts").select("*").eq("slug", invoice.client_slug).single();
  if (accountError) throw accountError;
  return { invoice: invoice as InvoiceRecord, account: account as InvoiceAccount };
}

async function deliverInvoice(input: { invoice: InvoiceRecord; account: InvoiceAccount; reminder: boolean }) {
  if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured.");
  const supabase = createAdminClient();
  if (!input.reminder) {
    const { data: claimed, error: claimError } = await supabase.from("invoice_records")
      .update({ status: "sending", last_error: null })
      .eq("id", input.invoice.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (claimError) throw claimError;
    if (!claimed) return { skipped: true, reason: "already-claimed" };
  } else {
    const { data: claimed, error: claimError } = await supabase.from("invoice_records")
      .update({ reminder_sending: true, last_error: null })
      .eq("id", input.invoice.id)
      .eq("status", "sent")
      .eq("reminder_sending", false)
      .select("id")
      .maybeSingle();
    if (claimError) throw claimError;
    if (!claimed) return { skipped: true, reason: "already-claimed" };
  }

  const document = toDocument(input.account, input.invoice);
  const attachment = await createInvoicePdf(document);
  const amount = formatMoney(input.invoice.amount_cents, input.invoice.currency);
  const due = displayDate(input.invoice.due_date);
  const subject = input.reminder
    ? `Reminder: ${input.invoice.invoice_number} is due ${due}`
    : `Invoice ${input.invoice.invoice_number} from Jason Sirotin - due ${due}`;
  const opening = input.reminder
    ? `This is a friendly reminder that invoice ${input.invoice.invoice_number} for ${amount} is due ${due}.`
    : `Attached is invoice ${input.invoice.invoice_number} for ${amount}, due ${due}.`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  let providerAccepted = false;
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
      to: input.account.billing_emails,
      cc: input.account.cc_emails,
      replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#07111d;line-height:1.6"><p>Hi ${escapeHtml(input.account.client_name)} accounting team,</p><p>${escapeHtml(opening)}</p><p>${escapeHtml(input.account.payment_instructions)}</p><p>Thank you,<br><strong>Jason Sirotin</strong><br>AutomateMeJay</p></div>`,
      text: `Hi ${input.account.client_name} accounting team,\n\n${opening}\n\n${input.account.payment_instructions}\n\nThank you,\nJason Sirotin\nAutomateMeJay`,
      attachments: [{ filename: `${input.invoice.invoice_number}.pdf`, content: attachment }],
      tags: [{ name: "invoice", value: input.invoice.invoice_number.replaceAll(/[^A-Za-z0-9_-]/g, "-") }],
    }, { idempotencyKey: `${input.reminder ? `reminder-${input.invoice.reminder_count + 1}` : "invoice-original"}-${input.invoice.id}`.slice(0, 256) });
    if (error) throw error;
    providerAccepted = true;

    const now = new Date().toISOString();
    const { error: deliveryError } = await supabase.from("invoice_email_deliveries").insert({
      invoice_id: input.invoice.id,
      delivery_kind: input.reminder ? "reminder" : "invoice",
      resend_email_id: data?.id ?? null,
      delivery_status: "accepted",
      sent_at: now,
    });
    if (deliveryError) throw deliveryError;

    const update = input.reminder
      ? { reminder_count: input.invoice.reminder_count + 1, reminder_sending: false, last_reminder_at: now, last_error: null }
      : { status: "sent", sent_at: now, last_error: null };
    const { error: updateError } = await supabase.from("invoice_records").update(update).eq("id", input.invoice.id);
    if (updateError) throw updateError;
    return { skipped: false, emailId: data?.id ?? null };
  } catch (error) {
    if (providerAccepted) {
      await supabase.from("invoice_records").update({ last_error: `Email provider accepted the message, but local evidence failed: ${String(error).slice(0, 400)}` }).eq("id", input.invoice.id);
    } else if (input.reminder) {
      await supabase.from("invoice_records").update({ reminder_sending: false, last_error: String(error).slice(0, 500) }).eq("id", input.invoice.id);
    } else {
      await supabase.from("invoice_records").update({ status: "pending", last_error: String(error).slice(0, 500) }).eq("id", input.invoice.id).eq("status", "sending");
    }
    throw error;
  }
}

export async function sendInvoiceReminder(invoiceId: string) {
  const { invoice, account } = await loadInvoice(invoiceId);
  if (invoice.status !== "sent") throw new Error("Only a sent, unpaid invoice can receive a reminder.");
  return deliverInvoice({ invoice, account, reminder: true });
}

export async function markInvoicePaid(invoiceId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("invoice_records").update({ status: "paid", paid_at: new Date().toISOString(), last_error: null }).eq("id", invoiceId).eq("status", "sent");
  if (error) throw error;
}

export async function runDueInvoices(now = new Date()) {
  const supabase = createAdminClient();
  const { data: accounts, error } = await supabase.from("invoice_accounts").select("*").eq("active", true);
  if (error) throw error;
  const results: Array<{ client: string; result: string }> = [];

  for (const rawAccount of accounts ?? []) {
    const account = rawAccount as InvoiceAccount;
    const local = localDateParts(now, account.timezone);
    if (local.day < account.send_day) {
      results.push({ client: account.slug, result: "not-due" });
      continue;
    }
    const periodMonth = isoDate(local.year, local.month, 1);
    const invoiceNumber = `${account.invoice_prefix}-${local.year}${String(local.month).padStart(2, "0")}`;
    const record = {
      client_slug: account.slug,
      period_month: periodMonth,
      invoice_number: invoiceNumber,
      issue_date: isoDate(local.year, local.month, account.send_day),
      due_date: isoDate(local.year, local.month, account.due_day),
      amount_cents: account.amount_cents,
      currency: account.currency,
      service_description: account.service_description,
    };
    const { error: insertError } = await supabase.from("invoice_records").insert(record);
    if (insertError && insertError.code !== "23505") throw insertError;
    const { data: invoice, error: fetchError } = await supabase.from("invoice_records").select("*").eq("client_slug", account.slug).eq("period_month", periodMonth).single();
    if (fetchError) throw fetchError;
    if (invoice.status !== "pending") {
      results.push({ client: account.slug, result: `skipped-${invoice.status}` });
      continue;
    }
    try {
      const delivery = await deliverInvoice({ invoice: invoice as InvoiceRecord, account, reminder: false });
      results.push({ client: account.slug, result: delivery.skipped ? `skipped-${delivery.reason}` : "sent" });
    } catch (deliveryError) {
      safeLog("error", "invoice.delivery_failed", { error: deliveryError, detail: { client: account.slug, invoice: invoiceNumber } });
      results.push({ client: account.slug, result: "failed" });
    }
  }
  return results;
}
