-- ============================================================
-- ADMIN LOGINS & AUDIT TABLE
-- Tracks when administrators authenticate or log out
-- ============================================================

DROP TABLE IF EXISTS public.admin_login_logs CASCADE;

CREATE TABLE public.admin_login_logs (
    log_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_username  TEXT        NOT NULL,
    event_type      TEXT        NOT NULL DEFAULT 'LOGIN' CHECK (event_type IN ('LOGIN', 'LOGOUT')),
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address      INET,
    user_agent      TEXT,
    status          TEXT        NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed'))
);

-- Index for fast sorting by date/time
CREATE INDEX idx_admin_login_logs_date ON public.admin_login_logs (logged_at DESC);

-- Enable Row Level Security (lock down by default)
ALTER TABLE public.admin_login_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow only service_role (Admin Console backend) to read/write admin logs
-- No public/authenticated client-side select allowed directly
CREATE POLICY "Restrict admin logs access"
    ON public.admin_login_logs
    FOR ALL
    USING (false);

-- ============================================================
-- RPC FUNCTION: record_admin_auth_log()
-- Called by the Admin Console interface when logging in or logging out
-- Bypasses RLS using SECURITY DEFINER
-- ============================================================

CREATE OR REPLACE FUNCTION public.record_admin_auth_log(
    p_admin_username TEXT,
    p_event_type     TEXT,
    p_ip_address     TEXT    DEFAULT NULL,
    p_user_agent     TEXT    DEFAULT NULL,
    p_status         TEXT    DEFAULT 'success'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.admin_login_logs (
        admin_username,
        event_type,
        ip_address,
        user_agent,
        status,
        logged_at
    )
    VALUES (
        p_admin_username,
        UPPER(p_event_type),
        p_ip_address::INET,
        p_user_agent,
        LOWER(p_status),
        NOW()
    );
END;
$$;

-- ============================================================
-- ADMIN VIEW: Clean history view for admins
-- ============================================================

CREATE OR REPLACE VIEW public.v_admin_login_history AS
SELECT
    log_id,
    admin_username AS "Admin User",
    event_type     AS "Action",
    status         AS "Status",
    ip_address     AS "IP Address",
    user_agent     AS "User Agent",
    TO_CHAR(logged_at AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM-DD HH24:MI:SS') AS "Timestamp (BST)"
FROM public.admin_login_logs
ORDER BY logged_at DESC;
