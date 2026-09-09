-- Use the verified Render service origin for machine-to-machine scheduling.
-- The public domain remains canonical for customer-facing pages and links, but
-- billing delivery should not depend on the apex DNS edge being reachable.
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
    url := 'https://sirotin-consulting.onrender.com/api/internal/invoices/run',
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
