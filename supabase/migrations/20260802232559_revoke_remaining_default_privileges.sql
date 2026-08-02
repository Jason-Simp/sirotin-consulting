-- Remove the non-Data-API table and sequence privileges that remain after the
-- narrower Supabase production-checklist revocations. New public objects must
-- receive every client/API grant explicitly in their own migration.
alter default privileges for role postgres in schema public
  revoke all privileges on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all privileges on functions from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all privileges on sequences from anon, authenticated, service_role;
