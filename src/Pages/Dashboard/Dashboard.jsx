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
    const { userProfile, activeClient, updateProfile, financials } = useClientData(); // Fetch dynamic user info
    const navigate = useNavigate();

    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');

    useEffect(() => {
        if (activeClient) {
            setEditName(activeClient.name || '');
            setEditPhone(activeClient.phone || '');
            setEditEmail(activeClient.email || '');
        }
    }, [activeClient]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                name: editName,
                phone: editPhone,
                email: editEmail
            });
            setShowProfileModal(false);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Error updating profile: ' + err.message);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => { await signOut(); navigate('/'); };

    const clientNotifications = [
        {
            id: 'sys-1',
            title: 'Welcome to Client Portal',
            desc: `Unit ${financials.unitName || 'Allocation'} account overview is active.`,
            date: 'System',
            badge: 'bg-blue-100 text-[#003178]'
        },
        ...financials.transactions.slice(0, 3).map(t => ({
            id: `tx-${t.id}`,
            title: 'Payment Confirmation',
            desc: `৳${t.amount} confirmed for ${t.type}`,
            date: t.date,
            badge: 'bg-emerald-100 text-emerald-700'
        })),
        ...financials.installments.filter(i => i.status === 'Pending' || i.status === 'Overdue').slice(0, 2).map(i => ({
            id: `inst-${i.id}`,
            title: i.status === 'Overdue' ? 'Installment Overdue' : 'Upcoming Installment Due',
            desc: `${i.installment} of ৳${i.amount} due on ${i.dueDate}`,
            date: i.dueDate,
            badge: i.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }))
    ];

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-[#F0F4F8] print:block print:h-auto print:overflow-visible">
            {/* ══ SIDEBAR (340px) ══════════════════════════════════════════════ */}
            <aside className="w-[340px] flex-shrink-0 flex flex-col bg-[#003178] text-white print:hidden">
                
                {/* Header Logo Area */}
                <div 
                    onClick={() => navigate('/')}
                    className="p-8 pb-10 cursor-pointer hover:bg-[#002660] transition-colors"
                    title="Go to Home"
                >
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
            <div className="flex-1 flex flex-col overflow-hidden print:block print:h-auto print:overflow-visible">
                
                {/* Top Header (70px) */}
                <header className="h-[70px] flex-shrink-0 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between z-10 print:hidden">
                    <div className="text-slate-800 font-bold text-xl">
                        Welcome Back, {userProfile.name}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div ref={notifRef} className="relative">
                            <button
                                onClick={() => setShowNotif(p => !p)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#003178] text-[#003178] hover:bg-blue-50 transition-colors cursor-pointer relative"
                            >
                                <Bell size={18} />
                                {clientNotifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] flex items-center justify-center rounded-full border-2 border-white">
                                        {clientNotifications.length}
                                    </span>
                                )}
                            </button>
                            
                            {/* Live Notification Dropdown */}
                            {showNotif && (
                                <div className="absolute right-0 top-12 w-80 bg-white border border-[#E2E8F0] shadow-xl rounded-xl p-4 text-xs text-slate-700 z-50 divide-y divide-slate-100">
                                    <div className="font-bold text-sm text-[#003178] pb-2 flex justify-between items-center">
                                        <span>Notifications</span>
                                        <span className="text-[10px] bg-blue-100 text-[#003178] px-2 py-0.5 rounded-full font-bold">{clientNotifications.length} New</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 py-1">
                                        {clientNotifications.map(n => (
                                            <div key={n.id} className="py-2.5 hover:bg-slate-50 px-1 rounded transition-colors space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-800">{n.title}</span>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${n.badge}`}>{n.date}</span>
                                                </div>
                                                <p className="text-slate-500">{n.desc}</p>
                                            </div>
                                        ))}
                                        {clientNotifications.length === 0 && (
                                            <div className="py-6 text-center text-slate-400">No new notifications.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Icon Button */}
                        <button 
                            onClick={() => setShowProfileModal(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#003178] text-[#003178] hover:bg-blue-50 transition-colors cursor-pointer"
                            aria-label="Edit Profile"
                        >
                            <User size={18} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                    <Outlet />
                </main>
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-[#000f22]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
                        <div className="bg-[#003178] text-white p-6">
                            <h3 className="text-xl font-bold">Edit Profile Information</h3>
                            <p className="text-[#A0B2C6] text-sm mt-1">Update your basic details in the NexusBuild portal</p>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)} 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={editPhone} 
                                    onChange={(e) => setEditPhone(e.target.value)} 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={editEmail} 
                                    onChange={(e) => setEditEmail(e.target.value)} 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]" 
                                    required
                                    disabled
                                />
                            </div>
                            <div className="flex gap-4 mt-4 justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowProfileModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white font-semibold rounded-md transition-colors cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
