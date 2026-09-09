"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireJasonAdmin } from "@/lib/admin-auth";
import { markInvoicePaid, sendInvoiceReminder } from "@/lib/invoices";

export async function remindInvoice(formData: FormData) {
  await requireJasonAdmin();
  const invoiceId = String(formData.get("invoiceId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId)) redirect("/admin/invoices?error=invalid");
  try {
    await sendInvoiceReminder(invoiceId);
  } catch {
    redirect("/admin/invoices?error=reminder");
  }
  revalidatePath("/admin/invoices");
  redirect("/admin/invoices?sent=reminder");
}

export async function recordInvoicePaid(formData: FormData) {
  await requireJasonAdmin();
  const invoiceId = String(formData.get("invoiceId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(invoiceId)) redirect("/admin/invoices?error=invalid");
  try {
    await markInvoicePaid(invoiceId);
  } catch {
    redirect("/admin/invoices?error=paid");
  }
  revalidatePath("/admin/invoices");
  redirect("/admin/invoices?sent=paid");
}
