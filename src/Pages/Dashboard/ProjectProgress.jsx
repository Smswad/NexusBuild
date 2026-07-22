import { User, Building2, Calendar, DollarSign } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = { iron:'#12151C', amber:'#C9973A', green:'#0A3D2E', paper:'#F4F1EB', steel:'#2C3748', alert:'#E84040', border:'#D4CFC7', muted:'#6B6762' };
const F = { display:"'Barlow Semi Condensed', sans-serif", body:"'Barlow', sans-serif", mono:"'Roboto Mono', monospace" };

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const PROJECTS = [
    {
        id: 'PRJ-001',
        name: 'SARDAR TOWER – BLOCK A',
        type: 'High-Rise Residential',
        pm: 'Engr. Rafiq Hassan',
        start: 'Jan 2024', end: 'Dec 2026',
        budget: '$180,000',
        progress: 68,
        status: 'On Track',
        sc: C.green,
        milestones: [
            { label: 'Kick-off & Design Approval',  done: true,  date: 'Jan 2024' },
            { label: 'Foundation & Piling Works',   done: true,  date: 'Apr 2024' },
            { label: 'Ground Floor Structure',      done: true,  date: 'Aug 2024' },
            { label: 'Upper Floors – Frame',        done: true,  date: 'Mar 2025' },
            { label: 'Roofing & Waterproofing',     done: false, date: 'Sep 2025' },
            { label: 'MEP Rough-In Works',          done: false, date: 'Jan 2026' },
            { label: 'Interior Fit-Out',            done: false, date: 'Jul 2026' },
            { label: 'Handover & Snag Clearance',   done: false, date: 'Dec 2026' },
        ],
    },
    {
        id: 'PRJ-002',
        name: 'GREEN VALLEY RESIDENCY',
        type: 'Low-Rise Residential Complex',
        pm: 'Engr. Tasnim Akter',
        start: 'Jun 2025', end: 'May 2027',
        budget: '$95,000',
        progress: 45,
        status: 'On Track',
        sc: C.green,
        milestones: [
            { label: 'Site Survey & Planning Approval', done: true,  date: 'Jun 2025' },
            { label: 'Foundation Works',                done: true,  date: 'Sep 2025' },
            { label: 'Ground & First Floor Structure',  done: true,  date: 'Dec 2025' },
            { label: 'External Facade & Windows',       done: false, date: 'Apr 2026' },
            { label: 'Interior Fit-Out',                done: false, date: 'Oct 2026' },
            { label: 'Landscaping & External Works',    done: false, date: 'Feb 2027' },
            { label: 'Handover',                        done: false, date: 'May 2027' },
        ],
    },
    {
        id: 'PRJ-003',
        name: 'NEXUS PLAZA – PHASE 1',
        type: 'Commercial Development',
        pm: 'Engr. Karim Uddin',
        start: 'Mar 2022', end: 'Feb 2024',
        budget: '$45,000',
        progress: 100,
        status: 'Completed',
        sc: C.steel,
        milestones: [
            { label: 'Design & Approvals',   done: true, date: 'Mar 2022' },
            { label: 'Foundation',           done: true, date: 'Jun 2022' },
            { label: 'Structural Works',     done: true, date: 'Nov 2022' },
            { label: 'Interior & MEP',       done: true, date: 'Jul 2023' },
            { label: 'External Works',       done: true, date: 'Nov 2023' },
            { label: 'Handover',             done: true, date: 'Feb 2024' },
        ],
    },
];

// ─── Milestone Rail ───────────────────────────────────────────────────────────
const circledNum = (n) => ['①','②','③','④','⑤','⑥','⑦','⑧'][n] || `${n + 1}`;

