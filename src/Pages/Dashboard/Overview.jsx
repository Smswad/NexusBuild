import { TrendingUp, Briefcase, DollarSign, Clock, ArrowUpRight } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = { iron:'#12151C', amber:'#C9973A', green:'#0A3D2E', paper:'#F4F1EB', steel:'#2C3748', alert:'#E84040', border:'#D4CFC7', muted:'#6B6762' };
const F = { display:"'Barlow Semi Condensed', sans-serif", body:"'Barlow', sans-serif", mono:"'Roboto Mono', monospace" };

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const STATS = [
    { label: 'Total Projects',  value: '3',       sub: 'Ongoing & completed',     icon: Briefcase,  accentColor: C.amber },
    { label: 'Active Projects', value: '2',       sub: 'Currently in progress',   icon: TrendingUp, accentColor: C.green },
    { label: 'Budget Used',     value: '68%',     sub: 'Of total contract value', icon: DollarSign, accentColor: C.amber },
    { label: 'Payment Due',     value: '$12,500', sub: 'Due 30 Jul 2026',         icon: Clock,      accentColor: C.alert },
];

const PROJECTS = [
    { name: 'Sardar Tower – Block A',  phase: 'Foundation & Structure', progress: 68,  status: 'On Track',  sc: C.green },
    { name: 'Green Valley Residency',  phase: 'Interior Fit-Out',       progress: 45,  status: 'On Track',  sc: C.green },
    { name: 'Nexus Plaza – Phase 1',   phase: 'Completed',              progress: 100, status: 'Complete',  sc: C.steel },
];

const TRANSACTIONS = [
    { date: '15 Jul 2026', desc: 'Milestone Payment – Foundation Complete', type: 'Payment',    amount: '-$25,000.00', sc: C.steel },
    { date: '01 Jul 2026', desc: 'Q2 Statement Adjustment',                 type: 'Adjustment', amount: '+$1,200.00',  sc: C.green },
    { date: '15 Jun 2026', desc: 'Progress Payment – 30%',                  type: 'Payment',    amount: '-$18,500.00', sc: C.steel },
    { date: '01 Jun 2026', desc: 'Material Procurement Fee',                type: 'Charge',     amount: '-$3,400.00',  sc: C.steel },
    { date: '15 May 2026', desc: 'Initial Advance Payment',                 type: 'Payment',    amount: '-$50,000.00', sc: C.steel },
];

// ─── Shared panel helpers ─────────────────────────────────────────────────────
const PanelHeader = ({ title, action, actionHref }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 18px',
        background: C.steel, borderBottom: `1px solid rgba(255,255,255,0.07)`,
    }}>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {title}
        </span>
        {action && (
            <a href={actionHref} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: F.display, fontWeight: 600, fontSize: 10,
                color: C.amber, letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none',
            }}>
                {action} <ArrowUpRight size={11} />
            </a>
        )}
    </div>
);

const Divider = () => <div style={{ borderBottom: `1px solid ${C.border}` }} />;

