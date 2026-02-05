-- Create table for JEE Main scores
create table if not exists jee_main_scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  mobile text,
  email text,
  city text,
  url text,
  candidate_name_from_sheet text,
  paper_id text,
  total_score numeric,
  correct integer,
  incorrect integer,
  unattempted integer,
  physics_score numeric,
  chemistry_score numeric,
  mathematics_score numeric,
  details jsonb
);

-- Enable Row Level Security (RLS)
alter table jee_main_scores enable row level security;

-- Create policy to allow inserting data (public access for this use case as per other calculators likely)
create policy "Enable insert for all users" on jee_main_scores for insert with check (true);

-- Create policy to allow select for service role only (or authenticated users if needed, but usually analytics are private)
-- For now, maybe just allow select for anon if they need to fetch their own score? 
-- But usually these calculators just return the score in the response and save it for admin.
-- We'll just enable insert for public.
