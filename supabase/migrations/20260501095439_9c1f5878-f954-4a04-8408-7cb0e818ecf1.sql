-- Make the bucket private to prevent public listing
UPDATE storage.buckets SET public = false WHERE id = 'user-documents';

-- Drop the broad public SELECT policy. Edge functions use the service role,
-- which bypasses RLS, so they can still fetch files for parsing.
DROP POLICY IF EXISTS "Public can read study documents" ON storage.objects;
