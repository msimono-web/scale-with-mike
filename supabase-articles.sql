-- ─── Articles SEO — Schéma Supabase ──────────────────────────────────────────
-- Colle ce SQL dans l'éditeur SQL de Supabase (Database > SQL Editor)

create table if not exists articles (
  id              text primary key default gen_random_uuid()::text,
  titre           text not null,
  slug            text not null unique,
  cluster         text not null default 'Prospection',
  secteur         text not null default 'Général',
  status          text not null default 'brouillon',

  -- Contenu
  meta_description text not null default '',
  extrait          text not null default '',
  contenu          text not null default '',
  mots             integer not null default 0,

  -- Scores (0-10)
  score_global     numeric(3,1) not null default 0.0,
  score_seo        numeric(3,1) not null default 0.0,
  score_unicite    numeric(3,1) not null default 0.0,
  score_specificite numeric(3,1) not null default 0.0,
  score_voix       numeric(3,1) not null default 0.0,
  score_actionabilite numeric(3,1) not null default 0.0,

  -- Stats de performance
  vues             integer not null default 0,
  clics_cta        integer not null default 0,
  leads_generes    integer not null default 0,
  taux_conversion  numeric(5,2) not null default 0.00,
  temps_lecture_moy numeric(5,1) not null default 0.0,
  taux_rebond      numeric(5,2) not null default 0.00,

  -- Mots-clés ciblés
  keywords         jsonb not null default '[]'::jsonb,

  -- Auto-generation metadata
  generated_from   text,  -- id de l'article parent si auto-généré
  generation_prompt text,

  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table articles enable row level security;
create policy "Allow all articles" on articles for all using (true) with check (true);

create index if not exists articles_status_idx on articles(status);
create index if not exists articles_cluster_idx on articles(cluster);
create index if not exists articles_secteur_idx on articles(secteur);
create index if not exists articles_score_idx on articles(score_global desc);
create index if not exists articles_leads_idx on articles(leads_generes desc);
create index if not exists articles_created_idx on articles(created_at desc);
