import { Download, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = { iron:'#12151C', amber:'#C9973A', green:'#0A3D2E', paper:'#F4F1EB', steel:'#2C3748', alert:'#E84040', border:'#D4CFC7', muted:'#6B6762' };
const F = { display:"'Barlow Semi Condensed', sans-serif", body:"'Barlow', sans-serif", mono:"'Roboto Mono', monospace" };

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const CLIENT = { name: 'John Sardar', accountNo: 'NXB-2024-001', contractValue: 320000, totalPaid: 214900, balance: 105100, statementDate: 'July 2026' };

const TRANSACTIONS = [
    { id: 'TXN-001', date: '15 May 2026', desc: 'Initial Advance Payment',             type: 'Payment',    amount: -50000, status: 'Paid' },
    { id: 'TXN-002', date: '01 Jun 2026', desc: 'Material Procurement Fee',             type: 'Charge',     amount: -3400,  status: 'Paid' },
    { id: 'TXN-003', date: '15 Jun 2026', desc: 'Progress Payment – 30%',              type: 'Payment',    amount: -18500, status: 'Paid' },
    { id: 'TXN-004', date: '01 Jul 2026', desc: 'Q2 Statement Adjustment (credit)',    type: 'Adjustment', amount: +1200,  status: 'Processed' },
    { id: 'TXN-005', date: '15 Jul 2026', desc: 'Milestone Payment – Foundation Done', type: 'Payment',    amount: -25000, status: 'Paid' },
    { id: 'TXN-006', date: '01 Aug 2026', desc: 'Phase 2 Mobilisation Fee',            type: 'Charge',     amount: -5000,  status: 'Pending' },
    { id: 'TXN-007', date: '15 Aug 2026', desc: 'Progress Payment – 50%',              type: 'Payment',    amount: -28000, status: 'Pending' },
    { id: 'TXN-008', date: '30 Jul 2026', desc: 'VAT on Services – Q2',                type: 'Tax',        amount: -4500,  status: 'Due' },
];

const STATUS_CONFIG = {
    Paid:      { color: C.green,  icon: CheckCircle2 },
    Processed: { color: C.steel,  icon: CheckCircle2 },
    Pending:   { color: '#92400E', icon: Clock },
    Due:       { color: C.alert,  icon: AlertCircle },
};

const fmt = (n) => (n < 0 ? '-' : '+') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
const fmtDollar = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

// ─── PDF print ────────────────────────────────────────────────────────────────
const printStatement = (rows, title) => {
    const rowsHtml = rows.map(t => `
        <tr>
            <td style="font-family:'Courier New',monospace">${t.id}</td>
            <td style="font-family:'Courier New',monospace">${t.date}</td>
            <td>${t.desc}</td>
            <td>${t.type}</td>
            <td style="text-align:right;font-family:'Courier New',monospace;font-weight:600;color:${t.amount < 0 ? '#1a1a1a' : '#0A3D2E'}">${fmt(t.amount)}</td>
            <td style="text-align:center">${t.status}</td>
        </tr>`).join('');
    const win = window.open('', '_blank');
    win.document.write(`
        <html><head><title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; font-size: 12px; padding: 40px; color: #2C3748; background: #F4F1EB; }
            .header { border: 2px solid #C9973A; padding: 16px; margin-bottom: 24px; }
            .header h2 { margin: 0 0 4px; color: #12151C; font-size: 18px; letter-spacing: 0.06em; }
            .header p { margin: 2px 0; color: #6B6762; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #D4CFC7; margin-bottom: 24px; }
            .sum-cell { background: #fff; padding: 12px 16px; }
            .sum-cell .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.18em; color: #6B6762; margin-bottom: 4px; }
            .sum-cell .val { font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #2C3748; }
            table { width: 100%; border-collapse: collapse; background: #fff; }
            th { background: #2C3748; color: #fff; text-align: left; padding: 9px 12px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em; }
            td { padding: 9px 12px; border-bottom: 1px solid #F0EDE7; }
            .footer { margin-top: 32px; font-size: 9px; color: #aaa; text-align: center; letter-spacing: 0.12em; text-transform: uppercase; }
        </style></head>
        <body>
            <div class="header">
                <h2>NEXUSBUILD — ${title}</h2>
                <p>Client: ${CLIENT.name} &nbsp;|&nbsp; Account: ${CLIENT.accountNo} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="summary">
                <div class="sum-cell"><div class="lbl">Contract Value</div><div class="val">${fmtDollar(CLIENT.contractValue)}</div></div>
                <div class="sum-cell"><div class="lbl">Total Paid</div><div class="val">${fmtDollar(CLIENT.totalPaid)}</div></div>
                <div class="sum-cell"><div class="lbl">Balance Due</div><div class="val">${fmtDollar(CLIENT.balance)}</div></div>
            </div>
            <table>
                <thead><tr><th>ID</th><th>Date</th><th>Description</th><th>Type</th><th style="text-align:right">Amount</th><th style="text-align:center">Status</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="footer">NexusBuild Client Portal &mdash; Confidential &mdash; ${new Date().getFullYear()}</div>
        </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
};

// ─── Shared header ────────────────────────────────────────────────────────────
const PanelHeader = ({ title }) => (
    <div style={{
        padding: '11px 18px', background: C.steel,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        fontFamily: F.display, fontWeight: 700, fontSize: 11,
        color: '#fff', letterSpacing: '0.14em', textTransform: 'uppercase',
    }}>{title}</div>
);

// ─── Component ─────────────────────────────────────────────────────────────────
const FinancialLedger = () => {
    const paidPct = Math.round((CLIENT.totalPaid / CLIENT.contractValue) * 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* ── Page title row ───────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
                        Statement Period
                    </div>
                    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.steel, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {CLIENT.statementDate}
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginTop: 3 }}>
                        Acct: {CLIENT.accountNo}
                    </div>
                </div>
                <button
                    onClick={() => printStatement(TRANSACTIONS, 'Account Statement – ' + CLIENT.statementDate)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px',
                        background: C.iron, border: `1px solid ${C.amber}`,
                        color: C.amber, fontFamily: F.display, fontWeight: 700,
                        fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.amber.replace(')', ', 0.1)').replace('rgb', 'rgba')}
                    onMouseLeave={e => e.currentTarget.style.background = C.iron}
                >
                    <Download size={13} /> Download Statement
                </button>
            </div>

            {/* ── Summary figures ──────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: `1px solid ${C.border}` }}>
                {[
                    { label: 'Contract Value', value: fmtDollar(CLIENT.contractValue), accent: C.amber },
                    { label: 'Amount Paid',    value: fmtDollar(CLIENT.totalPaid),     accent: C.green },
                    { label: 'Balance Due',    value: fmtDollar(CLIENT.balance),       accent: C.alert },
                ].map(({ label, value, accent }, i, arr) => (
                    <div key={label} style={{
                        background: '#fff', padding: '20px 22px',
                        borderTop: `3px solid ${accent}`,
                        borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}>
                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                            {label}
                        </div>
                        <div style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 24, color: C.steel }}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Budget Elevation Bar (Signature sub-element) ─────────────── */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}` }}>
                <PanelHeader title="Budget Allocation Track" />
                <div style={{ padding: '18px 22px' }}>
                    {/* Labels above */}
                    <div style={{ display: 'flex', marginBottom: 6 }}>
                        <div style={{ width: `${paidPct}%`, fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.green, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                            ← Paid {paidPct}%
                        </div>
                        <div style={{ flex: 1, fontFamily: F.display, fontWeight: 600, fontSize: 9, color: C.muted, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'right' }}>
                            Remaining {100 - paidPct}% →
                        </div>
                    </div>
                    {/* The bar track */}
                    <div style={{ height: 28, display: 'flex', border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative' }}>
                        {/* Paid – solid green */}
                        <div style={{
                            width: `${paidPct}%`, height: '100%',
                            background: C.green,
                            position: 'relative', flexShrink: 0,
                        }}>
                            {/* Tick marks */}
                            {[25, 50, 75].filter(t => t < paidPct).map(t => (
                                <div key={t} style={{
                                    position: 'absolute', top: 0, bottom: 0,
                                    left: `${(t / paidPct) * 100}%`,
                                    width: 1, background: 'rgba(255,255,255,0.2)',
                                }} />
                            ))}
                        </div>
                        {/* Remaining – diagonal hatch */}
                        <div style={{
                            flex: 1,
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(201,151,58,0.15), rgba(201,151,58,0.15) 3px, transparent 3px, transparent 9px)',
                            borderLeft: `2px solid ${C.amber}`,
                        }} />
                    </div>
                    {/* Dollar labels below */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.green }}>$0</span>
                        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted }}>
                            Paid: {fmtDollar(CLIENT.totalPaid)}&emsp;|&emsp;Balance: {fmtDollar(CLIENT.balance)}
                        </span>
                        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.steel }}>{fmtDollar(CLIENT.contractValue)}</span>
                    </div>
                </div>
            </div>

            {/* ── Transactions Table ───────────────────────────────────────── */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}` }}>
                <PanelHeader title={`All Transactions — ${TRANSACTIONS.length} Records`} />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: C.paper }}>
                            {['Ref ID', 'Date', 'Description', 'Type', 'Amount', 'Status', 'Receipt'].map((h, i) => (
                                <th key={h} style={{
                                    padding: '9px 18px',
                                    fontFamily: F.display, fontWeight: 600, fontSize: 8,
                                    color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase',
                                    textAlign: i === 4 ? 'right' : i >= 5 ? 'center' : 'left',
                                    borderBottom: `1px solid ${C.border}`,
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TRANSACTIONS.map((t, i) => {
                            const { color, icon: StatusIcon } = STATUS_CONFIG[t.status] || STATUS_CONFIG.Pending;
                            return (
                                <tr key={t.id} style={{ borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                    <td style={{ padding: '11px 18px', fontFamily: F.mono, fontSize: 10, color: C.muted }}>{t.id}</td>
                                    <td style={{ padding: '11px 18px', fontFamily: F.mono, fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{t.date}</td>
                                    <td style={{ padding: '11px 18px', fontFamily: F.body, fontSize: 12, color: C.steel }}>{t.desc}</td>
                                    <td style={{ padding: '11px 18px', fontFamily: F.display, fontSize: 9, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.type}</td>
                                    <td style={{ padding: '11px 18px', fontFamily: F.mono, fontWeight: 500, fontSize: 12, color: t.amount < 0 ? C.steel : C.green, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        {fmt(t.amount)}
                                    </td>
                                    <td style={{ padding: '11px 18px', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            fontFamily: F.display, fontWeight: 600, fontSize: 9,
                                            letterSpacing: '0.12em', textTransform: 'uppercase',
                                            padding: '3px 8px', border: `1px solid ${color}`, color,
                                        }}>
                                            <StatusIcon size={9} /> {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '11px 18px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => printStatement([t], `Receipt – ${t.id}`)}
                                            title="Download receipt"
                                            style={{
                                                width: 28, height: 28, display: 'inline-flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                background: 'transparent',
                                                border: `1px solid ${C.border}`, color: C.muted,
                                                cursor: 'pointer', transition: 'all 0.12s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.color = C.amber; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                                        >
                                            <FileText size={12} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialLedger;
