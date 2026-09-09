create table public.invoice_accounts (
  slug text primary key check (slug ~ '^[a-z0-9-]{3,64}$'),
  client_name text not null,
  billing_emails text[] not null check (cardinality(billing_emails) between 1 and 10),
  cc_emails text[] not null default '{}',
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd' check (currency = 'usd'),
  service_description text not null,
  seller_name text not null,
  seller_address_lines text[] not null,
  send_day smallint not null check (send_day between 1 and 28),
  due_day smallint not null check (due_day between 1 and 28 and due_day >= send_day),
  timezone text not null default 'America/New_York',
  invoice_prefix text not null check (invoice_prefix ~ '^[A-Z0-9-]{2,20}$'),
  payment_instructions text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoice_records (
  id uuid primary key default gen_random_uuid(),
  client_slug text not null references public.invoice_accounts(slug) on update cascade,
  period_month date not null check (period_month = date_trunc('month', period_month)::date),
  invoice_number text not null unique,
  issue_date date not null,
  due_date date not null check (due_date >= issue_date),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd' check (currency = 'usd'),
  service_description text not null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'paid', 'void')),
  sent_at timestamptz,
  paid_at timestamptz,
  reminder_count integer not null default 0 check (reminder_count >= 0),
  reminder_sending boolean not null default false,
  last_reminder_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_slug, period_month)
);

create table public.invoice_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoice_records(id) on delete cascade,
  delivery_kind text not null check (delivery_kind in ('invoice', 'reminder')),
  resend_email_id text unique,
  delivery_status text not null default 'accepted' check (delivery_status in ('accepted', 'sent', 'delivered', 'failed', 'bounced', 'complained')),
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index invoice_records_status_due_idx on public.invoice_records (status, due_date);
create index invoice_deliveries_invoice_idx on public.invoice_email_deliveries (invoice_id, sent_at desc);

create trigger invoice_accounts_updated_at before update on public.invoice_accounts
for each row execute function public.set_updated_at();
create trigger invoice_records_updated_at before update on public.invoice_records
for each row execute function public.set_updated_at();

alter table public.invoice_accounts enable row level security;
alter table public.invoice_records enable row level security;
alter table public.invoice_email_deliveries enable row level security;

revoke all on table public.invoice_accounts, public.invoice_records, public.invoice_email_deliveries from public, anon, authenticated;
grant select, insert, update, delete on table public.invoice_accounts, public.invoice_records, public.invoice_email_deliveries to service_role;

create policy "service role manages invoice accounts"
on public.invoice_accounts for all to service_role using (true) with check (true);
create policy "service role manages invoice records"
on public.invoice_records for all to service_role using (true) with check (true);
create policy "service role manages invoice deliveries"
on public.invoice_email_deliveries for all to service_role using (true) with check (true);

comment on table public.invoice_accounts is 'Server-only recurring bank-transfer invoice instructions.';
comment on table public.invoice_records is 'Server-only monthly invoice ledger with duplicate-send protection.';
comment on table public.invoice_email_deliveries is 'Server-only Resend delivery evidence for invoices and reminders.';
