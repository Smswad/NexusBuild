import { useState } from 'react';
import { Send, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Clock, Phone, Mail, MessageSquare } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = { iron:'#12151C', amber:'#C9973A', green:'#0A3D2E', paper:'#F4F1EB', steel:'#2C3748', alert:'#E84040', border:'#D4CFC7', muted:'#6B6762' };
const F = { display:"'Barlow Semi Condensed', sans-serif", body:"'Barlow', sans-serif", mono:"'Roboto Mono', monospace" };

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const MY_TICKETS = [
    { id: 'TKT-0024', subject: 'Request for site visit schedule',  priority: 'Normal', status: 'Resolved',  date: '10 Jul 2026', sc: C.green },
    { id: 'TKT-0031', subject: 'Payment receipt not received',      priority: 'High',   status: 'Open',      date: '18 Jul 2026', sc: C.alert },
    { id: 'TKT-0035', subject: 'Change request – kitchen layout',  priority: 'Normal', status: 'In Review', date: '21 Jul 2026', sc: C.amber },
];

const FAQS = [
    { q: 'How often will I receive progress updates?',        a: 'You will receive a formal progress report every two weeks via email, plus real-time updates are available here in your Client Portal.' },
    { q: 'What payment methods are accepted?',                a: 'We accept bank transfers, cheques, and mobile banking (bKash, Nagad). All payment details are shown on your invoice.' },
    { q: 'How do I request a design change?',                 a: 'Submit a support ticket with your request. Our team will assess the impact on timeline and cost, and get back to you within 3 business days.' },
    { q: 'Can I visit the construction site?',                a: 'Yes. Please request a site visit through a support ticket at least 48 hours in advance. A safety induction is required on your first visit.' },
    { q: 'What does the warranty cover after handover?',      a: 'NexusBuild provides a 12-month defects liability period after handover, covering structural and finishing defects at no cost to you.' },
];

const PRIORITY_COLOR = { High: C.alert, Normal: C.steel, Low: C.green };
const STATUS_ICON    = { Resolved: CheckCircle2, Open: AlertCircle, 'In Review': Clock };

// ─── Panel Header ─────────────────────────────────────────────────────────────
const PanelHeader = ({ title, icon: Icon }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '11px 18px', background: C.steel,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
        {Icon && <Icon size={12} color={C.amber} />}
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {title}
        </span>
    </div>
);

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputStyle = {
    width: '100%', padding: '9px 12px',
    background: C.paper,
    border: 'none', borderBottom: `1px solid ${C.border}`,
    outline: 'none',
    fontFamily: F.body, fontSize: 12, color: C.steel,
    boxSizing: 'border-box',
    transition: 'border-color 0.12s',
};

