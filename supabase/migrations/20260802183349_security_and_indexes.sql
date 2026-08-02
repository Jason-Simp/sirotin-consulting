create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter function public.handle_new_user() set schema private;
alter function public.is_admin() set schema private;
alter function public.is_org_member(uuid) set schema private;
alter function public.is_workspace_member(uuid) set schema private;
alter function public.set_updated_at() set schema private;

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.is_admin() from public, anon;
revoke all on function private.is_org_member(uuid) from public, anon;
revoke all on function private.is_workspace_member(uuid) from public, anon;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.is_workspace_member(uuid) to authenticated;

create policy "intake_admin_read" on public.intake_requests
for select to authenticated using (private.is_admin());

create policy "intake_admin_update" on public.intake_requests
for update to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "stripe_events_admin_read" on public.stripe_events
for select to authenticated using (private.is_admin());

create policy "resend_events_admin_read" on public.resend_events
for select to authenticated using (private.is_admin());

create index activity_events_actor_idx on public.activity_events (actor_id);
create index activity_events_workspace_idx on public.activity_events (workspace_id);
create index agreements_accepted_by_idx on public.agreements (accepted_by);
create index agreements_organization_idx on public.agreements (organization_id);
create index approvals_approved_by_idx on public.approvals (approved_by);
create index approvals_workspace_idx on public.approvals (workspace_id);
create index cost_authorizations_approved_by_idx on public.cost_authorizations (approved_by);
create index cost_authorizations_workspace_idx on public.cost_authorizations (workspace_id);
create index files_uploaded_by_idx on public.files (uploaded_by);
create index files_workspace_idx on public.files (workspace_id);
create index intake_requests_reviewed_by_idx on public.intake_requests (reviewed_by);
create index message_reads_user_idx on public.message_reads (user_id);
create index messages_parent_idx on public.messages (parent_message_id);
create index messages_sender_idx on public.messages (sender_id);
create index notes_author_idx on public.notes (author_id);
create index organizations_primary_contact_idx on public.organizations (primary_contact_id);
create index subscriptions_organization_idx on public.subscriptions (organization_id);
create index testing_reports_submitted_by_idx on public.testing_reports (submitted_by);
create index testing_reports_workspace_idx on public.testing_reports (workspace_id);
create index trials_approved_by_idx on public.trials (approved_by);
create index trials_organization_idx on public.trials (organization_id);
create index workspaces_created_by_idx on public.workspaces (created_by);
