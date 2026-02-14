create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.entries enable row level security;

create policy "Entries are readable by owner"
on public.entries
for select
using (auth.uid() = user_id);

create policy "Entries are insertable by owner"
on public.entries
for insert
with check (auth.uid() = user_id);

create policy "Entries are updatable by owner"
on public.entries
for update
using (auth.uid() = user_id);

create policy "Entries are deletable by owner"
on public.entries
for delete
using (auth.uid() = user_id);
