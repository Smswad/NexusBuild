-- Drop old table if it exists
DROP TABLE IF EXISTS public.Registration CASCADE;

-- Create profile table linked to Supabase auth.users
-- Passwords are NEVER stored here — Supabase Auth handles that securely
CREATE TABLE public.Registration (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_client_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_client_phone CHECK (
        phone_number IS NULL OR
        phone_number ~ '^\+?[0-9\-\s]{7,15}$'
    )
);

-- Enable Row Level Security
ALTER TABLE public.Registration ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.Registration
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.Registration
    FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================
-- TRIGGER: Auto-insert profile row when a new auth user signs up
-- This runs server-side (SECURITY DEFINER), bypassing RLS.
-- This is the official Supabase-recommended pattern and fixes
-- the issue where auth.uid() is NULL before email confirmation,
-- which caused the client-side INSERT to be rejected by RLS.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.Registration (id, full_name, email, phone_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'phone_number'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Drop trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();