-- ─── ScaleWithMike — Schéma Supabase ─────────────────────────────────────────
-- Colle ce SQL dans l'éditeur SQL de Supabase (Database > SQL Editor)

create table if not exists leads (
  id            text primary key default gen_random_uuid()::text,
  prenom        text not null,
  nom           text not null default '',
  email         text not null default '',
  telephone     text not null default '',
  entreprise    text not null default '',
  secteur       text not null default 'BTP',
  source        text not null default 'Manuel',
  status        text not null default 'nouveau',
  "agentId"     text not null default 'agent-1',
  "scoreIA"     numeric(4,1) not null default 5.0,
  "caPotentiel" integer not null default 0,
  "dateEntree"  date not null default current_date,
  "derniereAction" date not null default current_date,
  notes         text not null default '',
  historique    jsonb not null default '[]'::jsonb,
  created_at    timestamptz default now()
);

-- Activer le Row Level Security (RLS) — accès public en lecture/écriture pour l'instant
alter table leads enable row level security;

create policy "Allow all" on leads for all using (true) with check (true);

-- Index pour les recherches fréquentes
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_source_idx on leads(source);
create index if not exists leads_created_at_idx on leads(created_at desc);
