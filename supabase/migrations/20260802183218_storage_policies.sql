insert into storage.buckets (id, name, public, file_size_limit)
values ('client-files', 'client-files', false, 52428800)
on conflict (id) do nothing;

create policy "client_files_read" on storage.objects for select to authenticated using (
  bucket_id = 'client-files' and public.is_org_member(((storage.foldername(name))[1])::uuid)
);

create policy "client_files_insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'client-files' and public.is_org_member(((storage.foldername(name))[1])::uuid)
);

create policy "client_files_delete_own" on storage.objects for delete to authenticated using (
  bucket_id = 'client-files'
  and owner_id = (select auth.uid()::text)
  and public.is_org_member(((storage.foldername(name))[1])::uuid)
);
