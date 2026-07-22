-- ============================================================
-- LOGIN LOG TABLE
-- Tracks every successful login with user details + metadata.
-- ============================================================

DROP TABLE IF EXISTS public.login_logs CASCADE;

CREATE TABLE public.login_logs (
    log_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Pulled from public.Registration at login time
    full_name       TEXT        NOT NULL,
    email           TEXT        NOT NULL,
    phone_number    TEXT,

    -- Session & device metadata
    logged_in_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address      INET,                     -- optional: pass from client/edge
    user_agent      TEXT,                     -- optional: navigator.userAgent
    login_method    TEXT        NOT NULL DEFAULT 'email_password',

    -- Status
    status          TEXT        NOT NULL DEFAULT 'success'
                                CHECK (status IN ('success', 'failed')),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ── Index for fast queries per user ─────────────────────────────────────────
CREATE INDEX idx_login_logs_user_id     ON public.login_logs (user_id);
CREATE INDEX idx_login_logs_logged_in   ON public.login_logs (logged_in_at DESC);

-- ── Enable Row Level Security ────────────────────────────────────────────────
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Policy: each user can only see their OWN login history
CREATE POLICY "Users can view own login logs"
    ON public.login_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: record_login_log()
-- Called from the client after a successful signInWithPassword.
-- Runs as SECURITY DEFINER to bypass RLS on INSERT,
-- and auto-joins public.Registration to fill in name/email/phone.
-- ============================================================

CREATE OR REPLACE FUNCTION public.record_login_log(
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
    -- Get the currently authenticated user's UID
    v_uid := auth.uid();

    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch profile details from Registration table
    SELECT full_name, email, phone_number
    INTO   v_full_name, v_email, v_phone
    FROM   public.Registration
    WHERE  id = v_uid;

    -- Insert the log entry
    INSERT INTO public.login_logs (
        user_id,
        full_name,
        email,
        phone_number,
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
        p_ip_address::INET,
        p_user_agent,
        p_login_method,
        'success',
        NOW()
    );
END;
$$;

-- ============================================================
-- ADMIN VIEW: Clean, readable login history across all users
-- Run this in the Supabase SQL Editor (as postgres / service role)
-- ============================================================

CREATE OR REPLACE VIEW public.v_login_history AS
SELECT
    ll.log_id,
    ll.user_id,
    ll.full_name        AS "Name",
    ll.email            AS "Email",
    ll.phone_number     AS "Phone",
    ll.login_method     AS "Method",
    ll.status           AS "Status",
    ll.ip_address       AS "IP Address",
    ll.user_agent       AS "User Agent",
    TO_CHAR(ll.logged_in_at AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM-DD HH24:MI:SS') AS "Logged In (BST)"
FROM public.login_logs ll
ORDER BY ll.logged_in_at DESC;
