
-- Enums
create type public.event_visibility as enum ('public','unlisted');
create type public.event_status as enum ('draft','published');

-- Host profiles (one per user)
create table public.host_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  name text not null,
  slug text not null unique,
  logo_url text,
  bio text,
  contact_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.host_profiles(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  time_zone text not null default 'UTC',
  is_online boolean not null default false,
  location text,
  online_url text,
  capacity integer,
  cover_image_url text,
  visibility public.event_visibility not null default 'public',
  status public.event_status not null default 'draft',
  is_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_host_idx on public.events(host_id);
create index events_status_idx on public.events(status, visibility, start_at);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger host_profiles_updated before update on public.host_profiles
for each row execute function public.set_updated_at();
create trigger events_updated before update on public.events
for each row execute function public.set_updated_at();

-- RLS
alter table public.host_profiles enable row level security;
alter table public.events enable row level security;

-- host_profiles policies
create policy "Host profiles are viewable by everyone"
  on public.host_profiles for select using (true);
create policy "Users can insert own host profile"
  on public.host_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own host profile"
  on public.host_profiles for update using (auth.uid() = user_id);
create policy "Users can delete own host profile"
  on public.host_profiles for delete using (auth.uid() = user_id);

-- events policies
create policy "Published events are viewable by everyone"
  on public.events for select using (status = 'published');
create policy "Hosts can view own events"
  on public.events for select using (
    exists (select 1 from public.host_profiles hp where hp.id = events.host_id and hp.user_id = auth.uid())
  );
create policy "Hosts can insert own events"
  on public.events for insert with check (
    exists (select 1 from public.host_profiles hp where hp.id = events.host_id and hp.user_id = auth.uid())
  );
create policy "Hosts can update own events"
  on public.events for update using (
    exists (select 1 from public.host_profiles hp where hp.id = events.host_id and hp.user_id = auth.uid())
  );
create policy "Hosts can delete own events"
  on public.events for delete using (
    exists (select 1 from public.host_profiles hp where hp.id = events.host_id and hp.user_id = auth.uid())
  );
