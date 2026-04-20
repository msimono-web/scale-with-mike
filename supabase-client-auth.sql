-- ─── Client Auth (White Label) ───────────────────────────────────────────────
-- À exécuter dans Supabase SQL Editor

-- Table des espaces clients (auth serveur)
CREATE TABLE IF NOT EXISTS client_spaces_auth (
  slug          TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL DEFAULT '',
  allowed_emails TEXT NOT NULL DEFAULT '',   -- emails séparés par virgule
  custom_domain TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table des sessions client
CREATE TABLE IF NOT EXISTS client_sessions (
  token      TEXT PRIMARY KEY,
  slug       TEXT NOT NULL REFERENCES client_spaces_auth(slug) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE client_spaces_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;

-- Accès complet via service_role (pour les API routes server-side)
CREATE POLICY "service_role_client_spaces_auth" ON client_spaces_auth
  FOR ALL USING (true);

CREATE POLICY "service_role_client_sessions" ON client_sessions
  FOR ALL USING (true);

-- Nettoyage automatique des sessions expirées (optionnel)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void LANGUAGE sql AS $$
  DELETE FROM client_sessions WHERE expires_at < NOW();
$$;
