import { supabase } from '../config/supabase.js';

/**
 * Authentication Middleware
 * Validates JWT access tokens using Supabase Auth
 */
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ error: err.message || 'Authentication failed' });
    }
};

/**
 * Role-Based Access Control (RBAC) - Admin Only
 */
export const requireAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const roleInMetadata = req.user.user_metadata?.role;
    if (roleInMetadata === 'admin') {
        return next();
    }

    // Secondary check against clients table
    try {
        const { data: client } = await supabase
            .from('clients')
            .select('role')
            .eq('email', req.user.email)
            .single();

        if (client && client.role === 'admin') {
            return next();
        }
    } catch {
        // Continue to rejection
    }

    return res.status(403).json({ error: 'Admin access required' });
};

export default authMiddleware;
