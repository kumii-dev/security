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
    '59cc86ba-9083-4ac5-ab82-eadc35302575',
    'khulekani@22onsloane.co',
    'Khulekani',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    'b2df32c6-5a9d-413a-8bd6-55829703aaad',
    'sithembiso@22onsloane.co',
    'Sithembiso',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    'd25135bd-94c2-4423-ad96-cc3cfe32ee07',
    'christian@22onsloane.co',
    'Christian',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    '22ac4b69-6b1f-48d1-b529-ea5d40d26d77',
    'mafika@22onsloane.co',
    'Mafika',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    'ff98cff7-2fa2-47aa-a398-419619c17db2',
    'noma@kumii.africa',
    'Noma',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    'b8b7a93f-54ff-462f-bcee-7d398c4626a4',
    'info@kumii.africa',
    'Kumii Info',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  ),

  -- Super Admin
  (
    '698f4f17-c4e0-4f35-b513-3b03459015fe',
    'kizito@22onsloane.co',
    'Kizito',
    'super_admin',
    '7ecb6702-3bbc-4ed1-a666-e203977bab9b',
    true
  )

ON CONFLICT (microsoft_oid) DO UPDATE SET
  role         = EXCLUDED.role,
  email        = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  is_active    = EXCLUDED.is_active;

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT id, email, display_name, role, is_active, last_login_at
FROM public.admin_users
ORDER BY created_at;
