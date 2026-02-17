create or replace function public.purge_my_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.entries
  where user_id = auth.uid();

  -- Future user-owned tables should be cleaned here.
end;
$$;

revoke all on function public.purge_my_data() from public;
grant execute on function public.purge_my_data() to authenticated;
