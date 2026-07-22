import { Link, useNavigate } from "react-router";
import { Search, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo and Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-bold text-[#0c326f] tracking-tight hover:opacity-90 transition-opacity">
                        NexusBuild
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/projects" className="text-xs font-bold text-slate-600 hover:text-[#0c326f] transition-colors">
                            Projects
                        </Link>
                        <Link to="/gismap" className="text-xs font-bold text-slate-600 hover:text-[#0c326f] transition-colors">
                            GIS Map
                        </Link>
                        <Link to="/about" className="text-xs font-bold text-slate-600 hover:text-[#0c326f] transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="text-xs font-bold text-slate-600 hover:text-[#0c326f] transition-colors">
                            Contact
                        </Link>
                    </nav>
                </div>

                {/* Search Bar & CTAs */}
                <div className="flex items-center gap-4">
                    {/* Search Input Box */}
                    <div className="relative hidden sm:flex items-center">
                        <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
                            <Search size={14} />
                        </span>
                        <input
                            type="search"
                            placeholder="Search here..."
                            className="pl-9 pr-4 py-1.5 w-48 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400 text-slate-800"
                        />
                    </div>

                    {/* Auth CTAs */}
                    {!loading && (
                        <div className="flex items-center gap-2">
                            {user ? (
                                /* ── LOGGED IN ── */
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#003178] border border-[#003178]/30 hover:border-[#003178] hover:bg-[#003178]/5 rounded-lg transition-all"
                                    >
                                        <LayoutDashboard size={13} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all cursor-pointer"
                                    >
                                        <LogOut size={13} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                /* ── LOGGED OUT ── */
                                <>
                                    <Link
                                        to="/login"
                                        className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-[#0c326f] border border-slate-200 hover:border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0c326f] hover:bg-[#082554] rounded-lg shadow-sm transition-all"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;