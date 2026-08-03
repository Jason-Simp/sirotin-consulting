"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createStripeClient } from "@/lib/stripe";

async function getPortalConfiguration() {
  const stripe = createStripeClient();
  const configurations = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
  const existing = configurations.data.find((configuration) => configuration.name === "Sirotin Consulting Membership");
  if (existing) return existing.id;

  const configuration = await stripe.billingPortal.configurations.create({
    name: "Sirotin Consulting Membership",
    business_profile: {
      headline: "Manage your Jason Sirotin AI Automation Partner membership.",
      privacy_policy_url: "https://automatemejay.com/legal/privacy",
      terms_of_service_url: "https://automatemejay.com/legal/terms",
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        proration_behavior: "none",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
    },
  });
  return configuration.id;
}

export async function openBillingPortal() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  if (!userId) redirect("/sign-in");

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, can_view_billing, member_role")
    .eq("user_id", userId)
    .eq("active", true)
    .in("member_role", ["primary_contact", "billing_contact"])
    .limit(1)
    .maybeSingle();

  if (!membership || (!membership.can_view_billing && membership.member_role !== "primary_contact")) {
    redirect("/portal?billing=unavailable");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("organization_id", membership.organization_id)
    .not("stripe_customer_id", "is", null)
    .limit(1)
    .maybeSingle();
  if (!subscription?.stripe_customer_id) redirect("/portal?billing=unavailable");

  const stripe = createStripeClient();
  const configuration = await getPortalConfiguration();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    configuration,
    return_url: `${siteUrl}/portal`,
  });
  redirect(session.url);
}

async function getAuthorizedWorkspace(workspaceId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  if (!userId) redirect("/sign-in");
  const { data: workspace } = await supabase.from("workspaces")
    .select("id,organization_id")
    .eq("id", workspaceId)
    .maybeSingle();
  if (!workspace) redirect("/portal?error=workspace");
  return { supabase, userId, workspace };
}

export async function sendWorkspaceMessage(formData: FormData) {
  const parsed = z.object({ workspaceId: z.string().uuid(), body: z.string().trim().min(1).max(20_000) }).safeParse({
    workspaceId: formData.get("workspaceId"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect("/portal?error=message#messages");
  const { supabase, userId } = await getAuthorizedWorkspace(parsed.data.workspaceId);
  const { error } = await supabase.from("messages").insert({
    workspace_id: parsed.data.workspaceId,
    sender_id: userId,
    body: parsed.data.body,
    message_type: "client_feedback",
  });
  if (error) redirect("/portal?error=message#messages");
  revalidatePath("/portal");
}

export async function submitTestingReport(formData: FormData) {
  const parsed = z.object({
    workspaceId: z.string().uuid(),
    iterationName: z.string().trim().min(2).max(160),
    expectedResult: z.string().trim().min(2).max(5_000),
    actualResult: z.string().trim().min(2).max(5_000),
    comments: z.string().trim().max(5_000).optional().default(""),
  }).safeParse({
    workspaceId: formData.get("workspaceId"),
    iterationName: formData.get("iterationName"),
    expectedResult: formData.get("expectedResult"),
    actualResult: formData.get("actualResult"),
    comments: formData.get("comments"),
  });
  if (!parsed.success) redirect("/portal?error=testing#testing");
  const { supabase, userId } = await getAuthorizedWorkspace(parsed.data.workspaceId);
  const { error } = await supabase.from("testing_reports").insert({
    workspace_id: parsed.data.workspaceId,
    submitted_by: userId,
    iteration_name: parsed.data.iterationName,
    expected_result: parsed.data.expectedResult,
    actual_result: parsed.data.actualResult,
    comments: parsed.data.comments || null,
  });
  if (error) redirect("/portal?error=testing#testing");
  revalidatePath("/portal");
}

export async function submitWorkspaceApproval(formData: FormData) {
  const parsed = z.object({
    workspaceId: z.string().uuid(),
    iterationName: z.string().trim().min(2).max(160),
    approvalType: z.enum(["approved_for_next_step", "approved_for_production", "changes_requested"]),
    comments: z.string().trim().max(5_000).optional().default(""),
  }).safeParse({
    workspaceId: formData.get("workspaceId"),
    iterationName: formData.get("iterationName"),
    approvalType: formData.get("approvalType"),
    comments: formData.get("comments"),
  });
  if (!parsed.success) redirect("/portal?error=approval#approvals");
  const { supabase, userId } = await getAuthorizedWorkspace(parsed.data.workspaceId);
  const { error } = await supabase.from("approvals").insert({
    workspace_id: parsed.data.workspaceId,
    approved_by: userId,
    iteration_name: parsed.data.iterationName,
    approval_type: parsed.data.approvalType,
    comments: parsed.data.comments || null,
  });
  if (error) redirect("/portal?error=approval#approvals");
  revalidatePath("/portal");
}

export async function uploadWorkspaceFile(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  const description = String(formData.get("description") ?? "").trim().slice(0, 500);
  const file = formData.get("file");
  if (!z.string().uuid().safeParse(workspaceId).success || !(file instanceof File) || file.size < 1 || file.size > 10 * 1024 * 1024) redirect("/portal?error=file#files");
  const allowed = new Set(["application/pdf", "image/png", "image/jpeg", "text/plain", "text/csv", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
  if (!allowed.has(file.type)) redirect("/portal?error=file-type#files");
  const { supabase, userId, workspace } = await getAuthorizedWorkspace(workspaceId);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "upload";
  const storagePath = `${workspace.organization_id}/${workspace.id}/${userId}/${randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("client-files").upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) redirect("/portal?error=file#files");
  const { error: fileError } = await supabase.from("files").insert({
    workspace_id: workspace.id,
    uploaded_by: userId,
    storage_path: storagePath,
    original_name: file.name.slice(0, 255),
    mime_type: file.type,
    size_bytes: file.size,
    description: description || null,
  });
  if (fileError) {
    await supabase.storage.from("client-files").remove([storagePath]);
    redirect("/portal?error=file#files");
  }
  revalidatePath("/portal");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
