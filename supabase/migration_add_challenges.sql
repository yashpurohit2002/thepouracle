-- Migration: add challenges table
-- Run this in Supabase SQL Editor

create table if not exists challenges (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references sessions(id) on delete cascade,
  from_player_id   uuid not null references session_players(id) on delete cascade,
  from_player_name text not null,
  to_player_id     uuid not null references session_players(id) on delete cascade,
  to_player_name   text not null,
  challenge_key    text not null,
  status           text not null default 'pending',  -- pending | accepted | completed | declined | expired | forfeited
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null,
  responded_at     timestamptz,
  completed_at     timestamptz
);

create index if not exists challenges_session_id_idx on challenges (session_id);
create index if not exists challenges_to_player_idx  on challenges (to_player_id, status);

alter table challenges enable row level security;
create policy "challenges_select" on challenges for select using (true);
create policy "challenges_insert" on challenges for insert with check (true);
create policy "challenges_update" on challenges for update using (true);

-- Add to realtime publication
-- alter publication supabase_realtime add table challenges;
