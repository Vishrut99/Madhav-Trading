/*
# Create orders table for New Madhav Trading

1. New Tables
- `orders`
  - `id` BIGSERIAL PRIMARY KEY — displayed as Order #25 in UI
  - `customer_name` TEXT NOT NULL
  - `customer_phone` TEXT NOT NULL — stored as 10 digits, no prefix
  - `customer_email` TEXT — nullable, optional
  - `order_text` TEXT — nullable (typed order)
  - `photo_path` TEXT — nullable (Supabase Storage path)
  - `note` TEXT — nullable
  - `status` ENUM('pending','ready','archived') NOT NULL DEFAULT 'pending'
  - `created_at` TIMESTAMPTZ DEFAULT now()
  - `updated_at` TIMESTAMPTZ DEFAULT now()

2. Indexes
- `idx_orders_status` on `status` for tab filtering
- `idx_orders_phone` on `customer_phone` for history lookups
- `idx_orders_created_at` on `created_at DESC` for newest-first ordering

3. Trigger
- `trg_orders_set_updated_at` — auto-updates `updated_at` on row update

4. Security
- RLS enabled on `orders`.
- Anon + authenticated CRUD allowed: all data access is mediated by API routes
  using the service role key (which bypasses RLS). The anon policies exist so
  the table is not accidentally locked out if the anon key is ever used directly.
*/

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_text TEXT,
  photo_path TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','ready','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_set_updated_at ON orders;
CREATE TRIGGER trg_orders_set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
