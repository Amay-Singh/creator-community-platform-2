-- ============================================
-- Creator Community Platform — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  username text unique not null,
  avatar_url text,
  bio text,
  skills text[] default '{}',
  location text,
  external_links jsonb,
  health_score integer default 0 check (health_score >= 0 and health_score <= 100),
  is_premium boolean default false,
  language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- CONVERSATIONS
-- ============================================
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  name text,
  is_group boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.conversation_members (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz default now(),
  unique(conversation_id, user_id)
);

-- ============================================
-- MESSAGES
-- ============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete set null not null,
  text text not null,
  attachment_url text,
  attachment_name text,
  attachment_type text,
  attachment_size text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_messages_conversation on public.messages(conversation_id, created_at desc);

create table public.message_reactions (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(message_id, user_id, emoji)
);

create table public.message_read_receipts (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  read_at timestamptz default now(),
  unique(message_id, user_id)
);

-- ============================================
-- COLLABORATIONS
-- ============================================
create table public.collaborations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  category text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.collaboration_members (
  id uuid default uuid_generate_v4() primary key,
  collaboration_id uuid references public.collaborations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  status text default 'pending' check (status in ('pending', 'accepted', 'declined')),
  joined_at timestamptz default now(),
  unique(collaboration_id, user_id)
);

-- ============================================
-- MILESTONES
-- ============================================
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  collaboration_id uuid references public.collaborations(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  due_date date,
  created_at timestamptz default now()
);

-- ============================================
-- FILES
-- ============================================
create table public.files (
  id uuid default uuid_generate_v4() primary key,
  collaboration_id uuid references public.collaborations(id) on delete set null,
  uploaded_by uuid references public.profiles(id) on delete set null not null,
  name text not null,
  storage_path text not null,
  size_bytes bigint not null default 0,
  mime_type text not null default 'application/octet-stream',
  version integer default 1,
  created_at timestamptz default now()
);

-- ============================================
-- MEETINGS
-- ============================================
create table public.meetings (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  created_by uuid references public.profiles(id) on delete set null not null,
  conversation_id uuid references public.conversations(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes integer default 30,
  meeting_link text not null,
  status text default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- ============================================
-- REVIEWS
-- ============================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewee_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  helpful_count integer default 0,
  created_at timestamptz default now(),
  unique(reviewer_id, reviewee_id)
);

-- ============================================
-- AI GENERATIONS
-- ============================================
create table public.ai_generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_type text not null,
  prompt text not null,
  output text not null,
  tone text,
  audience text,
  word_count integer,
  quality_score integer,
  user_rating integer check (user_rating is null or (user_rating >= 1 and user_rating <= 5)),
  created_at timestamptz default now()
);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  plan text default 'free' check (plan in ('free', 'premium', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'active' check (status in ('active', 'cancelled', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.message_read_receipts enable row level security;
alter table public.collaborations enable row level security;
alter table public.collaboration_members enable row level security;
alter table public.milestones enable row level security;
alter table public.files enable row level security;
alter table public.meetings enable row level security;
alter table public.reviews enable row level security;
alter table public.ai_generations enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: anyone can read, users can update their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Conversations: members only
create policy "Members can view conversations" on public.conversations
  for select using (
    id in (select conversation_id from public.conversation_members where user_id = auth.uid())
  );
create policy "Authenticated users can create conversations" on public.conversations
  for insert with check (auth.uid() = created_by);

-- Conversation members: members can view
create policy "Members can view membership" on public.conversation_members
  for select using (
    conversation_id in (select conversation_id from public.conversation_members where user_id = auth.uid())
  );
create policy "Admins can add members" on public.conversation_members
  for insert with check (auth.uid() is not null);

-- Messages: conversation members only
create policy "Members can view messages" on public.messages
  for select using (
    conversation_id in (select conversation_id from public.conversation_members where user_id = auth.uid())
  );
create policy "Members can send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

-- Reactions
create policy "Members can view reactions" on public.message_reactions
  for select using (true);
create policy "Users can react" on public.message_reactions
  for insert with check (auth.uid() = user_id);
create policy "Users can remove own reactions" on public.message_reactions
  for delete using (auth.uid() = user_id);

-- Read receipts
create policy "Members can view read receipts" on public.message_read_receipts
  for select using (true);
create policy "Users can mark as read" on public.message_read_receipts
  for insert with check (auth.uid() = user_id);

-- Collaborations: public read, owner/member write
create policy "Collaborations are viewable" on public.collaborations for select using (true);
create policy "Owners can create" on public.collaborations for insert with check (auth.uid() = owner_id);
create policy "Owners can update" on public.collaborations for update using (auth.uid() = owner_id);

-- Collaboration members
create policy "Members viewable" on public.collaboration_members for select using (true);
create policy "Owners can add members" on public.collaboration_members
  for insert with check (auth.uid() is not null);
create policy "Users can update own membership" on public.collaboration_members
  for update using (auth.uid() = user_id);

-- Milestones
create policy "Milestones viewable" on public.milestones for select using (true);
create policy "Members can create milestones" on public.milestones
  for insert with check (auth.uid() is not null);
create policy "Members can update milestones" on public.milestones
  for update using (auth.uid() is not null);

-- Files
create policy "Files viewable" on public.files for select using (true);
create policy "Users can upload" on public.files for insert with check (auth.uid() = uploaded_by);

-- Meetings
create policy "Meetings viewable by members" on public.meetings for select using (true);
create policy "Users can create meetings" on public.meetings for insert with check (auth.uid() = created_by);

-- Reviews
create policy "Reviews viewable" on public.reviews for select using (true);
create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);
create policy "Users can update own reviews" on public.reviews for update using (auth.uid() = reviewer_id);

-- AI Generations: private to user
create policy "Users can view own generations" on public.ai_generations for select using (auth.uid() = user_id);
create policy "Users can create generations" on public.ai_generations for insert with check (auth.uid() = user_id);
create policy "Users can update own generations" on public.ai_generations for update using (auth.uid() = user_id);

-- Subscriptions: private to user
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================
-- REALTIME (enable for messaging + presence)
-- ============================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversation_members;
alter publication supabase_realtime add table public.message_reactions;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);
insert into storage.buckets (id, name, public) values ('collaboration-files', 'collaboration-files', false);

-- Storage policies
create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Portfolio files are publicly accessible" on storage.objects
  for select using (bucket_id = 'portfolio');
create policy "Users can upload to own portfolio" on storage.objects
  for insert with check (bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Collab files accessible to authenticated" on storage.objects
  for select using (bucket_id = 'collaboration-files' and auth.role() = 'authenticated');
create policy "Authenticated users can upload collab files" on storage.objects
  for insert with check (bucket_id = 'collaboration-files' and auth.role() = 'authenticated');
