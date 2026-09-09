create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

create table public.invoice_scheduler_keys (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.invoice_scheduler_keys enable row level security;
revoke all on table public.invoice_scheduler_keys from public, anon, authenticated;
grant select, insert, update, delete on table public.invoice_scheduler_keys to service_role;
create policy "service role manages invoice scheduler keys"
on public.invoice_scheduler_keys for all to service_role using (true) with check (true);
comment on table public.invoice_scheduler_keys is 'Hashes of active scheduler credentials; raw credentials remain in Supabase Vault.';

create or replace function private.trigger_invoice_scheduler()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  scheduler_secret text;
begin
  select decrypted_secret
  into scheduler_secret
  from vault.decrypted_secrets
  where name = 'automatemejay_invoice_scheduler'
  order by created_at desc
  limit 1;

  if scheduler_secret is null then
    raise exception 'Invoice scheduler secret is not configured';
  end if;

  perform net.http_post(
    url := 'https://automatemejay.com/api/internal/invoices/run',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || scheduler_secret
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 15000
  );
end;
$$;

revoke all on function private.trigger_invoice_scheduler() from public, anon, authenticated, service_role;

do $$
declare
  existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'automatemejay-invoice-run' limit 1;
  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;
  perform cron.schedule(
    'automatemejay-invoice-run',
    '10 13 * * *',
    'select private.trigger_invoice_scheduler();'
  );
end;
$$;
