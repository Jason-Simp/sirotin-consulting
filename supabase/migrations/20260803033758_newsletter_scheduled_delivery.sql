alter table public.newsletter_deliveries
  drop constraint newsletter_deliveries_status_check;

alter table public.newsletter_deliveries
  add constraint newsletter_deliveries_status_check
  check (status in ('accepted', 'scheduled', 'sent', 'delivered', 'failed', 'bounced', 'complained', 'canceled'));

alter table public.newsletter_deliveries
  add column scheduled_for timestamptz;

create index newsletter_deliveries_pending_idx
  on public.newsletter_deliveries (subscriber_id, scheduled_for)
  where status = 'scheduled';

comment on column public.newsletter_deliveries.scheduled_for is
  'Resend delivery time for future lessons scheduled when the subscriber opts in.';
