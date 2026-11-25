-- Simulates a Supabase "anon" visitor (someone holding only the public key) against
-- our database, to show that Rule F5 holds. Everything runs inside a transaction
-- that is ROLLED BACK at the end, so it leaves nothing behind.
--
-- Run from the project root:
--   psql -h localhost -U postgres -d kanaka -f scripts/rls-anon-simulation.sql
--
-- On Supabase the roles already exist; do the same checks there with the real
-- anon key (see README, "Checking the lock-down").

\set ON_ERROR_STOP off
BEGIN;

-- Create the roles the way Supabase has them, and give them what Supabase
-- grants by default (full access to every table in the public schema).
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

\echo
\echo '=== Layer 1: Row Level Security only (privileges still granted) ==='
SET LOCAL ROLE anon;
SELECT 'orders rows visible to anon:     ' || count(*) AS result FROM orders;
SELECT 'order_items rows visible:        ' || count(*) FROM order_items;
SELECT 'users (admin accounts) visible:  ' || count(*) FROM users;
SELECT 'sessions visible:                ' || count(*) FROM sessions;
SELECT 'products visible to anon:        ' || count(*) FROM products;
\echo 'anon tries to change a product price (expect UPDATE 0):'
UPDATE product_variants SET price = 1;
\echo 'anon tries to delete orders (expect DELETE 0):'
DELETE FROM orders;
SAVEPOINT s_insert;
\echo 'anon tries to insert a product (expect a row-level security error):'
INSERT INTO categories (id, name, slug, description, "updatedAt") VALUES ('x', 'x', 'x', 'x', now());
ROLLBACK TO SAVEPOINT s_insert;
RESET ROLE;

\echo
\echo '=== Layer 2: apply prisma/rls.sql (also revokes the privileges) ==='
\i prisma/rls.sql

SET LOCAL ROLE anon;
SAVEPOINT s_read;
\echo 'anon reads orders (expect: permission denied):'
SELECT count(*) FROM orders;
ROLLBACK TO SAVEPOINT s_read;
SAVEPOINT s_read2;
\echo 'anon reads users (expect: permission denied):'
SELECT count(*) FROM users;
ROLLBACK TO SAVEPOINT s_read2;
SAVEPOINT s_write;
\echo 'anon changes a price (expect: permission denied):'
UPDATE product_variants SET price = 1;
ROLLBACK TO SAVEPOINT s_write;
RESET ROLE;

SET LOCAL ROLE authenticated;
SAVEPOINT s_auth;
\echo 'a logged-in Supabase user ("authenticated") reads orders (expect: permission denied):'
SELECT count(*) FROM orders;
ROLLBACK TO SAVEPOINT s_auth;
RESET ROLE;

\echo
\echo '=== The app itself (owner role) still works ==='
SELECT 'orders the app can read:   ' || count(*) FROM orders;
SELECT 'products the app can read: ' || count(*) FROM products;

ROLLBACK;
\echo
\echo 'Rolled back: no roles or data were changed.'
