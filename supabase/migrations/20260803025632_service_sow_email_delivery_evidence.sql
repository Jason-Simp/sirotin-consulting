alter table public.service_sows
  add column jason_signing_email_id text,
  add column jason_signing_email_sent_at timestamptz,
  add column client_copy_email_id text,
  add column client_copy_email_sent_at timestamptz;

comment on column public.service_sows.jason_signing_email_sent_at is
  'Timestamp Resend accepted the private Jason counter-signature email.';

comment on column public.service_sows.client_copy_email_sent_at is
  'Timestamp Resend accepted the executed SOW email sent to the client.';
