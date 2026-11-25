-- Kanaka Sweets & Bakery - database lock-down (Rule F5)
--
-- The Next.js app talks to the database ONLY from the server, through Prisma,
-- connecting as the owner role (postgres). The browser never talks to the
-- database, so the public Supabase roles (anon, authenticated) must be able to
-- read and change NOTHING.
--
-- Two layers, both safe to run again and again (idempotent):
--   1. Row Level Security ON for every table, with NO policies = no rows are
--      visible or writable to anyone except the owner role.
--   2. Take away the table privileges from anon / authenticated entirely
--      (only if those roles exist, i.e. on Supabase), so they get
--      "permission denied" even before RLS is checked.
--
-- Run:  pnpm exec prisma db execute --file prisma/rls.sql --schema prisma/schema.prisma
-- Check: pnpm check:rls
-- IMPORTANT: when you add a new table in schema.prisma, add it to the list below.

-- 1. Row Level Security on every table, no public policies
ALTER TABLE IF EXISTS "categories"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "products"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "orders"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "order_items"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "site_settings"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "users"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "sessions"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "accounts"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "verifications"    ENABLE ROW LEVEL SECURITY;

-- 2. No table privileges for the public Supabase roles
DO $$
DECLARE
  public_role text;
BEGIN
  FOREACH public_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = public_role) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', public_role);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', public_role);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', public_role);
      -- Tables created later should not be open to them either.
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', public_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', public_role);
    END IF;
  END LOOP;
END $$;
