-- Run this in Supabase Dashboard → SQL Editor
-- Returns all Registration records (bypasses RLS via SECURITY DEFINER)

CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_agg(json_build_object(
        'id', r.id,
        'full_name', r.full_name,
        'email', r.email,
        'phone_number', r.phone_number,
        'created_at', r.created_at
    ) ORDER BY r.created_at DESC)
    INTO v_result
    FROM public.Registration r;

    RETURN COALESCE(v_result, '[]'::json);
END;
$$;
