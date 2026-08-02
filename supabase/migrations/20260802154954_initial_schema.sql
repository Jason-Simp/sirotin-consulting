create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.intake_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company_name text not null,
  job_title text,
  phone text,
  website text,
  process_to_automate text not null,
  current_process text not null,
  desired_result text not null,
  systems_involved text not null,
  sensitive_data text not null check (sensitive_data in ('yes', 'no', 'unsure')),
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'declined', 'converted')),
  policy_version text not null,
  request_ip inet,
  user_agent text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  primary_contact_id uuid references public.profiles(id),
  status text not null default 'trial_pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'collaborator' check (member_role in ('primary_contact', 'collaborator', 'tester', 'billing_contact')),
  can_direct_work boolean not null default false,
  can_test boolean not null default true,
  can_approve boolean not null default false,
  can_view_billing boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.trials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  status text not null default 'trial_pending' check (status in ('trial_pending', 'trial_active', 'trial_complete', 'declined')),
  requested_at timestamptz not null default now(),
  activated_at timestamptz,
  expires_at timestamptz,
  completed_at timestamptz,
  approved_by uuid references public.profiles(id),
  notes text
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null check (plan in ('weekly', 'monthly')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'payment_required' check (status in ('payment_required', 'weekly_active', 'monthly_active', 'past_due', 'cancellation_notice', 'active_until_cancellation', 'canceled', 'suspended')),
  started_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancellation_requested_at timestamptz,
  cancellation_effective_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  problem text,
  desired_outcome text,
  success_definition text,
  systems_involved text,
  constraints text,
  status text not null default 'discovery',
  priority text not null default 'normal',
  position text not null default 'queued' check (position in ('active', 'queued', 'completed', 'archived')),
  next_action text,
  latest_summary text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index one_active_workspace_per_organization on public.workspaces (organization_id) where position = 'active';

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (length(body) between 1 and 20000),
  message_type text not null default 'normal' check (message_type in ('normal', 'jason_update', 'client_feedback', 'decision', 'action_required', 'testing_request', 'approval_request', 'system')),
  parent_message_id uuid references public.messages(id) on delete set null,
  pinned boolean not null default false,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  note_type text not null default 'general',
  status text not null default 'active',
  pinned boolean not null default false,
  client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  storage_path text unique not null,
  original_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  description text,
  created_at timestamptz not null default now()
);

create table public.testing_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id),
  iteration_name text not null,
  test_environment text,
  expected_result text,
  actual_result text,
  worked text,
  failed text,
  reproducible boolean,
  severity text,
  comments text,
  created_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  approved_by uuid not null references public.profiles(id),
  iteration_name text not null,
  approval_type text not null,
  comments text,
  created_at timestamptz not null default now()
);

create table public.cost_authorizations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  vendor text not null,
  description text not null,
  estimated_amount numeric(12,2) check (estimated_amount >= 0),
  billing_frequency text,
  status text not null default 'requested' check (status in ('requested', 'approved', 'declined', 'revoked')),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.agreements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agreement_version text not null,
  document_path text not null,
  accepted_by uuid not null references public.profiles(id),
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.stripe_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb not null
);

create table public.resend_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now(),
  payload jsonb not null
);

create index organization_members_user_idx on public.organization_members (user_id) where active;
create index workspaces_organization_idx on public.workspaces (organization_id, position);
create index messages_workspace_created_idx on public.messages (workspace_id, created_at desc);
create index notes_workspace_idx on public.notes (workspace_id, created_at desc);
create index activity_events_org_created_idx on public.activity_events (organization_id, created_at desc);
create index intake_requests_created_idx on public.intake_requests (created_at desc);

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger workspaces_updated_at before update on public.workspaces for each row execute function public.set_updated_at();
create trigger notes_updated_at before update on public.notes for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.organization_members
    where organization_id = target_org and user_id = (select auth.uid()) and active
  );
$$;

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workspaces w
    where w.id = target_workspace and public.is_org_member(w.organization_id)
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_workspace_member(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;

alter table public.intake_requests enable row level security;
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.trials enable row level security;
alter table public.subscriptions enable row level security;
alter table public.workspaces enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;
alter table public.notes enable row level security;
alter table public.files enable row level security;
alter table public.testing_reports enable row level security;
alter table public.approvals enable row level security;
alter table public.cost_authorizations enable row level security;
alter table public.agreements enable row level security;
alter table public.activity_events enable row level security;
alter table public.stripe_events enable row level security;
alter table public.resend_events enable row level security;

create policy "profiles_read_self_or_admin" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "organizations_read_members" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "members_read_same_org" on public.organization_members for select to authenticated using (public.is_org_member(organization_id));
create policy "trials_read_members" on public.trials for select to authenticated using (public.is_org_member(organization_id));
create policy "subscriptions_read_members" on public.subscriptions for select to authenticated using (public.is_org_member(organization_id));
create policy "workspaces_read_members" on public.workspaces for select to authenticated using (public.is_org_member(organization_id));
create policy "messages_read_members" on public.messages for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "messages_insert_self" on public.messages for insert to authenticated with check (sender_id = (select auth.uid()) and public.is_workspace_member(workspace_id));
create policy "reads_read_self" on public.message_reads for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "reads_insert_self" on public.message_reads for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.messages m where m.id = message_id and public.is_workspace_member(m.workspace_id)));
create policy "notes_read_visible" on public.notes for select to authenticated using (public.is_workspace_member(workspace_id) and (client_visible or public.is_admin()));
create policy "files_read_members" on public.files for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "files_insert_self" on public.files for insert to authenticated with check (uploaded_by = (select auth.uid()) and public.is_workspace_member(workspace_id));
create policy "testing_read_members" on public.testing_reports for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "testing_insert_self" on public.testing_reports for insert to authenticated with check (submitted_by = (select auth.uid()) and public.is_workspace_member(workspace_id));
create policy "approvals_read_members" on public.approvals for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "approvals_insert_self" on public.approvals for insert to authenticated with check (approved_by = (select auth.uid()) and public.is_workspace_member(workspace_id));
create policy "costs_read_members" on public.cost_authorizations for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "costs_insert_members" on public.cost_authorizations for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy "agreements_read_members" on public.agreements for select to authenticated using (public.is_org_member(organization_id));
create policy "agreements_insert_self" on public.agreements for insert to authenticated with check (accepted_by = (select auth.uid()) and public.is_org_member(organization_id));
create policy "activity_read_members" on public.activity_events for select to authenticated using (public.is_org_member(organization_id));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.organizations, public.organization_members, public.trials, public.subscriptions, public.workspaces, public.messages, public.message_reads, public.notes, public.files, public.testing_reports, public.approvals, public.cost_authorizations, public.agreements, public.activity_events to authenticated;
grant insert on public.messages, public.message_reads, public.files, public.testing_reports, public.approvals, public.cost_authorizations, public.agreements to authenticated;

alter publication supabase_realtime add table public.messages;
