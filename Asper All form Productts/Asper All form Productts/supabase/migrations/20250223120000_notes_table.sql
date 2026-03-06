-- Notes table (Supabase quickstart)
create table public.notes (
  id bigint primary key generated always as identity,
  title text not null
);

insert into public.notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from the app.'),
  ('It was awesome!');

alter table public.notes enable row level security;

create policy "public can read notes"
  on public.notes
  for select
  to anon
  using (true);
