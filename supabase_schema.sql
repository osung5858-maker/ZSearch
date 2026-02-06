-- Create public_services table
create table public_services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  address text,
  lat float,
  lng float,
  phone text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public_services enable row level security;

-- Create a policy that allows anyone to read
create policy "Public services are viewable by everyone"
  on public_services for select
  using ( true );

-- Create a policy that allows authenticated users to insert (optional, depending on requirements)
-- create policy "Users can insert public services"
--   on public_services for insert
--   with check ( auth.role() = 'authenticated' );
