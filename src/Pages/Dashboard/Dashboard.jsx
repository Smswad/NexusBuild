import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
    LayoutDashboard, BookOpen, HardHat, Headphones,
    Bell, LogOut, Building2, User
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { ClientDataProvider, useClientData } from '../../Context/ClientDataContext';

const NAV_LINKS = [
    { to: '/dashboard',            label: 'Dashboard',        icon: LayoutDashboard, end: true },
    { to: '/dashboard/financials', label: 'Financials',       icon: BookOpen },
    { to: '/dashboard/progress',   label: 'Projects',         icon: HardHat },
    { to: '/dashboard/support',    label: 'Support',          icon: Headphones },
];

const DashboardContent = () => {
    const { signOut } = useAuth();
    const { userProfile } = useClientData(); // Fetch dynamic user info
    const navigate = useNavigate();

    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => { await signOut(); navigate('/'); };

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-[#F0F4F8]">
            {/* ══ SIDEBAR (340px) ══════════════════════════════════════════════ */}
            <aside className="w-[340px] flex-shrink-0 flex flex-col bg-[#003178] text-white">
                
                {/* Header Logo Area */}
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#003178] flex-shrink-0">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-2xl leading-none">Reliance</div>
                            <div className="text-white font-bold text-2xl leading-tight">Housing LTD</div>
                            <div className="text-[#A0B2C6] text-sm mt-1">Client Portal</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu Items */}
                <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} className="no-underline block">
                            {({ isActive }) => (
                                <div className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                                    isActive 
                                        ? 'bg-[#0F4C9E] text-white border-l-4 border-white' 
                                        : 'text-[#A0B2C6] border-l-4 border-transparent hover:text-white'
                                }`}>
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-[#A0B2C6]'} />
                                    <span className="text-base font-medium">{label}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Logout */}
                <div className="px-6 mb-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-[#A0B2C6] hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-base font-medium">Logout</span>
                    </button>
                </div>

                {/* User Profile Widget (Bottom Sidebar) */}
                <div className="p-4 bg-[#0A2550]">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white text-[#0A2550] rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 border-2 border-[#A0B2C6]/30">
                            {userProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="text-white font-bold text-sm truncate">{userProfile.name}</div>
                            <div className="text-[#A0B2C6] text-xs mt-0.5 truncate">{userProfile.propertyDesc}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ══ MAIN AREA ════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Top Header (70px) */}
                <header className="h-[70px] flex-shrink-0 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between z-10">
                    <div className="text-slate-800 font-bold text-xl">
                        Welcome Back, {userProfile.name}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div ref={notifRef} className="relative">
                            <button
                                onClick={() => setShowNotif(p => !p)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#003178] text-[#003178] hover:bg-blue-50 transition-colors"
                            >
                                <Bell size={18} />
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>
                            
                            {/* Dummy dropdown */}
                            {showNotif && (
                                <div className="absolute right-0 top-12 w-64 bg-white border border-[#E2E8F0] shadow-lg p-4 rounded text-sm text-slate-600">
                                    No new notifications.
                                </div>
                            )}
                        </div>

                        {/* Profile Icon */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#003178] text-[#003178]">
                            <User size={18} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <ClientDataProvider>
            <DashboardContent />
        </ClientDataProvider>
    );
};

export default Dashboard;
