alter table public.service_sows
  add column client_authority_confirmed boolean not null default false,
  add column electronic_signature_consent boolean not null default false;
