import { createAdminClient } from "@/lib/supabase/admin";

export async function auditAgentAction(input: {
  conversationId?: string;
  action: string;
  status: "requested" | "completed" | "rejected" | "failed";
  requestData?: Record<string, unknown>;
  responseData?: Record<string, unknown>;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("agent_action_audit").insert({
    conversation_id: input.conversationId ?? null,
    action: input.action,
    status: input.status,
    request_data: input.requestData ?? {},
    response_data: input.responseData ?? {},
  });
  if (error) throw error;
}
