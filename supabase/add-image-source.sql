-- Add image_source column to watches table
ALTER TABLE watches ADD COLUMN IF NOT EXISTS image_source TEXT;

-- Create storage bucket for watch images
INSERT INTO storage.buckets (id, name, public)
VALUES ('watch-images', 'watch-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to watch images
CREATE POLICY "Public read watch images" ON storage.objects
FOR SELECT USING (bucket_id = 'watch-images');

-- Allow authenticated uploads (service role bypasses RLS anyway)
CREATE POLICY "Allow uploads to watch images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'watch-images');

CREATE POLICY "Allow updates to watch images" ON storage.objects
FOR UPDATE USING (bucket_id = 'watch-images');

CREATE POLICY "Allow deletes from watch images" ON storage.objects
FOR DELETE USING (bucket_id = 'watch-images');
