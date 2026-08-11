alter table public.service_sows
  drop constraint if exists service_sows_plan_check;

alter table public.service_sows
  add constraint service_sows_plan_check
  check (plan in ('first-week', 'weekly', 'monthly'));

comment on table public.service_sows is
  'Server-only, versioned bilateral statements of work for paid first-week, weekly, and monthly consulting plans.';
