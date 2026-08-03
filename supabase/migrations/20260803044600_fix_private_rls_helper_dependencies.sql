-- Moving SQL functions between schemas does not rewrite schema-qualified names
-- inside their function bodies. Restore the private helper call chain used by
-- client-facing RLS policies while keeping every lookup security-definer and
-- inaccessible to anonymous users.

create or replace function private.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1
    from public.organization_members
    where organization_id = target_org
      and user_id = (select auth.uid())
      and active
  );
$$;

create or replace function private.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspaces w
    where w.id = target_workspace
      and private.is_org_member(w.organization_id)
  );
$$;

revoke all on function private.is_org_member(uuid) from public, anon;
revoke all on function private.is_workspace_member(uuid) from public, anon;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.is_workspace_member(uuid) to authenticated;
