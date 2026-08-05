import { Navigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';

/**
 * Wraps routes that require a logged-in user.
 * (Bypassed for previewing)
 */
const ProtectedRoute = ({ children }) => {
    return children;
};

export default ProtectedRoute;