// ─── Component ─────────────────────────────────────────────────────────────────
const Support = () => {
    const [form,      setForm]      = useState({ subject: '', priority: 'Normal', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq,   setOpenFaq]   = useState(null);
    const [focusedField, setFocused] = useState(null);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('[STUB] Ticket submitted:', form);
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setForm({ subject: '', priority: 'Normal', message: '' }); }, 3500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* ── Page title ── */}
            <div>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Client Services
                </div>
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.steel, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Support Centre
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 22 }}>

                {/* ── Left column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                    {/* New Ticket */}
                    <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                        <PanelHeader title="Submit New Ticket" icon={MessageSquare} />

                        {submitted ? (
                            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 44, height: 44,
                                    border: `2px solid ${C.green}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <CheckCircle2 size={22} color={C.green} />
                                </div>
                                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 14, color: C.steel, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Ticket Submitted
                                </div>
                                <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>
                                    Our team will respond within 24 hours.
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {/* Subject + Priority row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 14 }}>
                                    <div>
                                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                                            Subject
                                        </div>
                                        <input
                                            name="subject" value={form.subject} onChange={handleChange} required
                                            placeholder="Brief description of your request"
                                            style={{
                                                ...inputStyle,
                                                borderBottomColor: focusedField === 'subject' ? C.amber : C.border,
                                            }}
                                            onFocus={() => setFocused('subject')}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                                            Priority
                                        </div>
                                        <select
                                            name="priority" value={form.priority} onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                borderBottomColor: focusedField === 'priority' ? C.amber : C.border,
                                                cursor: 'pointer',
                                            }}
                                            onFocus={() => setFocused('priority')}
                                            onBlur={() => setFocused(null)}
                                        >
                                            <option>Low</option>
                                            <option>Normal</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                                        Message
                                    </div>
                                    <textarea
                                        name="message" value={form.message} onChange={handleChange} required rows={4}
                                        placeholder="Describe your issue or request in detail…"
                                        style={{
                                            ...inputStyle,
                                            resize: 'none',
                                            borderBottom: `1px solid ${focusedField === 'message' ? C.amber : C.border}`,
                                        }}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 8,
                                            padding: '10px 20px',
                                            background: C.iron, border: `1px solid ${C.amber}`,
                                            color: C.amber, fontFamily: F.display, fontWeight: 700,
                                            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,151,58,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = C.iron}
                                    >
                                        <Send size={12} /> Submit Ticket
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* My Tickets */}
                    <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                        <PanelHeader title={`My Tickets — ${MY_TICKETS.length} Records`} />
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: C.paper }}>
                                    {['Ref ID', 'Subject', 'Priority', 'Date', 'Status'].map((h, i) => (
                                        <th key={h} style={{
                                            padding: '9px 18px',
                                            fontFamily: F.display, fontWeight: 600, fontSize: 8,
                                            color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase',
                                            textAlign: i === 4 ? 'center' : 'left',
                                            borderBottom: `1px solid ${C.border}`,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MY_TICKETS.map((t, i) => {
                                    const StatusIcon = STATUS_ICON[t.status] || Clock;
                                    return (
                                        <tr key={t.id} style={{ borderBottom: i < MY_TICKETS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                            <td style={{ padding: '11px 18px', fontFamily: F.mono, fontSize: 10, color: C.muted }}>{t.id}</td>
                                            <td style={{ padding: '11px 18px', fontFamily: F.body, fontSize: 12, color: C.steel }}>{t.subject}</td>
                                            <td style={{ padding: '11px 18px' }}>
                                                <span style={{
                                                    fontFamily: F.display, fontWeight: 600, fontSize: 9,
                                                    color: PRIORITY_COLOR[t.priority], letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                }}>{t.priority}</span>
                                            </td>
                                            <td style={{ padding: '11px 18px', fontFamily: F.mono, fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{t.date}</td>
                                            <td style={{ padding: '11px 18px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    fontFamily: F.display, fontWeight: 600, fontSize: 9,
                                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                                    padding: '3px 8px', border: `1px solid ${t.sc}`, color: t.sc,
                                                }}>
                                                    <StatusIcon size={9} /> {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Right column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                    {/* Contact Panel — blueprint dark style */}
                    <div style={{ border: `1px solid ${C.border}` }}>
                        <div style={{
                            background: C.iron,
                            backgroundImage: [
                                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                                'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                            ].join(','),
                            backgroundSize: '16px 16px',
                            padding: '18px 20px 16px',
                        }}>
                            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 9, color: C.amber, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6 }}>
                                Direct Contact
                            </div>
                            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.04em' }}>
                                Urgent help?
                            </div>
                            <div style={{ fontFamily: F.body, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.5 }}>
                                Contact your dedicated project manager directly.
                            </div>
                        </div>
                        <div style={{ background: '#fff' }}>
                            {[
                                { icon: Phone, label: 'Call',  value: '+880 1700-000000' },
                                { icon: Mail,  label: 'Email', value: 'support@nexusbuild.com' },
                                { icon: Clock, label: 'Hours', value: 'Sun–Thu  09:00–18:00' },
                            ].map(({ icon: Icon, label, value }, i, arr) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 20px',
                                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                                }}>
                                    <Icon size={13} color={C.amber} style={{ flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 8, color: C.muted, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</div>
                                        <div style={{ fontFamily: F.body, fontSize: 12, color: C.steel, marginTop: 1 }}>{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ — Technical Notes style */}
                    <div style={{ border: `1px solid ${C.border}`, background: '#fff' }}>
                        <PanelHeader title="Technical Notes / FAQ" />
                        <div>
                            {FAQS.map((f, i) => (
                                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                                            padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.amber, flexShrink: 0 }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 12, color: openFaq === i ? C.amber : C.steel, letterSpacing: '0.02em' }}>
                                                {f.q}
                                            </span>
                                        </div>
                                        {openFaq === i
                                            ? <ChevronUp size={13} color={C.amber} style={{ flexShrink: 0 }} />
                                            : <ChevronDown size={13} color={C.muted} style={{ flexShrink: 0 }} />
                                        }
                                    </button>
                                    {openFaq === i && (
                                        <div style={{
                                            padding: '0 18px 14px 40px',
                                            fontFamily: F.body, fontSize: 12, color: C.muted, lineHeight: 1.7,
                                        }}>
                                            {f.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
