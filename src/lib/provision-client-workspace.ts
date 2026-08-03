import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

type AdminClient = SupabaseClient;

export async function provisionClientWorkspace(input: {
  supabase: AdminClient;
  email: string;
  fullName?: string | null;
  companyName?: string | null;
  organizationId?: string | null;
  problem?: string | null;
  desiredOutcome?: string | null;
  systemsInvolved?: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
  const { data: existingProfile, error: profileLookupError } = await input.supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (profileLookupError) throw profileLookupError;

  let userId = existingProfile?.id;
  if (!userId) {
    const { data: invited, error: inviteError } = await input.supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/portal`,
      data: { full_name: input.fullName ?? "" },
    });
    if (inviteError) throw inviteError;
    userId = invited.user.id;
  }

  const { error: profileUpdateError } = await input.supabase.from("profiles").update({
    full_name: input.fullName?.trim() || null,
  }).eq("id", userId);
  if (profileUpdateError) throw profileUpdateError;

  let organizationId = input.organizationId ?? null;
  if (!organizationId) {
    const { data: existingMembership, error: membershipLookupError } = await input.supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    if (membershipLookupError) throw membershipLookupError;
    organizationId = existingMembership?.organization_id ?? null;
  }

  if (!organizationId) {
    const { data: organization, error: organizationError } = await input.supabase.from("organizations").insert({
      name: input.companyName?.trim() || input.fullName?.trim() || email,
      primary_contact_id: userId,
      status: "active",
    }).select("id").single();
    if (organizationError) throw organizationError;
    organizationId = organization.id;
  } else {
    const { error: organizationUpdateError } = await input.supabase.from("organizations").update({
      primary_contact_id: userId,
      status: "active",
    }).eq("id", organizationId);
    if (organizationUpdateError) throw organizationUpdateError;
  }

  const { error: memberError } = await input.supabase.from("organization_members").upsert({
    organization_id: organizationId,
    user_id: userId,
    member_role: "primary_contact",
    can_direct_work: true,
    can_test: true,
    can_approve: true,
    can_view_billing: true,
    active: true,
  }, { onConflict: "organization_id,user_id" });
  if (memberError) throw memberError;

  const { data: existingWorkspace, error: workspaceLookupError } = await input.supabase.from("workspaces")
    .select("id")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();
  if (workspaceLookupError) throw workspaceLookupError;
  if (!existingWorkspace) {
    const { error: workspaceError } = await input.supabase.from("workspaces").insert({
      organization_id: organizationId,
      name: "First automation workstream",
      problem: input.problem?.trim() || "Define the recurring work that is creating friction.",
      desired_outcome: input.desiredOutcome?.trim() || "Agree on the smallest useful, testable result.",
      systems_involved: input.systemsInvolved?.trim() || null,
      status: "discovery",
      position: "active",
      next_action: "Confirm the workflow with Jason",
      latest_summary: "Your private workspace is active. Use the communication center to add context, files, and questions.",
      created_by: userId,
    });
    if (workspaceError) throw workspaceError;
  }

  return { userId, organizationId };
}
