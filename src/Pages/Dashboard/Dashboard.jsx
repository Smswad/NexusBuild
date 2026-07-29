import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
    LayoutDashboard, BookOpen, HardHat, Headphones,
    Bell, LogOut, X, Mail, Phone, Calendar, Shield, Globe,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { fetchProfile } from '../../lib/profile';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    iron:   '#12151C',
    amber:  '#C9973A',
    green:  '#0A3D2E',
    paper:  '#F4F1EB',
    steel:  '#2C3748',
    alert:  '#E84040',
    border: '#D4CFC7',
    muted:  '#6B6762',
};

const F = {
    display: "'Barlow Semi Condensed', sans-serif",
    body:    "'Barlow', sans-serif",
    mono:    "'Roboto Mono', monospace",
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS = [
    { id: 1, title: 'Payment Due',       msg: 'Payment of $12,500 due on 30 Jul 2026.',        time: '2h ago',  unread: true },
    { id: 2, title: 'Milestone Reached', msg: 'Phase 2 of Tower A has been completed.',         time: '1d ago',  unread: true },
    { id: 3, title: 'Document Ready',    msg: 'Your Q2 Statement is available for download.',   time: '3d ago',  unread: false },
];

const DUMMY_USER_META = {
    phone:       '+880 1700-000000',
    memberSince: 'January 2024',
    accountNo:   'NXB-2024-001',
};

const NAV_LINKS = [
    { to: '/dashboard',            label: 'Overview',         icon: LayoutDashboard, end: true },
    { to: '/dashboard/financials', label: 'Financial Ledger', icon: BookOpen },
    { to: '/dashboard/progress',   label: 'Project Progress', icon: HardHat },
    { to: '/dashboard/support',    label: 'Support',          icon: Headphones },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const AmberDot = ({ active }) => (
    <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: active ? C.amber : 'rgba(255,255,255,0.2)',
        flexShrink: 0,
    }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [showNotif,   setShowNotif]   = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifs,      setNotifs]      = useState(DUMMY_NOTIFICATIONS);
    const [profile,    setProfile]      = useState(null);

    const notifRef   = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        if (user?.id) {
            fetchProfile(user.id).then(setProfile);
        }
    }, [user?.id]);

    const unreadCount = notifs.filter(n => n.unread).length;
    const displayName = user?.user_metadata?.full_name
        || user?.email?.split('@')[0]?.replace(/[._]/g, ' ')
        || 'Client';

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => { await signOut(); navigate('/'); };
    const markAllRead  = () => setNotifs(p => p.map(n => ({ ...n, unread: false })));

    // ── Sidebar grid overlay ─────────────────────────────────────────────────
    const sidebarBg = {
        background: C.iron,
        backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '24px 24px',
    };

    // ── Page grid overlay ────────────────────────────────────────────────────
    const pageBg = {
        background: C.paper,
        backgroundImage: [
            'linear-gradient(rgba(201,151,58,0.05) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(201,151,58,0.05) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '40px 40px',
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: F.body }}>

            {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
            <aside style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', ...sidebarBg }}>

                {/* Blueprint Title Block */}
                <div style={{ padding: 14, borderBottom: `1px solid rgba(201,151,58,0.12)` }}>
                    <div style={{ border: `1px solid rgba(201,151,58,0.38)`, padding: '10px 11px' }}>
                        <div style={{ border: `1px solid rgba(201,151,58,0.14)`, padding: '8px 10px' }}>
                            {/* Logo mark */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                                <div style={{
                                    width: 28, height: 28,
                                    border: `2px solid ${C.amber}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{ color: C.amber, fontFamily: F.display, fontWeight: 700, fontSize: 14, lineHeight: 1 }}>N</span>
                                </div>
                                <span style={{ color: '#fff', fontFamily: F.display, fontWeight: 700, fontSize: 14, letterSpacing: '0.06em' }}>
                                    NEXUSBUILD
                                </span>
                            </div>
                            {/* Revision tag */}
                            <div style={{
                                color: 'rgba(255,255,255,0.3)', fontFamily: F.display, fontWeight: 500,
                                fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
                            }}>
                                CLIENT PORTAL &nbsp;/&nbsp; REV.1
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                    {/* Section label */}
                    <div style={{
                        padding: '4px 12px 10px',
                        fontFamily: F.display, fontWeight: 500, fontSize: 8,
                        letterSpacing: '0.22em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.2)',
                    }}>
                        Navigation
                    </div>

                    {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
                            {({ isActive }) => (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 12px',
                                    borderLeft: `3px solid ${isActive ? C.amber : 'transparent'}`,
                                    paddingLeft: isActive ? 9 : 12,
                                    color: isActive ? C.amber : 'rgba(255,255,255,0.5)',
                                    fontFamily: F.display, fontWeight: 600, fontSize: 11,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    transition: 'all 0.12s',
                                    background: isActive ? 'rgba(201,151,58,0.07)' : 'transparent',
                                    cursor: 'pointer',
                                }}>
                                    <Icon size={13} />
                                    <span style={{ flex: 1 }}>{label}</span>
                                    {isActive && (
                                        <div style={{ width: 4, height: 4, background: C.amber, borderRadius: '50%' }} />
                                    )}
                                </div>
                            )}
                        </NavLink>
                    ))}

                    <div style={{
                        marginTop: 14,
                        padding: '4px 12px 10px',
                        fontFamily: F.display, fontWeight: 500, fontSize: 8,
                        letterSpacing: '0.22em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.2)',
                    }}>
                        Public Site
                    </div>
                    <NavLink to="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 12px',
                            borderLeft: `3px solid transparent`,
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: F.display, fontWeight: 600, fontSize: 11,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            transition: 'all 0.12s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                        >
                            <Globe size={13} />
                            <span style={{ flex: 1 }}>Home / Projects</span>
                        </div>
                    </NavLink>
                </nav>

                {/* User / Revision Block */}
                <div style={{ padding: '10px 14px 14px' }}>
                    <div style={{ border: `1px solid rgba(255,255,255,0.07)` }}>
                        {/* User row */}
                        <div style={{ padding: '10px 10px 8px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                            <div style={{
                                width: 30, height: 30, flexShrink: 0,
                                background: `linear-gradient(135deg, ${C.amber}, #7A5415)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: F.display, fontWeight: 700, fontSize: 13, color: '#fff',
                            }}>
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ color: '#fff', fontFamily: F.display, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {displayName}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.28)', fontFamily: F.display, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
                                    Premium Client
                                </div>
                            </div>
                        </div>
                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                padding: '8px', border: 'none', background: 'transparent',
                                color: 'rgba(232,64,64,0.7)', fontFamily: F.display, fontWeight: 600,
                                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'color 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = C.alert}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,64,64,0.7)'}
                        >
                            <LogOut size={11} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ══ MAIN AREA ════════════════════════════════════════════════════ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Top Header */}
                <header style={{
                    flexShrink: 0, height: 56,
                    background: C.paper,
                    borderBottom: `1px solid ${C.border}`,
                    padding: '0 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Greeting */}
                    <div>
                        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.steel, lineHeight: 1.1 }}>
                            Welcome back,&nbsp;
                            <span style={{ color: C.amber }}>{displayName}</span>
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 9, color: C.muted, marginTop: 3, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                        {/* Bell */}
                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
                                style={{
                                    position: 'relative', width: 36, height: 36,
                                    background: 'transparent', border: `1px solid ${C.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: C.steel, transition: 'all 0.12s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.color = C.amber; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.steel; }}
                            >
                                <Bell size={15} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -5, right: -5,
                                        width: 16, height: 16, borderRadius: '50%',
                                        background: C.alert, color: '#fff',
                                        fontSize: 9, fontFamily: F.display, fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Panel */}
                            {showNotif && (
                                <div style={{
                                    position: 'absolute', right: 0, top: 44, width: 300, zIndex: 50,
                                    background: '#fff', border: `1px solid ${C.border}`,
                                    boxShadow: '0 8px 32px rgba(18,21,28,0.12)',
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 14px', borderBottom: `1px solid ${C.border}`,
                                        background: C.steel,
                                    }}>
                                        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                            Notifications
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: C.amber, fontSize: 10, fontFamily: F.display, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em' }}>
                                                    Mark all read
                                                </button>
                                            )}
                                            <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <X size={13} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                                        {notifs.map((n, i) => (
                                            <div key={n.id} style={{
                                                padding: '11px 14px',
                                                borderBottom: i < notifs.length - 1 ? `1px solid ${C.border}` : 'none',
                                                background: n.unread ? 'rgba(201,151,58,0.04)' : 'transparent',
                                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                            }}>
                                                <AmberDot active={n.unread} />
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 12, color: C.steel }}>{n.title}</div>
                                                    <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{n.msg}</div>
                                                    <div style={{ fontFamily: F.mono, fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{n.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div ref={profileRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
                                style={{
                                    width: 36, height: 36, flexShrink: 0,
                                    background: `linear-gradient(135deg, ${C.amber}, #7A5415)`,
                                    border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: F.display, fontWeight: 700, fontSize: 14, color: '#fff',
                                    transition: 'opacity 0.12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </button>

                            {/* Profile Panel */}
                            {showProfile && (
                                <div style={{
                                    position: 'absolute', right: 0, top: 44, width: 268, zIndex: 50,
                                    background: '#fff', border: `1px solid ${C.border}`,
                                    boxShadow: '0 8px 32px rgba(18,21,28,0.12)',
                                }}>
                                    {/* Header */}
                                    <div style={{ background: C.iron, ...{
                                        backgroundImage: [
                                            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                                            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                        ].join(','),
                                        backgroundSize: '16px 16px',
                                    }, padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                            <div style={{
                                                width: 40, height: 40,
                                                border: `2px solid ${C.amber}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.amber,
                                                flexShrink: 0,
                                            }}>
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                                    {displayName}
                                                </div>
                                                <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 8, color: C.amber, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 3 }}>
                                                    Premium Client
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Fields */}
                                    <div>
                                        {[
                                            { icon: Mail,     label: 'Email',        value: user?.email || '—' },
                                            { icon: Phone,    label: 'Phone',        value: profile?.phone_number || '—' },
                                            { icon: Calendar, label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—' },
                                            { icon: Shield,   label: 'Account No.',  value: DUMMY_USER_META.accountNo },
                                        ].map(({ icon: Icon, label, value }, i, arr) => (
                                            <div key={label} style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '10px 16px',
                                                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                                            }}>
                                                <Icon size={12} color={C.muted} style={{ flexShrink: 0 }} />
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</div>
                                                    <div style={{ fontFamily: F.body, fontSize: 12, color: C.steel, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Sign out */}
                                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 16px' }}>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%', padding: '8px', border: `1px solid rgba(232,64,64,0.25)`,
                                                background: 'rgba(232,64,64,0.04)', color: C.alert,
                                                fontFamily: F.display, fontWeight: 600, fontSize: 10,
                                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                cursor: 'pointer', transition: 'background 0.12s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,64,64,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,64,64,0.04)'}
                                        >
                                            <LogOut size={11} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', ...pageBg }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
