import { Navigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';

/**
 * Wraps routes that require a logged-in user.
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        // Not logged in -> redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        // Client trying to access Admin pages -> redirect to client dashboard
        return <Navigate to="/dashboard" replace />;
    }

    if (!requireAdmin && user.role === 'admin') {
        // Admin trying to access Client pages -> redirect to admin dashboard
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
