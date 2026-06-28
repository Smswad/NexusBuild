-- Drop old table if it exists
DROP TABLE IF EXISTS public.Registration CASCADE;

-- Create profile table linked to Supabase auth.users
-- Passwords are NEVER stored here — Supabase Auth handles that securely
CREATE TABLE public.Registration (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone_number TEXT,

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

-- Policy: users can insert their own profile (on registration)
CREATE POLICY "Users can insert own profile"
    ON public.Registration
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.Registration
    FOR UPDATE
    USING (auth.uid() = id);