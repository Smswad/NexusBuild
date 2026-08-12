import { useState } from 'react';
import { 
    CheckCircle2, Circle, Lock, Download, 
    CheckCircle, FileText, Mail, Phone, Send, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router';
import heroImg from '../../assets/pics/hero_pic.png';
import { useClientData } from '../../Context/ClientDataContext';

const PrintView = ({ financials, userProfile }) => (
    <div id="print-area" className="hidden print:block bg-white text-slate-800 p-12 font-sans max-w-4xl mx-auto border border-slate-300 rounded shadow-sm">
        {/* Corporate Header Banner */}
        <div className="flex justify-between items-start border-b border-slate-350 pb-8 mb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#003178] rounded flex items-center justify-center font-black text-xl text-white">R</div>
                    <div>
                        <h1 className="font-extrabold text-2xl tracking-wider text-[#003178] leading-none">RELIANCE HOUSING LTD.</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Premier Property & Infrastructure Solutions</p>
                    </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                    Chashiara, Narayanganj • contact@reliancehousing.com • +880 1800-000000
                </div>
            </div>
            <div className="text-right space-y-1">
                <span className="px-3 py-1 bg-slate-100 text-[#003178] text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                    Client Copy
                </span>
                <h2 className="text-xl font-black text-slate-800 tracking-wide mt-3 uppercase">STATEMENT OF ACCOUNT</h2>
                <div className="text-[11px] text-slate-500 font-medium">Issue Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
        </div>

        {/* Client & Allocation Details Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
            <div className="space-y-2">
                <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Prepared For</h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/60">
                    <p className="text-sm font-bold text-slate-800">{userProfile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Email: {userProfile.email || 'N/A'}</p>
                    <p className="text-xs text-slate-500">Phone: {userProfile.phone || 'N/A'}</p>
                </div>
            </div>
            <div className="space-y-2 text-right">
                <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Allocation Reference</h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/60 text-right">
                    <p className="text-sm font-bold text-slate-800">{financials.unitName || 'Pending Unit Assignment'}</p>
                    <p className="text-xs text-slate-500 mt-1">Project Name: Sardar Tower Block-A</p>
                    <p className="text-xs text-slate-500">Scheduled Handover: Jan 2027</p>
                </div>
            </div>
        </div>

        {/* Financial Summary KPI Cards */}
        <div className="mb-10">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-3">Financial Standing</h3>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Contract Value</span>
                    <span className="text-base font-bold text-slate-800 mt-1 block">৳ {financials.totalValuation}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Other charges</span>
                    <span className="text-base font-bold text-slate-800 mt-1 block">৳ {financials.otherCharges}</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 text-center">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Total Settled</span>
                    <span className="text-base font-extrabold text-emerald-700 mt-1 block">৳ {financials.totalPaid}</span>
                </div>
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 text-center">
                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider block">Due Balance</span>
                    <span className="text-base font-extrabold text-red-700 mt-1 block">৳ {financials.dueBalance}</span>
                </div>
            </div>
        </div>

        {/* Installment Breakdown Ledger */}
        <div className="space-y-3">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Installment Breakdown</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-gray-300 bg-slate-100">
                            <th className="py-2.5 px-4 font-bold text-gray-600">Installment No.</th>
                            <th className="py-2.5 px-4 font-bold text-gray-600">Due Date</th>
                            <th className="py-2.5 px-4 font-bold text-gray-600 text-right">Amount</th>
                            <th className="py-2.5 px-4 font-bold text-gray-600 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {financials.installments.map((t) => (
                            <tr key={t.id}>
                                <td className="py-2 px-4 font-semibold text-gray-700">{t.installment}</td>
                                <td className="py-2 px-4 text-gray-500">{t.dueDate}</td>
                                <td className="py-2 px-4 font-bold text-gray-800 text-right">৳ {t.amount}</td>
                                <td className={`py-2 px-4 font-bold text-right ${t.status === 'Paid' ? 'text-emerald-600' : t.status === 'Overdue' ? 'text-red-600' : 'text-blue-600'}`}>{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200">
            <div className="text-center">
                <div className="w-32 border-b border-gray-400 mb-1 mx-auto"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Signature</span>
            </div>
            <div className="text-center">
                <div className="w-32 border-b border-gray-400 mb-1 mx-auto"></div>
                <span className="text-[9px] font-bold text-[#1A4B9C] uppercase tracking-wider">Authorized Officer</span>
            </div>
        </div>
    </div>
);

const Overview = () => {
    const navigate = useNavigate();
    const { loading, userProfile, financials, projects, downloadStatement, addInstallment } = useClientData();
    const activeProject = projects[0] || { progressPhase: 1 };

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [numInstallments, setNumInstallments] = useState(12);
    const [freq, setFreq] = useState('Monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const handleGenerateSchedule = async (e) => {
        e.preventDefault();
        const valuationStr = financials.totalValuation || '10000000';
        const valuation = parseFloat(valuationStr.replace(/,/g, '')) || 10000000;
        const installmentAmount = Math.round(valuation / numInstallments);

        let currentD = new Date(startDate);
        for (let i = 1; i <= numInstallments; i++) {
            const installmentName = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Installment`;
            const dateStr = currentD.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            
            await addInstallment({
                propertyId: financials.propertyId,
                installment: installmentName,
                dueDate: dateStr,
                amount: installmentAmount.toLocaleString('en-IN'),
                status: 'Pending',
                statusPill: 'bg-amber-100 text-amber-700',
                active: i === 1
            });

            if (freq === 'Monthly') {
                currentD.setMonth(currentD.getMonth() + 1);
            } else if (freq === 'Quarterly') {
                currentD.setMonth(currentD.getMonth() + 3);
            } else if (freq === 'Semi-Annually') {
                currentD.setMonth(currentD.getMonth() + 6);
            }
        }
        setShowScheduleModal(false);
        alert('Installment schedule generated successfully!');
    };
    
    if (loading) {
        return (
            <div className="flex gap-6 items-start animate-pulse">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 pb-8 flex flex-col gap-4">
                        <div className="skeleton h-6 w-64 rounded bg-slate-200" />
                        <div className="skeleton h-16 w-full rounded-lg bg-slate-100" />
                    </div>
                    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                        <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                        <div className="skeleton h-32 w-full rounded bg-slate-100" />
                    </div>
                    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                        <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                        <div className="skeleton h-48 w-full rounded bg-slate-100" />
                    </div>
                </div>
                <div className="w-[360px] flex-shrink-0 flex flex-col gap-6">
                    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                        <div className="skeleton h-48 w-full rounded-lg bg-slate-200" />
                        <div className="skeleton h-12 w-full rounded bg-slate-100" />
                    </div>
                    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                        <div className="skeleton h-6 w-40 rounded bg-slate-200" />
                        <div className="skeleton h-32 w-full rounded bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <PrintView financials={financials} userProfile={userProfile} />
            <div className="flex gap-6 items-start print:hidden">
            {/* ══ CENTER COLUMN (Flexible Main Content) ════════════════════════ */}
            <div className="flex-1 flex flex-col gap-6">
                
                {/* 1. Construction Progress Card */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 pb-8">
                    <h2 className="text-[#003178] font-bold text-[18px] mb-10">{activeProject?.name || 'Project'} Construction Progress</h2>
                    
                    <div className="relative mt-8">
                        {/* Connecting Lines */}
                        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-[#E2E8F0] z-0 rounded-full overflow-hidden">
                            <div className="h-full bg-[#006E1C] transition-all duration-500 ease-out" style={{ 
                                width: `${(Math.max(0, ((activeProject?.progressPhase && activeProject.progressPhase <= 4 ? activeProject.progressPhase : 3) - 1)) / 3) * 100}%` 
                            }} />
                        </div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            {[
                                { id: 1, name: 'Piling &\nFoundation' },
                                { id: 2, name: 'Structural\nCasting' },
                                { id: 3, name: 'Finishing' },
                                { id: 4, name: 'Handover' },
                            ].map(step => {
                                const oPhases = activeProject?.phases || [];
                                const oIncomplete = oPhases.find(p => p.progress < 100);
                                const oRaw = activeProject?.progressPhase || activeProject?.progress_phase;
                                const currentP = oRaw && oRaw <= 4 
                                    ? oRaw 
                                    : (oIncomplete ? oIncomplete.id : (oPhases.length || 3));
                                const isCompleted = currentP > step.id;
                                const isCurrent = currentP === step.id;
                                return (
                                    <div key={step.id} className="flex flex-col items-center flex-1">
                                        {isCompleted ? (
                                            <div className="w-9 h-9 rounded-full bg-[#006E1C] border-2 border-[#006E1C] flex items-center justify-center text-white z-10 relative shadow-sm">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : isCurrent ? (
                                            <div className="w-9 h-9 rounded-full bg-white border-4 border-[#003178] flex items-center justify-center z-10 relative shadow-md">
                                                <div className="w-3.5 h-3.5 rounded-full bg-[#003178] animate-pulse" />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#CBD5E1] flex items-center justify-center text-slate-400 font-bold text-xs z-10 relative">
                                                {step.id}
                                            </div>
                                        )}
                                        <div className={`text-[11px] uppercase tracking-wider text-center mt-4 whitespace-pre-line ${
                                            isCurrent 
                                                ? 'font-bold text-[#003178]' 
                                                : isCompleted 
                                                ? 'font-semibold text-[#006E1C]' 
                                                : 'font-medium text-slate-400'
                                        }`}>
                                            {step.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Financial Ledger Overview */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                    <div className="p-6 pb-2 flex justify-between items-center">
                        <h2 className="text-[#003178] font-bold text-[18px]">Financial Ledger Overview</h2>
                        <button onClick={downloadStatement} className="flex items-center gap-2 text-sm font-bold text-[#003178] hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                            Statement <Download size={16} />
                        </button>
                    </div>
                    
                    <div className="p-6 pt-2">
                        <div className="border-t border-[#E2E8F0]" />
                        
                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Total Property Valuation</span>
                            <span className="text-slate-800 font-bold text-[15px]">৳ {financials.totalValuation}</span>
                        </div>
                        <div className="border-t border-[#E2E8F0]" />

                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Total Amount Paid to Date</span>
                            <span className="text-[#006E1C] font-bold text-[15px]">৳ {financials.totalPaid}</span>
                        </div>
                        <div className="border-t border-[#E2E8F0]" />

                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Utility/Other Charges</span>
                            <span className="text-slate-800 font-bold text-[15px]">৳ {financials.otherCharges}</span>
                        </div>
                        
                        {/* Highlighted Row for Due Balance */}
                        <div className="py-4 px-4 -mx-4 bg-[#FDF2F2] flex justify-between items-center border-y border-[#E2E8F0]">
                            <span className="text-slate-800 font-medium">Current Due Balance</span>
                            <span className="text-[#9B1C1C] font-bold text-[16px]">৳ {financials.dueBalance}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Installment Schedule Table */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-[#003178] font-bold text-[18px]">Installment Schedule</h2>
                    </div>
                    
                    {(!financials.installments || financials.installments.length === 0) ? (
                        <div className="p-8 text-center flex flex-col items-center gap-4">
                            <Calendar size={48} className="text-[#003178] opacity-40" />
                            <div>
                                <h3 className="font-bold text-slate-800">No Installment Schedule Set</h3>
                                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                                    An installment schedule has not been configured for your property yet. You can create your schedule now.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowScheduleModal(true)} 
                                className="px-5 py-2 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white font-bold rounded-lg shadow transition-colors cursor-pointer"
                            >
                                Configure Installment Schedule
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F7F9FB] border-y border-[#E2E8F0]">
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Installment No.</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount (৳)</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {financials.installments.map((inst) => (
                                    <tr key={inst.id} className={inst.active ? "bg-blue-50/30 border-l-4 border-[#003178]" : "hover:bg-slate-50"}>
                                        <td className={`py-4 px-6 text-sm ${inst.active ? 'text-slate-800 font-bold pl-5' : 'text-slate-700 font-medium'}`}>
                                            {inst.installment}
                                        </td>
                                        <td className={`py-4 px-6 text-sm ${inst.active ? 'text-[#003178] font-bold' : 'text-slate-500'}`}>
                                            {inst.dueDate}
                                        </td>
                                        <td className={`py-4 px-6 text-sm text-right ${inst.active ? 'text-slate-800 font-bold' : 'text-slate-700 font-bold'}`}>
                                            {inst.amount}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${inst.statusPill}`}>
                                                {inst.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>


            {/* ══ RIGHT COLUMN (Widgets - Fixed 360px) ═════════════════════════ */}
            <div className="w-[360px] flex-shrink-0 flex flex-col gap-6">
                
                {/* 1. Property Hero Card */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
                    {/* Image Area with Gradient */}
                    <div className="h-52 relative overflow-hidden flex items-end p-5">
                        <img 
                            src={userProfile.projectImage || heroImg} 
                            alt={userProfile.propertyName} 
                            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003178] via-[#003178]/60 to-transparent opacity-90 z-10" />
                        <div className="relative z-20 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded">
                                {userProfile.projectName}
                            </span>
                            <h3 className="text-white font-extrabold text-[18px] leading-snug">{userProfile.propertyName}</h3>
                            <p className="text-blue-100 text-xs font-medium">{userProfile.propertyLoc}</p>
                        </div>
                    </div>
                    {/* Info Pills */}
                    <div className="p-5 flex gap-4 text-sm bg-white border-b border-[#E2E8F0]">
                        <div className="flex flex-col gap-1 flex-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Area</span>
                            <span className="text-slate-800 font-extrabold text-sm">{userProfile.area}</span>
                        </div>
                        <div className="w-[1px] bg-[#E2E8F0]"></div>
                        <div className="flex flex-col gap-1 flex-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target Handover</span>
                            <span className="text-slate-800 font-extrabold text-sm">{userProfile.handoverDate}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Recent Transactions List */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[16px] text-slate-800">Recent Transactions</h3>
                        <button onClick={() => navigate('/dashboard/financials')} className="text-[#003178] text-sm font-bold hover:underline">
                            View All
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {financials.transactions.slice(0, 3).map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#DEF7EC] flex items-center justify-center text-[#03543F]">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-800">{tx.type}</div>
                                        <div className="text-xs text-slate-500">{tx.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm text-slate-800">৳ {tx.amount}</div>
                                    <button className="text-[10px] uppercase tracking-wider font-bold text-[#003178] mt-0.5 hover:underline flex items-center justify-end gap-1">
                                        <Download size={10} /> Receipt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 text-[#003178] font-bold text-sm text-center hover:underline">
                        View All History
                    </button>
                </div>

                {/* Dedicated Account Exec card removed */}
            </div>

            {/* Installment Scheduler Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-[#000f22]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
                        <div className="bg-[#003178] text-white p-6">
                            <h3 className="text-xl font-bold">Configure Installment Schedule</h3>
                            <p className="text-[#A0B2C6] text-sm mt-1">
                                Setup installment payments based on your property valuation: ৳ {financials.totalValuation || '10,00,000'}
                            </p>
                        </div>
                        <form onSubmit={handleGenerateSchedule} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Number of Installments</label>
                                <select 
                                    value={numInstallments} 
                                    onChange={(e) => setNumInstallments(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]"
                                >
                                    <option value={6}>6 Installments</option>
                                    <option value={12}>12 Installments (1 Year)</option>
                                    <option value={18}>18 Installments</option>
                                    <option value={24}>24 Installments (2 Years)</option>
                                    <option value={36}>36 Installments (3 Years)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Payment Frequency</label>
                                <select 
                                    value={freq} 
                                    onChange={(e) => setFreq(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]"
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Semi-Annually">Semi-Annually</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">First Payment Start Date</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#003178]"
                                    required 
                                />
                            </div>
                            <div className="flex gap-4 mt-4 justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white font-semibold rounded-md transition-colors cursor-pointer"
                                >
                                    Generate Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default Overview;
