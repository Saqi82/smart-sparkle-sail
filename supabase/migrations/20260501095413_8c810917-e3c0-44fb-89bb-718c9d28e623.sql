-- Create a public storage bucket for user-uploaded study documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-documents',
  'user-documents',
  true,
  20971520, -- 20 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow anyone (including anonymous visitors) to upload to the bucket and read files.
-- The tools are public, no login required.
CREATE POLICY "Public can upload study documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'user-documents');

CREATE POLICY "Public can read study documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-documents');
