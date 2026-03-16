-- ============================================================
-- Kumii Admin — Supabase Database Schema
-- Run this against your Supabase project (SQL Editor → New query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── admin_users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  microsoft_oid    TEXT          NOT NULL UNIQUE,
  email            TEXT          NOT NULL,
  display_name     TEXT          NOT NULL,
  role             TEXT          NOT NULL DEFAULT 'executive_view'
                                 CHECK (role IN (
                                   'super_admin','funding_manager',
                                   'investor_relations','impact_analyst',
                                   'compliance_officer','executive_view'
                                 )),
  tenant_id        TEXT,
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  last_login_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role  ON public.admin_users (role);

-- ── audit_logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  admin_email  TEXT,
  action       TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    TEXT,
  metadata     JSONB       DEFAULT '{}',
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id    ON public.audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action      ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs (entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at  ON public.audit_logs (created_at DESC);

-- ── admin_tasks ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_tasks (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT        NOT NULL,
  description       TEXT,
  status            TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','in_progress','completed','cancelled')),
  priority          TEXT        NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('low','medium','high','critical')),
  assigned_to       UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  created_by        UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  due_date          DATE,
  related_entity    TEXT,
  related_entity_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.admin_tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON public.admin_tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date    ON public.admin_tasks (due_date);

-- ── report_exports ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_exports (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id       UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  admin_email    TEXT,
  report_type    TEXT        NOT NULL,
  export_format  TEXT        NOT NULL CHECK (export_format IN ('csv','excel','pdf')),
  row_count      INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_exports_admin_id ON public.report_exports (admin_id);

-- ── system_alerts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT        NOT NULL CHECK (type IN ('info','warning','error','success')),
  title       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by  UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── admin_settings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key          TEXT        PRIMARY KEY,
  value        TEXT        NOT NULL,
  description  TEXT,
  updated_by   UUID        REFERENCES public.admin_users (id) ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed sensible defaults
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('session_idle_timeout_minutes', '15',      'Minutes of inactivity before auto-logout'),
  ('default_page_size',            '25',      'Default number of rows per page'),
  ('allowed_export_formats',       'csv,excel','Comma-separated list of allowed export formats'),
  ('maintenance_mode',             'false',   'Set to true to show maintenance banner')
ON CONFLICT (key) DO NOTHING;

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Backend uses the service role key and bypasses RLS.
-- Enable RLS on all tables as a safety net; the service role is exempt.
ALTER TABLE public.admin_users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings  ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (Supabase default behaviour with service key).
-- If you add anon/authenticated access policies in the future, add them here.

-- ── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_admin_tasks_updated_at
  BEFORE UPDATE ON public.admin_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
