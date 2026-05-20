-- Run this in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/cuncviuhohswqgkaijbi/sql

create table if not exists custom_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_name text not null default 'Default 8-week plan',
  week_index int not null default -1,
  day_index int not null default -1,
  title text not null,
  type text not null default 'other',
  distance text,
  duration text,
  notes text,
  done boolean not null default false,
  date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table custom_workouts enable row level security;

create policy "Users can manage their own custom workouts"
  on custom_workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists custom_workouts_user_plan
  on custom_workouts (user_id, plan_name, week_index, day_index);