// ─── Component ─────────────────────────────────────────────────────────────────
const Overview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {STATS.map(({ label, value, sub, icon: Icon, accentColor }) => (
                <div key={label} style={{
                    background: '#fff',
                    border: `1px solid ${C.border}`,
                    borderTop: `3px solid ${accentColor}`,
                    padding: '18px 20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            {label}
                        </span>
                        <Icon size={14} color={accentColor} />
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                        <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 26, color: C.steel, lineHeight: 1 }}>
                            {value}
                        </div>
                        <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 5 }}>
                            {sub}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* ── Projects + Financial Summary ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>

            {/* Project Progress Panel */}
            <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                <PanelHeader title="Project Progress" action="View all" actionHref="/dashboard/progress" />
                <div>
                    {PROJECTS.map((p, i) => (
                        <div key={p.name}>
                            <div style={{ padding: '14px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 13, color: C.steel }}>{p.name}</div>
                                        <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{p.phase}</div>
                                    </div>
                                    <span style={{
                                        fontFamily: F.display, fontWeight: 600, fontSize: 9,
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        padding: '3px 8px',
                                        border: `1px solid ${p.sc}`,
                                        color: p.sc,
                                    }}>
                                        {p.status}
                                    </span>
                                </div>
                                {/* Structural fill bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ flex: 1, height: 6, background: '#F0EDE7', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0,
                                            width: `${p.progress}%`,
                                            background: p.progress === 100
                                                ? C.steel
                                                : `linear-gradient(90deg, ${C.green}, ${C.green}cc)`,
                                        }} />
                                    </div>
                                    <span style={{ fontFamily: F.mono, fontWeight: 500, fontSize: 11, color: C.muted, width: 32, textAlign: 'right' }}>
                                        {p.progress}%
                                    </span>
                                </div>
                            </div>
                            {i < PROJECTS.length - 1 && <Divider />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Summary Panel */}
            <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                <PanelHeader title="Financial Summary" />
                <div style={{ padding: '16px 18px' }}>
                    {/* Big balance number */}
                    <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                            Amount Paid to Date
                        </div>
                        <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 28, color: C.green }}>
                            $214,900
                        </div>
                        <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 3 }}>
                            of $320,000 contract value
                        </div>
                    </div>

                    {/* Rows */}
                    {[
                        { label: 'Contract Value',  value: '$320,000.00', highlight: false },
                        { label: 'Amount Paid',     value: '$214,900.00', highlight: true },
                        { label: 'Remaining',       value: '$105,100.00', highlight: false },
                        { label: 'Next Payment',    value: '$12,500.00',  highlight: false },
                        { label: 'Due Date',        value: '30 Jul 2026', highlight: false },
                    ].map(({ label, value, highlight }) => (
                        <div key={label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: `1px solid ${C.border}`,
                        }}>
                            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 10, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                {label}
                            </span>
                            <span style={{ fontFamily: F.mono, fontWeight: highlight ? 600 : 400, fontSize: 12, color: highlight ? C.green : C.steel }}>
                                {value}
                            </span>
                        </div>
                    ))}

                    {/* Progress track */}
                    <div style={{ marginTop: 16 }}>
                        <div style={{ height: 8, background: '#F0EDE7', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: '68%', background: C.green,
                            }} />
                            {/* Remaining hatched */}
                            <div style={{
                                position: 'absolute', left: '68%', right: 0, top: 0, bottom: 0,
                                backgroundImage: 'repeating-linear-gradient(45deg, rgba(201,151,58,0.18), rgba(201,151,58,0.18) 3px, transparent 3px, transparent 8px)',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.muted }}>PAID 68%</span>
                            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.muted }}>REMAINING 32%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Recent Transactions ──────────────────────────────────────────── */}
        <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
            <PanelHeader title="Recent Transactions" action="View all" actionHref="/dashboard/financials" />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: C.paper }}>
                        {['Date', 'Description', 'Type', 'Amount', 'Status'].map((h, i) => (
                            <th key={h} style={{
                                padding: '9px 18px',
                                fontFamily: F.display, fontWeight: 600, fontSize: 8,
                                color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase',
                                textAlign: i >= 3 ? 'right' : 'left',
                                borderBottom: `1px solid ${C.border}`,
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TRANSACTIONS.map((t, i) => (
                        <tr key={i} style={{ borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                            <td style={{ padding: '11px 18px', fontFamily: F.mono, fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{t.date}</td>
                            <td style={{ padding: '11px 18px', fontFamily: F.body, fontSize: 12, color: C.steel }}>{t.desc}</td>
                            <td style={{ padding: '11px 18px', fontFamily: F.display, fontSize: 10, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.type}</td>
                            <td style={{ padding: '11px 18px', fontFamily: F.mono, fontWeight: 500, fontSize: 12, color: t.sc, textAlign: 'right', whiteSpace: 'nowrap' }}>{t.amount}</td>
                            <td style={{ padding: '11px 18px', textAlign: 'right' }}>
                                <span style={{
                                    fontFamily: F.display, fontWeight: 600, fontSize: 9,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    padding: '3px 8px', border: `1px solid ${C.green}`, color: C.green,
                                }}>Paid</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default Overview;
