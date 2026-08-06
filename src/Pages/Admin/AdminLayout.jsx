import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
    LayoutDashboard, Users, BookOpen, HardHat,
    Bell, LogOut, Building2, Search, UserPlus, FileText, Calendar, Settings, Grid, X, Check, Globe
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { AdminDataProvider, useAdminData } from '../../Context/AdminDataContext';

const NAV_LINKS = [
    { to: '/admin',            label: 'Dashboard',        icon: LayoutDashboard, end: true },
    { to: '/admin/leads',      label: 'Leads',            icon: UserPlus },
    { to: '/admin/onboarding', label: 'Onboarding',       icon: FileText },
    { to: '/admin/management',  label: 'Client Management', icon: Users },
    { to: '/admin/financials', label: 'Financial Ledgers',icon: BookOpen },
    { to: '/admin/installments',label: 'Installments',     icon: Calendar },
    { to: '/admin/progress',   label: 'Site Progress',    icon: HardHat },
    { to: '/admin/website-projects', label: 'Website Projects', icon: Globe },
];

const AdminLayoutContent = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { projects, activeProject, setActiveProject, addProject } = useAdminData();

    const [showNotif, setShowNotif] = useState(false);
    const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [newProjectForm, setNewProjectForm] = useState({ id: '', name: '', totalUnits: '' });
    const notifRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => { await signOut(); navigate('/'); };

    const handleAddProject = async (e) => {
        e.preventDefault();
        const success = await addProject(newProjectForm);
        if (success) {
            setIsAddProjectOpen(false);
            setNewProjectForm({ id: '', name: '', totalUnits: '' });
            setActiveProject(newProjectForm.id); // Switch to the newly created project
        }
    };

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-[#F3F4F6]">
            {/* ══ SIDEBAR (260px) ══════════════════════════════════════════════ */}
            <aside className="w-[260px] flex-shrink-0 flex flex-col bg-[#1A4B9C] text-white">
                
                {/* Header Logo Area */}
                <div className="p-6 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#1A4B9C] flex-shrink-0">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg leading-none">Reliance Housing Ltd.</div>
                            <div className="text-blue-200 text-[10px] mt-0.5 uppercase tracking-wider">Super Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu Items */}
                <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} className="no-underline block">
                            {({ isActive }) => (
                                <div className={`flex items-center gap-3 px-6 py-2.5 transition-colors ${
                                    isActive && to !== '#'
                                        ? 'bg-[#153B7C] text-white border-l-4 border-white' 
                                        : 'text-blue-100 border-l-4 border-transparent hover:bg-[#153B7C] hover:text-white'
                                }`}>
                                    <Icon size={18} className={isActive && to !== '#' ? 'text-white' : 'text-blue-200'} />
                                    <span className="text-sm font-medium">{label}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto">
                    <div className="px-4 mb-2">
                        <button onClick={() => setIsProjectSwitcherOpen(true)} className="w-full flex items-center justify-center gap-2 py-2 bg-[#153B7C] text-white rounded text-sm font-medium hover:bg-[#0E2856] transition-colors shadow-sm border border-[#1A4B9C]">
                            <Grid size={16} /> Switch Project
                        </button>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4 bg-[#113166] text-blue-200 text-sm">
                        <NavLink to="/admin/settings" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Settings size={16} /> Settings
                        </NavLink>
                        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-white transition-colors">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* ══ MAIN AREA ════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Top Header (70px) */}
                <header className="h-[70px] flex-shrink-0 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3 bg-[#F3F4F6] rounded-lg px-4 py-2 w-[450px]">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search clients, unit, projects..."
                            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                        />
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
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-800">Super Admin (MD)</div>
                                <div className="text-xs text-slate-500">Reliance Housing Ltd.</div>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                <img src={`https://ui-avatars.com/api/?name=Admin&background=1A4B9C&color=fff`} alt="Profile" className="w-10 h-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                    <Outlet />
                </main>
            </div>

            {/* Project Switcher Modal */}
            {isProjectSwitcherOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-xl shadow-xl w-[450px] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800">Select Project Environment</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">Choose a project to manage its specific data.</p>
                            </div>
                            <button onClick={() => setIsProjectSwitcherOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {!isAddProjectOpen ? (
                            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                                <button 
                                    onClick={() => { setActiveProject('all'); setIsProjectSwitcherOpen(false); }}
                                    className={`w-full text-left p-4 rounded-lg border transition-colors flex justify-between items-center ${activeProject === 'all' ? 'border-[#1A4B9C] bg-[#E1EFFE]' : 'border-[#E2E8F0] hover:border-[#1A4B9C]'}`}
                                >
                                    <div>
                                        <div className={`font-bold text-sm ${activeProject === 'all' ? 'text-[#1A4B9C]' : 'text-slate-800'}`}>All Projects Overview</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Master view for Super Admins</div>
                                    </div>
                                    {activeProject === 'all' && <Check size={18} className="text-[#1A4B9C]" />}
                                </button>

                                {projects?.map(proj => (
                                    <button 
                                        key={proj.id}
                                        onClick={() => { setActiveProject(proj.id); setIsProjectSwitcherOpen(false); }}
                                        className={`w-full text-left p-4 rounded-lg border transition-colors flex justify-between items-center ${activeProject === proj.id ? 'border-[#1A4B9C] bg-[#E1EFFE]' : 'border-[#E2E8F0] hover:border-[#1A4B9C]'}`}
                                    >
                                        <div>
                                            <div className={`font-bold text-sm ${activeProject === proj.id ? 'text-[#1A4B9C]' : 'text-slate-800'}`}>{proj.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">ID: {proj.id} • {proj.totalUnits || 0} Units</div>
                                        </div>
                                        {activeProject === proj.id && <Check size={18} className="text-[#1A4B9C]" />}
                                    </button>
                                ))}
                                
                                <div className="pt-4 mt-2 border-t border-[#E2E8F0]">
                                    <button onClick={() => setIsAddProjectOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                                        <Building2 size={16} /> Add New Project
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleAddProject} className="p-6 space-y-4">
                                <h4 className="text-sm font-bold text-[#1A4B9C] border-b border-[#E2E8F0] pb-2 mb-4">Create New Project</h4>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project ID</label>
                                    <input type="text" placeholder="e.g. p3" required value={newProjectForm.id} onChange={e => setNewProjectForm({...newProjectForm, id: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                    <div className="text-[10px] text-slate-400 mt-1">Must be unique (e.g., p1, p2, p3).</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
                                    <input type="text" placeholder="e.g. Skyline Heights" required value={newProjectForm.name} onChange={e => setNewProjectForm({...newProjectForm, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Units</label>
                                    <input type="number" placeholder="e.g. 50" required value={newProjectForm.totalUnits} onChange={e => setNewProjectForm({...newProjectForm, totalUnits: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsAddProjectOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C]">Save Project</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminLayout = () => {
    return (
        <AdminDataProvider>
            <AdminLayoutContent />
        </AdminDataProvider>
    );
};

export default AdminLayout;
