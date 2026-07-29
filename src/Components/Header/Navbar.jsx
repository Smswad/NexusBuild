import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Figma spec (Header - TopNavBar, consistent across all frames):
//   Height: 80px, bg: #f8f9fa, border-bottom: #c4c6ce 1px
//   Logo: "NexusBuild" 24px fw=700 #000f22
//   Nav links: 16px fw=400 #43474d — active link underlined with #a14000 stroke
//   Right: search input (#f3f4f5 bg, r=4, #c4c6ce border) + Login (outline) + Register (filled #000f22)
//   When logged in: show Dashboard + Logout in place of Login/Register
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
    { to: "/projects", label: "Projects" },
    { to: "/gismap",   label: "GIS Map"  },
    { to: "/about",    label: "About"    },
    { to: "/contact",  label: "Contact"  },
];

const Navbar = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

    return (
        <header className="sticky top-0 z-50 bg-[#f8f9fa] border-b border-[#c4c6ce]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-8">

                {/* ── Left: Logo + Nav ── */}
                <div className="flex items-center gap-8">
                    {/* Logo — Figma: "NexusBuild" 24px fw=700 #000f22 */}
                    <Link
                        to="/"
                        className="text-[24px] font-bold text-[#000f22] tracking-tight hover:opacity-80 transition-opacity flex-shrink-0"
                    >
                        NexusBuild
                    </Link>

                    {/* Desktop Nav — Figma: 16px fw=400, active = bottom stroke #a14000 */}
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`
                                    text-[16px] font-normal transition-colors duration-200 pb-1
                                    ${isActive(to)
                                        ? "text-[#000f22] border-b-2 border-[#a14000]"
                                        : "text-[#43474d] hover:text-[#000f22] border-b-2 border-transparent"}
                                `}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* ── Right: Search + Auth CTAs ── */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Search — Figma: 256×38, #f3f4f5 bg, r=4, #c4c6ce stroke */}
                    <div className="relative flex items-center">
                        <Search size={16} className="absolute left-3 text-[#74777e] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search projects..."
                            className="
                                pl-9 pr-4 py-[9px] w-56
                                bg-[#f3f4f5] border border-[#c4c6ce] rounded-[4px]
                                text-[14px] font-semibold text-[#191c1d] placeholder-[#6b7280]
                                focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540]/20
                                transition-all
                            "
                        />
                    </div>

                    {/* Auth CTAs */}
                    {!loading && (
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    {/* Dashboard button when logged in */}
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-1.5 px-5 py-[9px] text-[14px] font-bold text-[#000f22] border border-[#000f22] hover:bg-[#000f22] hover:text-white rounded-none transition-all"
                                    >
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-5 py-[9px] text-[14px] font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Login — Figma: outline #000f22 border, no fill */}
                                    <Link
                                        to="/login"
                                        className="px-5 py-[9px] text-[14px] font-bold text-[#000f22] border border-[#000f22] hover:bg-[#000f22] hover:text-white transition-all"
                                    >
                                        Login
                                    </Link>
                                    {/* Register — Figma: filled #000f22, white text */}
                                    <Link
                                        to="/register"
                                        className="px-5 py-[9px] text-[14px] font-bold text-white bg-[#000f22] hover:bg-[#0a2540] transition-all"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Mobile Hamburger ── */}
                <button
                    className="md:hidden text-[#43474d] hover:text-[#000f22] focus:outline-none"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── Mobile Menu Drawer ── */}
            {mobileOpen && (
                <div className="md:hidden bg-[#f8f9fa] border-t border-[#c4c6ce] px-6 py-4 flex flex-col gap-4">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className={`text-[16px] font-medium py-2 transition-colors ${isActive(to) ? "text-[#000f22] font-bold" : "text-[#43474d]"}`}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="border-t border-[#c4c6ce] pt-4 flex gap-3">
                        {!loading && (user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-[14px] font-bold text-[#000f22] border border-[#000f22]">Dashboard</Link>
                                <button onClick={handleLogout} className="flex-1 py-3 text-[14px] font-bold text-white bg-rose-600 cursor-pointer">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-[14px] font-bold text-[#000f22] border border-[#000f22]">Login</Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 text-[14px] font-bold text-white bg-[#000f22]">Register</Link>
                            </>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;