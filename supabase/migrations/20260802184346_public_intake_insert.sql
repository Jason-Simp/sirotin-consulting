grant insert (
  full_name,
  email,
  company_name,
  job_title,
  phone,
  website,
  process_to_automate,
  current_process,
  desired_result,
  systems_involved,
  sensitive_data,
  policy_version,
  request_ip,
  user_agent
) on public.intake_requests to anon, authenticated;

create policy "intake_public_insert" on public.intake_requests
for insert to anon, authenticated
with check (
  status = 'new'
  and reviewed_at is null
  and reviewed_by is null
);

create or replace function private.limit_intake_rate()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_requests integer;
begin
  select count(*) into recent_requests
  from public.intake_requests
  where lower(email) = lower(new.email)
    and created_at > now() - interval '1 hour';

  if recent_requests >= 3 then
    raise exception 'Too many recent intake requests.' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function private.limit_intake_rate() from public, anon, authenticated;

create trigger intake_rate_limit
before insert on public.intake_requests
for each row execute function private.limit_intake_rate();
