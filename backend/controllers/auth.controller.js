import { supabase } from '../config/supabase.js';

/**
 * Register a new user via Supabase Auth
 * POST /api/auth/register
 */
export const register = async (req, res, _next) => {
    const { fullName, email, phoneNumber, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber || '',
                },
            },
        });

        if (error) throw error;

        return res.status(201).json({
            message: 'Registration successful!',
            user: data.user,
            session: data.session,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Log in an existing user via Supabase Auth
 * POST /api/auth/login
 */
export const login = async (req, res, _next) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return res.status(200).json({
            message: 'Login successful',
            session: data.session,
            user: data.user,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res, _next) => {
    return res.status(200).json({ user: req.user });
};
