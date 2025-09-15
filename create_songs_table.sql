-- Create songs table to store song metadata
-- Run this SQL in your Supabase SQL Editor

-- 1. Create songs table
CREATE TABLE IF NOT EXISTS public.songs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT,
    author TEXT,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    image_path TEXT,
    song_path TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for songs table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view songs" ON public.songs;
DROP POLICY IF EXISTS "Users can insert own songs" ON public.songs;
DROP POLICY IF EXISTS "Users can update own songs" ON public.songs;
DROP POLICY IF EXISTS "Users can delete own songs" ON public.songs;

-- Create new policies
CREATE POLICY "Anyone can view songs" ON public.songs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own songs" ON public.songs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own songs" ON public.songs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own songs" ON public.songs
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Create liked_songs table for the like functionality
CREATE TABLE IF NOT EXISTS public.liked_songs (
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    song_id BIGINT REFERENCES public.songs ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, song_id)
);

-- 5. Enable RLS for liked_songs table
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for liked_songs table
DROP POLICY IF EXISTS "Users can view own likes" ON public.liked_songs;
DROP POLICY IF EXISTS "Users can insert own likes" ON public.liked_songs;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.liked_songs;

CREATE POLICY "Users can view own likes" ON public.liked_songs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes" ON public.liked_songs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.liked_songs
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON public.songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON public.songs(created_at);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id ON public.liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_song_id ON public.liked_songs(song_id);
