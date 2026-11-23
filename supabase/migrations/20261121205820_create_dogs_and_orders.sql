/*
# Create dogs and orders tables for a dog-selling platform

1. New Tables
- `dogs`: catalog of dogs available for sale or reservation
  - `id` (uuid, primary key)
  - `name` (text, not null) — dog's name
  - `breed` (text, not null) — e.g. Boebull, Labrador, Malinois
  - `description` (text) — long description
  - `price` (numeric, not null) — sale price in XOF
  - `age_months` (integer, not null, default 0) — age in months
  - `gender` (text, not null, default 'male') — 'male' or 'female'
  - `color` (text) — coat color
  - `vaccinated` (boolean, default false)
  - `status` (text, not null, default 'available') — 'available' | 'reserved' | 'sold'
  - `image_url` (text) — main photo of the dog
  - `created_at` (timestamp)
- `orders`: reservations or purchases made by visitors
  - `id` (uuid, primary key)
  - `dog_id` (uuid, foreign key to dogs)
  - `dog_name` (text, not null) — snapshot of dog name at order time
  - `customer_name` (text, not null)
  - `customer_email` (text, not null)
  - `customer_phone` (text, not null)
  - `type` (text, not null, default 'purchase') — 'purchase' | 'reservation'
  - `message` (text) — optional note from the customer
  - `status` (text, not null, default 'pending') — 'pending' | 'confirmed' | 'cancelled'
  - `created_at` (timestamp)

2. Security
- Enable RLS on both tables.
- Grant SELECT/INSERT to `anon` and `authenticated` (public catalog + public order form).
- Public can read available dogs and create orders, but never modify or delete them.
- Admin (write/update/delete) operations go through a future admin role or service role.
*/

CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  breed text NOT NULL,
  description text,
  price numeric(12, 2) NOT NULL,
  age_months integer NOT NULL DEFAULT 0,
  gender text NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  color text,
  vaccinated boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE SET NULL,
  dog_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  type text NOT NULL DEFAULT 'purchase' CHECK (type IN ('purchase', 'reservation')),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dogs_status ON dogs (status);
CREATE INDEX IF NOT EXISTS idx_dogs_breed ON dogs (breed);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON dogs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view dogs" ON dogs;
CREATE POLICY "Public can view dogs"
ON dogs FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admin can insert dogs" ON dogs;
CREATE POLICY "Admin can insert dogs"
ON dogs FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update dogs" ON dogs;
CREATE POLICY "Admin can update dogs"
ON dogs FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete dogs" ON dogs;
CREATE POLICY "Admin can delete dogs"
ON dogs FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view orders" ON orders;
CREATE POLICY "Admin can view orders"
ON orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admin can update orders" ON orders;
CREATE POLICY "Admin can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete orders" ON orders;
CREATE POLICY "Admin can delete orders"
ON orders FOR DELETE
TO authenticated
USING (true);