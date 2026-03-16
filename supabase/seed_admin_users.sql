-- ============================================================
-- Kumii Admin — Seed Admin Users
-- Run in Supabase SQL Editor after schema.sql
-- Replace the microsoft_oid values with real OIDs from Entra ID
-- ============================================================

-- How to get a user's Microsoft OID:
--   portal.azure.com → Users → click user → Object ID
-- OR it appears in the audit_logs table after they first sign in.

-- ── Insert / update admin users ───────────────────────────────────────────────
INSERT INTO public.admin_users (
  microsoft_oid,
  email,
  display_name,
  role,
  tenant_id,
  is_active
) VALUES

  -- Super Admin — full access
  (
    'REPLACE_WITH_OID',               -- portal.azure.com → Users → Object ID
    'khulekani@22onsloane.co',
    'Khulekani',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Funding Manager — manages startups + applications
  -- (
  --   'REPLACE_WITH_OID',
  --   'funding@22onsloane.co',
  --   'Funding Manager',
  --   'funding_manager',
  --   '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
  --   true
  -- ),

  -- Investor Relations
  -- (
  --   'REPLACE_WITH_OID',
  --   'investors@22onsloane.co',
  --   'Investor Relations',
  --   'investor_relations',
  --   '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
  --   true
  -- ),

  -- Impact Analyst
  -- (
  --   'REPLACE_WITH_OID',
  --   'impact@kumii.africa',
  --   'Impact Analyst',
  --   'impact_analyst',
  --   '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
  --   true
  -- ),

  -- Compliance Officer
  -- (
  --   'REPLACE_WITH_OID',
  --   'compliance@kumii.africa',
  --   'Compliance Officer',
  --   'compliance_officer',
  --   '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
  --   true
  -- ),

  -- Executive View (read-only)
  -- (
  --   'REPLACE_WITH_OID',
  --   'exec@22onsloane.co',
  --   'Executive',
  --   'executive_view',
  --   '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
  --   true
  -- )

  -- Dummy row to close the VALUES block (remove if adding multiple users)
  ('dummy-close', 'dummy@dummy.com', 'dummy', 'executive_view', '7ecb6702-3bbc-4ed1-a666-e203977bab9b', false)

ON CONFLICT (microsoft_oid) DO UPDATE SET
  role        = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  is_active   = EXCLUDED.is_active;

-- Remove the dummy row
DELETE FROM public.admin_users WHERE microsoft_oid = 'dummy-close';

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT id, email, display_name, role, is_active, last_login_at
FROM public.admin_users
ORDER BY created_at;
