-- Kanaka Sweets & Bakery - Row Level Security (RLS) Setup (Rule F5)
-- Enable Row Level Security on every table with NO public policies.
-- The Next.js app connects only from the server via Prisma, so the Supabase anon/public key reads nothing.

ALTER TABLE IF EXISTS "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "site_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "verifications" ENABLE ROW LEVEL SECURITY;
