-- ============================================================
-- AUTH LOGS TABLE (LOGIN & LOGOUT)
-- Tracks every login & logout with user details, date & time.
-- ============================================================

DROP TABLE IF EXISTS public.login_logs CASCADE;

CREATE TABLE public.login_logs (
    log_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Pulled from public.Registration at event time
    full_name       TEXT        NOT NULL,
    email           TEXT        NOT NULL,
    phone_number    TEXT,

    -- Event details ('LOGIN' or 'LOGOUT')
    event_type      TEXT        NOT NULL DEFAULT 'LOGIN' CHECK (event_type IN ('LOGIN', 'LOGOUT')),
    logged_in_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address      INET,
    user_agent      TEXT,
    login_method    TEXT        NOT NULL DEFAULT 'email_password',
    status          TEXT        NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index for fast queries per user
CREATE INDEX idx_login_logs_user_id     ON public.login_logs (user_id);
CREATE INDEX idx_login_logs_logged_in   ON public.login_logs (logged_in_at DESC);

-- Enable Row Level Security
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Policy: users can view own logs
CREATE POLICY "Users can view own login logs"
    ON public.login_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: record_auth_log()
-- Handles both LOGIN and LOGOUT events server-side.
-- ============================================================

CREATE OR REPLACE FUNCTION public.record_auth_log(
    p_event_type    TEXT    DEFAULT 'LOGIN',
    p_ip_address    TEXT    DEFAULT NULL,
    p_user_agent    TEXT    DEFAULT NULL,
    p_login_method  TEXT    DEFAULT 'email_password'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_uid           UUID;
    v_full_name     TEXT;
    v_email         TEXT;
    v_phone         TEXT;
BEGIN
    v_uid := auth.uid();

    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT full_name, email, phone_number
    INTO   v_full_name, v_email, v_phone
    FROM   public.Registration
    WHERE  id = v_uid;

    INSERT INTO public.login_logs (
        user_id,
        full_name,
        email,
        phone_number,
        event_type,
        ip_address,
        user_agent,
        login_method,
        status,
        logged_in_at
    )
    VALUES (
        v_uid,
        COALESCE(v_full_name, 'Unknown'),
        COALESCE(v_email,     'Unknown'),
        v_phone,
        UPPER(p_event_type),
        p_ip_address::INET,
        p_user_agent,
        p_login_method,
        'success',
        NOW()
    );
END;
$$;

-- Backward compatibility function alias for record_login_log
CREATE OR REPLACE FUNCTION public.record_login_log(
    p_ip_address    TEXT    DEFAULT NULL,
    p_user_agent    TEXT    DEFAULT NULL,
    p_login_method  TEXT    DEFAULT 'email_password'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM public.record_auth_log('LOGIN', p_ip_address, p_user_agent, p_login_method);
END;
$$;

-- ============================================================
-- ADMIN VIEW: Clean, readable history across all users
-- ============================================================

CREATE OR REPLACE VIEW public.v_login_history AS
SELECT
    ll.log_id,
    ll.user_id,
    ll.event_type       AS "Event",
    ll.full_name        AS "Name",
    ll.email            AS "Email",
    ll.phone_number     AS "Phone",
    ll.login_method     AS "Method",
    ll.status           AS "Status",
    ll.ip_address       AS "IP Address",
    TO_CHAR(ll.logged_in_at AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM-DD HH24:MI:SS') AS "Timestamp (BST)"
FROM public.login_logs ll
ORDER BY ll.logged_in_at DESC;
