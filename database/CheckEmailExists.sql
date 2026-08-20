-- Run this in your Supabase Dashboard → SQL Editor
-- Creates a function that checks if an email exists in auth.users

CREATE OR REPLACE FUNCTION public.check_email_exists(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email) INTO v_exists;
    RETURN json_build_object('exists', v_exists);
END;
$$;
