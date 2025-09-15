-- Create storage buckets for songs and images
-- Run this SQL in your Supabase SQL Editor

-- Create songs bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'songs',
    'songs',
    true,
    52428800, -- 50MB in bytes
    ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/flac']
);

-- Create images bucket  
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images', 
    true,
    10485760, -- 10MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for songs bucket
CREATE POLICY "Anyone can view songs" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Authenticated users can upload songs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'songs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own songs" ON storage.objects
    FOR UPDATE USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own songs" ON storage.objects
    FOR DELETE USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for images bucket
CREATE POLICY "Anyone can view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
