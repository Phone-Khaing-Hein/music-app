-- Complete setup for users table and songs table policies
-- Run this SQL in your Supabase SQL Editor

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    billing_address JSONB,
    payment_method JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Set up Row Level Security (RLS) for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'given_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'family_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2))
  );
  RETURN NEW;
END;
$$;

-- 5. Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Set up RLS policies for songs table (fix the upload issue)
-- First check if songs table exists and enable RLS
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'songs') THEN
        ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Anyone can view songs" ON public.songs;
        DROP POLICY IF EXISTS "Users can insert own songs" ON public.songs;
        DROP POLICY IF EXISTS "Users can update own songs" ON public.songs;
        DROP POLICY IF EXISTS "Users can delete own songs" ON public.songs;
        
        -- Create new policies
        CREATE POLICY "Anyone can view songs" ON public.songs
            FOR SELECT USING (true);
        
        CREATE POLICY "Users can insert own songs" ON public.songs
            FOR INSERT WITH CHECK (auth.uid()::text = user_id);
        
        CREATE POLICY "Users can update own songs" ON public.songs
            FOR UPDATE USING (auth.uid()::text = user_id);
        
        CREATE POLICY "Users can delete own songs" ON public.songs
            FOR DELETE USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- 7. Create users for existing auth users (if any)
INSERT INTO public.users (id, full_name, avatar_url)
SELECT 
    id,
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
