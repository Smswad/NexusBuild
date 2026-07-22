import { Navigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';

/**
 * Wraps routes that require a logged-in user.
 * - Loading  → shows a full-screen spinner
 * - No user  → redirects to /login
 * - Has user → renders children
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-[#003178] border-t-transparent animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
