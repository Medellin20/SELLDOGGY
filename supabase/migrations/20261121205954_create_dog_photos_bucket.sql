/*
# Create public storage bucket for dog photos

1. Storage
- `dog-photos` bucket: public read (photos display in the storefront), write restricted
  to authenticated users (the admin).

2. Security
- Public SELECT on objects in `dog-photos` so anyone can view the photos.
- INSERT / UPDATE / DELETE on objects restricted `TO authenticated` (admin session required).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('dog-photos', 'dog-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read dog photos" ON storage.objects;
CREATE POLICY "Public read dog photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'dog-photos');

DROP POLICY IF EXISTS "Admin upload dog photos" ON storage.objects;
CREATE POLICY "Admin upload dog photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dog-photos');

DROP POLICY IF EXISTS "Admin update dog photos" ON storage.objects;
CREATE POLICY "Admin update dog photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'dog-photos')
WITH CHECK (bucket_id = 'dog-photos');

DROP POLICY IF EXISTS "Admin delete dog photos" ON storage.objects;
CREATE POLICY "Admin delete dog photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dog-photos');