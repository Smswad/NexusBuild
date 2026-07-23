import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);


export async function handleSignIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // ── Record login log (non-blocking) ──────────────────────────────────
        // Calls a SECURITY DEFINER function on Supabase that joins
        // public.Registration and inserts a clean row into public.login_logs.
        supabase.rpc('record_login_log', {
            p_user_agent:   navigator.userAgent ?? null,
            p_ip_address:   null,          // browser cannot read own IP; set via Edge Function if needed
            p_login_method: 'email_password',
        }).then(({ error: logErr }) => {
            if (logErr) console.warn('[Login Log] Failed to record login:', logErr.message);
        });

        return { success: true, session: data.session };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


export async function handleRegister(formData) {
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const password = formData.get('password');

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber,
                },
            },
        });

        if (error) throw error;

        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


// ─── FORGOT PASSWORD (Supabase Native) ────────────────────────────────────────

/**
 * Check if an email is registered, then send a password reset email.
 * Tries multiple lookup strategies: RPC → Registration table → fallback.
 */
export async function sendResetEmail(email) {
    try {
        let exists = null;

        // Strategy 1: RPC function (check_email_exists)
        try {
            const { data, error: rpcError } = await supabase
                .rpc('check_email_exists', { p_email: email });
            if (!rpcError) exists = data?.exists;
        } catch { /* fall through */ }

        // Strategy 2: Registration table
        if (exists === null) {
            const { data: profile, error: tableError } = await supabase
                .from('Registration')
                .select('id')
                .eq('email', email)
                .maybeSingle();
            if (!tableError) exists = !!profile;
        }

        // Strategy 3: can't verify — show helpful message
        if (exists === null) {
            return {
                success: false,
                error: 'Unable to verify email. Please run the database setup script (src/DataBase/CheckEmailExists.sql) in your Supabase SQL Editor, or contact support.'
            };
        }

        if (!exists) {
            return { success: false, error: 'No account found with this email address.' };
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Update the password for the currently authenticated user.
 * This is called after the user clicks the recovery link in their email,
 * which gives them a valid Supabase session with the `email_change` grant.
 */
export async function updatePassword(newPassword) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}