import { supabase } from './supabaseClient.js';


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


export async function handleSignOut() {
    try {
        await supabase.rpc('record_auth_log', {
            p_event_type: 'LOGOUT',
            p_user_agent: navigator.userAgent ?? null,
        });
    } catch (err) {
        console.warn('[Logout Log] Failed to record logout:', err.message);
    } finally {
        await supabase.auth.signOut();
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
 * Send a password reset email via Supabase Auth.
 * Works for any registered user — same simplicity as login.
 */
export async function sendResetEmail(email) {
    try {
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