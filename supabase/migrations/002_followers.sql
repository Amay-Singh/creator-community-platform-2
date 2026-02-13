-- ============================================
-- FOLLOWERS table
-- Run this in Supabase SQL Editor after 001
-- ============================================
create table if not exists public.followers (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

alter table public.followers enable row level security;

create policy "Anyone can view followers" on public.followers for select using (true);
create policy "Users can follow" on public.followers for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on public.followers for delete using (auth.uid() = follower_id);
