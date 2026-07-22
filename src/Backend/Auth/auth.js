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


// ─── FORGOT PASSWORD STUBS ────────────────────────────────────────────────────
// These functions are intentionally left as stubs so the backend developer can
// wire in real logic (Supabase Edge Functions, Nodemailer, SendGrid, etc.)
// The UI imports these directly; just replace the function bodies.

/**
 * TODO (Backend Developer):
 * Check whether `email` belongs to a registered user.
 * Return { exists: true } if found, { exists: false } if not.
 * Throw or return an error object on unexpected failures.
 */
export async function checkEmailExists(email) {
    // --- STUB: replace with real DB lookup ---
    console.log('[STUB] checkEmailExists called with:', email);
    // Mock: treat any email that contains "@" as registered
    if (email && email.includes('@')) {
        return { exists: true };
    }
    return { exists: false };
}

/**
 * TODO (Backend Developer):
 * Generate a 6-digit OTP server-side, store it (with expiry) tied to `email`,
 * then send it via your chosen email provider.
 * Return { success: true } on success, { success: false, error: '...' } on failure.
 */
export async function sendOTPEmail(email) {
    // --- STUB: replace with real OTP generation + email send ---
    console.log('[STUB] sendOTPEmail called with:', email);
    return { success: true };
}

/**
 * TODO (Backend Developer):
 * Validate the 6-digit `otp` against the server-side store for `email`.
 * Enforce the 30-second expiry window.
 * Return { valid: true } if correct and not expired, { valid: false, error: '...' } otherwise.
 */
export async function verifyOTP(email, otp) {
    // --- STUB: replace with real OTP verification ---
    console.log('[STUB] verifyOTP called with:', email, otp);
    // Mock: accept any 6-digit code
    if (otp && otp.length === 6) {
        return { valid: true };
    }
    return { valid: false, error: 'Invalid OTP. Please try again.' };
}

/**
 * TODO (Backend Developer):
 * Update the password for `email` to `newPassword`.
 * You must authenticate this action with the verified OTP session/token.
 * Return { success: true } on success, { success: false, error: '...' } on failure.
 */
export async function resetPassword(email, newPassword) {
    // --- STUB: replace with real password update (e.g. supabase.auth.updateUser) ---
    console.log('[STUB] resetPassword called with:', email);
    return { success: true };
}