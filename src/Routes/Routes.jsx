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
import AdminLogin from '../Pages/AdminLogin/AdminLogin';

// Dashboard
import Dashboard from '../Pages/Dashboard/Dashboard';
import Overview from '../Pages/Dashboard/Overview';
import FinancialLedger from '../Pages/Dashboard/FinancialLedger';
import ProjectProgress from '../Pages/Dashboard/ProjectProgress';
import Support from '../Pages/Dashboard/Support';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute';

// Admin Pages
import AdminLayout from '../Pages/Admin/AdminLayout';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import ClientManagement from '../Pages/Admin/ClientManagement';
import AdminLeads from '../Pages/Admin/AdminLeads';
import AdminOnboarding from '../Pages/Admin/AdminOnboarding';
import AdminInstallments from '../Pages/Admin/AdminInstallments';
import AdminFinancials from '../Pages/Admin/AdminFinancials';
import AdminSiteProgress from '../Pages/Admin/AdminSiteProgress';
import AdminWebsiteProjects from '../Pages/Admin/AdminWebsiteProjects';
import AdminSettings from '../Pages/Admin/AdminSettings';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        errorElement: <Error />,
        children: [
            {
                index: true,
                path: '/',
                Component: Projects,
            },
            {
                path: 'projects',
                Component: Projects,
            },
        ],
    },
    { path: '/login',          Component: Login },
    { path: '/register',       Component: Register },
    { path: '/gismap',         Component: Gismap },
    { path: '/about',          Component: About },
    { path: '/contact',        Component: Contact },
    { path: '/reset-password', Component: ResetPassword },
    { path: '/admin-login',    Component: AdminLogin },

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
    // ── Protected Admin ───────────────────────────────────────────────────────
    {
        path: '/admin',
        element: (
            <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true,              Component: AdminDashboard },
            { path: 'management',       Component: ClientManagement },
            { path: 'leads',            Component: AdminLeads },
            { path: 'onboarding',       Component: AdminOnboarding },
            { path: 'installments',     Component: AdminInstallments },
            { path: 'financials',       Component: AdminFinancials },
            { path: 'progress',         Component: AdminSiteProgress },
            { path: 'website-projects', Component: AdminWebsiteProjects },
            { path: 'settings',         Component: AdminSettings },
        ]
    },

    // ── Catch-all Fallback Route ──────────────────────────────────────────────
    { path: '*', Component: Error },
]);