-- Serialize each route/fingerprint bucket inside Postgres so concurrent bursts
-- cannot race between a separate count and insert.
create or replace function public.security_enforce_rate_limit(
  p_request_id text,
  p_route text,
  p_request_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_count integer;
  is_allowed boolean;
begin
  if length(p_request_id) not between 8 and 128
    or length(p_route) not between 3 and 100
    or length(p_request_key_hash) <> 64
    or p_limit not between 1 and 10000
    or p_window_seconds not between 1 and 2592000 then
    raise exception 'Invalid rate limit input.' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_route || '|' || p_request_key_hash, 0)
  );

  select count(*) into recent_count
  from public.security_events
  where route = p_route
    and request_key_hash = p_request_key_hash
    and event_type = 'request.accepted'
    and created_at >= pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds);

  is_allowed := recent_count < p_limit;

  insert into public.security_events (
    request_id,
    event_type,
    route,
    severity,
    request_key_hash,
    metadata
  ) values (
    p_request_id,
    case when is_allowed then 'request.accepted' else 'request.rate_limited' end,
    p_route,
    case when is_allowed then 'info' else 'warning' end,
    p_request_key_hash,
    jsonb_build_object('window_seconds', p_window_seconds, 'limit', p_limit)
  );

  return is_allowed;
end;
$$;

revoke all on function public.security_enforce_rate_limit(text, text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.security_enforce_rate_limit(text, text, text, integer, integer)
  to service_role;
