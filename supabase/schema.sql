-- =============================================================
-- THE POURACLE — Supabase Schema
-- Run this in your Supabase project's SQL editor
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- SESSIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  room_code   text not null unique,          -- 5-char uppercase, e.g. "NE4P7"
  host_name   text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  ended_at    timestamptz
);

create index if not exists sessions_room_code_idx on sessions (room_code) where is_active = true;

-- ─────────────────────────────────────────────────────────────
-- SESSION PLAYERS
-- ─────────────────────────────────────────────────────────────
create table if not exists session_players (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references sessions (id) on delete cascade,
  display_name text not null,
  is_host      boolean not null default false,
  joined_at    timestamptz not null default now()
);

create index if not exists session_players_session_id_idx on session_players (session_id);

-- ─────────────────────────────────────────────────────────────
-- DRINKS
-- ─────────────────────────────────────────────────────────────
create table if not exists drinks (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions (id) on delete cascade,
  player_id   uuid not null references session_players (id) on delete cascade,
  player_name text not null,             -- denormalized for easy display
  drink_type  text not null,             -- beer | wine | cocktail | shot | hard_seltzer | other
  brand       text,
  notes       text,
  logged_at   timestamptz not null default now()
);

create index if not exists drinks_session_id_idx on drinks (session_id);
create index if not exists drinks_player_id_idx  on drinks (player_id);
create index if not exists drinks_logged_at_idx  on drinks (session_id, logged_at desc);

-- ─────────────────────────────────────────────────────────────
-- ACHIEVEMENTS
-- ─────────────────────────────────────────────────────────────
create table if not exists achievements (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references sessions (id) on delete cascade,
  player_id       uuid not null references session_players (id) on delete cascade,
  player_name     text not null,
  achievement_key text not null,
  earned_at       timestamptz not null default now(),
  -- Prevent duplicate achievements per player per session
  unique (session_id, player_id, achievement_key)
);

create index if not exists achievements_session_id_idx on achievements (session_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Using anon key — room code is the access control mechanism.
-- All tables: anon can read/write everything.
-- ─────────────────────────────────────────────────────────────
alter table sessions         enable row level security;
alter table session_players  enable row level security;
alter table drinks           enable row level security;
alter table achievements     enable row level security;

-- Sessions
create policy "sessions_select" on sessions for select using (true);
create policy "sessions_insert" on sessions for insert with check (true);
create policy "sessions_update" on sessions for update using (true);   -- host ends session

-- Players
create policy "players_select" on session_players for select using (true);
create policy "players_insert" on session_players for insert with check (true);

-- Drinks
create policy "drinks_select" on drinks for select using (true);
create policy "drinks_insert" on drinks for insert with check (true);
create policy "drinks_delete" on drinks for delete using (true);       -- undo within 30s

-- Achievements
create policy "achievements_select" on achievements for select using (true);
create policy "achievements_insert" on achievements for insert with check (true);

-- ─────────────────────────────────────────────────────────────
-- REALTIME
-- Enable realtime publication for live leaderboard + timeline
-- ─────────────────────────────────────────────────────────────
-- Run in Supabase dashboard: Database > Replication > supabase_realtime
-- Add tables: drinks, session_players, achievements
-- OR use the following (requires superuser):
-- alter publication supabase_realtime add table drinks;
-- alter publication supabase_realtime add table session_players;
-- alter publication supabase_realtime add table achievements;

-- ─────────────────────────────────────────────────────────────
-- AUTO-EXPIRE: optional cleanup job (run via pg_cron or a scheduled function)
-- Marks sessions inactive after 24h of no new drinks
-- ─────────────────────────────────────────────────────────────
-- create or replace function expire_stale_sessions()
-- returns void language plpgsql as $$
-- begin
--   update sessions set is_active = false, ended_at = now()
--   where is_active = true
--     and not exists (
--       select 1 from drinks d
--       where d.session_id = sessions.id
--         and d.logged_at > now() - interval '24 hours'
--     )
--     and created_at < now() - interval '24 hours';
-- end;
-- $$;
