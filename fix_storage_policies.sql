-- Fix storage bucket policies for file uploads
-- Run this SQL in your Supabase SQL Editor

-- First, ensure the buckets exist and are public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('songs', 'songs', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/flac']),
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop all existing storage policies first
DROP POLICY IF EXISTS "Anyone can view songs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload songs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own songs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own songs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Create comprehensive storage policies

-- 1. Allow anyone to view/download files from both buckets (since they're public)
CREATE POLICY "Anyone can view songs" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Anyone can view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- 2. Allow authenticated users to upload to both buckets
CREATE POLICY "Authenticated users can upload songs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'songs' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' 
        AND auth.role() = 'authenticated'
    );

-- 3. Allow users to update/delete their own files (optional, for future features)
CREATE POLICY "Users can update own songs" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'songs' 
        AND auth.uid() = owner
    );

CREATE POLICY "Users can update own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' 
        AND auth.uid() = owner
    );

CREATE POLICY "Users can delete own songs" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'songs' 
        AND auth.uid() = owner
    );

CREATE POLICY "Users can delete own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' 
        AND auth.uid() = owner
    );
