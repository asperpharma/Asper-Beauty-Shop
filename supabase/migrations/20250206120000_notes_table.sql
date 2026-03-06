-- Create the table
create table notes (
  id bigint primary key generated always as identity,
  title text not null
);

-- Insert some sample data into the table
insert into notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

alter table notes enable row level security;

-- Example RLS policies (without these, no rows are visible once RLS is on).
-- Adjust or remove depending on who should read/write notes.

-- Allow authenticated users to read all notes
create policy "Allow authenticated read"
  on notes for select
  to authenticated
  using (true);

-- Allow authenticated users to insert their own (add auth.uid() column if you want per-user notes)
create policy "Allow authenticated insert"
  on notes for insert
  to authenticated
  with check (true);

-- Optional: allow authenticated update/delete; tighten with using (auth.uid() = user_id) if you add a user_id column
-- create policy "Allow authenticated update" on notes for update to authenticated using (true);
-- create policy "Allow authenticated delete" on notes for delete to authenticated using (true);
