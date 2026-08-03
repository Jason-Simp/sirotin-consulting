create table public.service_sows (
  id uuid primary key default gen_random_uuid(),
  plan text not null check (plan in ('weekly', 'monthly')),
  status text not null default 'client_signed_checkout_pending'
    check (status in ('client_signed_checkout_pending', 'payment_confirmed', 'fully_executed', 'void')),
  sow_version text not null,
  document_hash text not null check (length(document_hash) = 64),
  document_snapshot jsonb not null,
  client_name text not null,
  client_email text not null,
  company_name text not null,
  signer_title text not null,
  client_signature text not null,
  client_signed_at timestamptz not null default now(),
  client_request_key_hash text not null,
  client_user_agent text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  payment_confirmed_at timestamptz,
  jason_signature text,
  jason_signed_at timestamptz,
  jason_request_key_hash text,
  jason_user_agent text,
  jason_signing_token_hash text unique,
  jason_signing_token_expires_at timestamptz,
  client_access_token_hash text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.service_sows is
  'Server-only, versioned bilateral statements of work for paid weekly and monthly consulting plans.';

create index service_sows_client_email_idx on public.service_sows (lower(client_email));
create index service_sows_status_idx on public.service_sows (status, created_at desc);

alter table public.service_sows enable row level security;
alter table public.service_sows force row level security;

revoke all on table public.service_sows from anon, authenticated, public;
grant select, insert, update, delete on table public.service_sows to service_role;

create policy "service role manages service sows"
on public.service_sows
for all
to service_role
using (true)
with check (true);

create trigger service_sows_set_updated_at
before update on public.service_sows
for each row execute function public.set_updated_at();
