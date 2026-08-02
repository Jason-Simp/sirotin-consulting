create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.guaranteed_engagements (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  customer_email text not null,
  customer_name text,
  company_name text,
  status text not null default 'paid_pending_activation' check (status in (
    'paid_pending_activation', 'active', 'monthly_selected', 'refund_requested', 'refunded', 'paused'
  )),
  paid_at timestamptz not null default now(),
  activated_at timestamptz,
  guarantee_ends_at timestamptz,
  decision_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guarantee_decisions (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.guaranteed_engagements(id) on delete cascade,
  decision text not null check (decision in ('continue_monthly', 'request_refund')),
  customer_email text not null,
  request_ip inet,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (engagement_id)
);

create table public.agent_action_audit (
  id uuid primary key default gen_random_uuid(),
  conversation_id text,
  action text not null,
  status text not null check (status in ('requested', 'completed', 'rejected', 'failed')),
  request_data jsonb not null default '{}'::jsonb,
  response_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index guaranteed_engagements_email_idx on public.guaranteed_engagements (lower(customer_email));
create index agent_action_audit_created_idx on public.agent_action_audit (created_at desc);

create trigger guaranteed_engagements_updated_at before update on public.guaranteed_engagements
for each row execute function public.set_updated_at();

alter table public.guaranteed_engagements enable row level security;
alter table public.guarantee_decisions enable row level security;
alter table public.agent_action_audit enable row level security;

revoke all on public.guaranteed_engagements, public.guarantee_decisions, public.agent_action_audit from anon, authenticated;