const MilestoneRail = ({ milestones, statusColor }) => {
    const activeIdx = milestones.findIndex(m => !m.done);
    return (
        <div>
            {/* Horizontal connector track */}
            <div style={{ position: 'relative', padding: '0 0 0 0' }}>
                {/* The track line */}
                <div style={{
                    position: 'absolute',
                    top: 11, left: 16, right: 16,
                    height: 1,
                    background: C.border,
                    zIndex: 0,
                }} />
                {/* Filled portion */}
                <div style={{
                    position: 'absolute',
                    top: 11, left: 16,
                    height: 1,
                    width: milestones.length > 1
                        ? `calc(${(Math.max(0, activeIdx < 0 ? milestones.length - 1 : activeIdx - 0.5) / (milestones.length - 1)) * 100}% - 16px)`
                        : '0%',
                    background: statusColor,
                    zIndex: 1,
                }} />
                {/* Stops */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    {milestones.map((m, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, maxWidth: 64 }}>
                            {/* Number stop */}
                            <div style={{
                                width: 22, height: 22, flexShrink: 0,
                                border: `2px solid ${m.done ? statusColor : C.border}`,
                                background: m.done ? statusColor : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: F.mono, fontWeight: 600, fontSize: 9,
                                color: m.done ? '#fff' : (i === activeIdx ? C.amber : C.muted),
                                ...(i === activeIdx && !m.done ? { borderColor: C.amber, boxShadow: `0 0 0 3px rgba(201,151,58,0.18)` } : {}),
                            }}>
                                {circledNum(i)}
                            </div>
                            {/* Label */}
                            <div style={{
                                fontFamily: F.display, fontWeight: 600, fontSize: 8,
                                color: m.done ? statusColor : (i === activeIdx ? C.amber : C.muted),
                                letterSpacing: '0.05em', textTransform: 'uppercase',
                                textAlign: 'center', lineHeight: 1.3, maxWidth: 60,
                            }}>
                                {m.label}
                            </div>
                            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.muted }}>{m.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Site Brief Card ──────────────────────────────────────────────────────────
const SiteBriefCard = ({ project: p }) => {
    const gridBg = {
        backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '20px 20px',
    };

    return (
        <div style={{ border: `1px solid ${C.border}`, overflow: 'hidden' }}>

            {/* ── Title Block Header ── */}
            <div style={{ background: C.iron, ...gridBg }}>
                {/* Project ID strip */}
                <div style={{
                    padding: '6px 18px',
                    borderBottom: `1px solid rgba(201,151,58,0.2)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <span style={{ fontFamily: F.mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
                        {p.id} / {p.type.toUpperCase()}
                    </span>
                    <span style={{
                        fontFamily: F.display, fontWeight: 700, fontSize: 9,
                        padding: '2px 8px', letterSpacing: '0.14em',
                        border: `1px solid ${p.sc}`, color: p.sc,
                        textTransform: 'uppercase',
                    }}>
                        {p.status}
                    </span>
                </div>
                {/* Project name */}
                <div style={{ padding: '12px 18px 14px' }}>
                    <div style={{
                        fontFamily: F.display, fontWeight: 700, fontSize: 18,
                        color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase',
                        lineHeight: 1.1,
                    }}>
                        {p.name}
                    </div>
                </div>
            </div>

            {/* ── Data Cell Grid ── */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                background: C.border, gap: 1,
                borderBottom: `1px solid ${C.border}`,
            }}>
                {[
                    { icon: User,      label: 'Project Manager', value: p.pm },
                    { icon: DollarSign,label: 'Contract Budget',  value: p.budget },
                    { icon: Calendar,  label: 'Start Date',       value: p.start },
                    { icon: Calendar,  label: 'End Date',         value: p.end },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ background: '#fff', padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                            <Icon size={10} color={C.muted} />
                            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                {label}
                            </span>
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 13, color: C.steel }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* ── Progress + Milestone Rail ── */}
            <div style={{ background: '#fff', padding: '18px 20px 20px' }}>
                {/* Overall bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', flexShrink: 0 }}>
                        Overall
                    </div>
                    <div style={{ flex: 1, height: 8, background: '#F0EDE7', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${p.progress}%`,
                            background: p.progress === 100 ? C.steel : C.green,
                        }} />
                    </div>
                    <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 14, color: p.sc, flexShrink: 0 }}>
                        {p.progress}%
                    </div>
                </div>

                {/* Milestone rail label */}
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
                    Phase Completion Rail
                </div>

                {/* The rail */}
                <MilestoneRail milestones={p.milestones} statusColor={p.sc} />
            </div>
        </div>
    );
};

// ─── Page Component ───────────────────────────────────────────────────────────
const ProjectProgress = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Page title */}
        <div>
            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
                Site Brief
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.steel, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Project Progress — {PROJECTS.length} Active Sites
            </div>
        </div>

        {/* Cards */}
        {PROJECTS.map(p => <SiteBriefCard key={p.id} project={p} />)}
    </div>
);

export default ProjectProgress;
