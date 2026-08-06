import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const isadmin = session.user.email === 'admin@reliance.com';
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: isadmin ? 'admin' : 'client'
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const isadmin = session.user.email === 'admin@reliance.com';
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: isadmin ? 'admin' : 'client'
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Record login log
        supabase.rpc('record_login_log', {
            p_user_agent: navigator.userAgent ?? null,
            p_ip_address: null,
            p_login_method: 'email_password',
        }).then(({ error: logErr }) => {
            if (logErr) console.warn('[Login Log] Failed to record login:', logErr.message);
        });

        return data;
    };

    const signOut = async () => {
        try {
            await supabase.rpc('record_auth_log', {
                p_event_type: 'LOGOUT',
                p_user_agent: navigator.userAgent ?? null,
            });
        } catch (err) {
            console.warn('[Logout Log] Failed to record logout:', err.message);
        }
        
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};

export default AuthContext;
