create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  full_name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced', 'complained')),
  source text not null default 'news_page',
  consent_version text not null,
  current_step integer not null default 0 check (current_step between 0 and 5),
  next_send_at timestamptz,
  last_sent_at timestamptz,
  unsubscribe_token_hash text unique check (unsubscribe_token_hash is null or length(unsubscribe_token_hash) = 64),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  campaign_step integer not null check (campaign_step between 1 and 5),
  resend_email_id text,
  subject text not null,
  status text not null check (status in ('accepted', 'failed')),
  error_code text,
  sent_at timestamptz not null default now(),
  unique (subscriber_id, campaign_step)
);

create index newsletter_subscribers_due_idx
  on public.newsletter_subscribers (next_send_at)
  where status = 'active' and current_step < 5;

create index newsletter_deliveries_subscriber_idx
  on public.newsletter_deliveries (subscriber_id, sent_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_subscribers force row level security;
alter table public.newsletter_deliveries enable row level security;
alter table public.newsletter_deliveries force row level security;

revoke all on public.newsletter_subscribers, public.newsletter_deliveries from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_subscribers, public.newsletter_deliveries to service_role;

create policy "newsletter subscribers service role only"
on public.newsletter_subscribers for all to service_role
using (true) with check (true);

create policy "newsletter deliveries service role only"
on public.newsletter_deliveries for all to service_role
using (true) with check (true);

create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function private.set_updated_at();

comment on table public.newsletter_subscribers is
  'Server-only consent and scheduling records for the five-message AI Automation Basics email sequence.';

comment on table public.newsletter_deliveries is
  'Server-only Resend acceptance evidence for each educational drip message.';
