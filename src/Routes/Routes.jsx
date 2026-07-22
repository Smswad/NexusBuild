import { createBrowserRouter } from 'react-router';
import Root from '../Pages/Root/Root';
import Error from '../Pages/ErrorPage/Error';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Projects from '../Pages/Projects/Projects';
import Gismap from '../Pages/Gismap/Gismap';
import About from '../Pages/About/About';
import Contact from '../Pages/Contact/Contact';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';

// Dashboard
import Dashboard from '../Pages/Dashboard/Dashboard';
import Overview from '../Pages/Dashboard/Overview';
import FinancialLedger from '../Pages/Dashboard/FinancialLedger';
import ProjectProgress from '../Pages/Dashboard/ProjectProgress';
import Support from '../Pages/Dashboard/Support';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        errorElement: <Error />,
        children: [
            {
                index: true,
                path: '/',
                Component: Home,
            },
        ],
    },
    { path: '/login',          Component: Login },
    { path: '/register',       Component: Register },
    { path: '/projects',       Component: Projects },
    { path: '/gismap',         Component: Gismap },
    { path: '/about',          Component: About },
    { path: '/contact',        Component: Contact },
    { path: '/reset-password', Component: ResetPassword },

    // ── Protected Dashboard ───────────────────────────────────────────────────
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            { index: true,              Component: Overview },
            { path: 'financials',       Component: FinancialLedger },
            { path: 'progress',         Component: ProjectProgress },
            { path: 'support',          Component: Support },
        ],
    },
]);