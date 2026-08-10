import { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
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

const FinancialLedger = () => {
    const { loading, financials, userProfile, downloadStatement } = useClientData();

    const exportStatementCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Installment No,Due Date,Amount (BDT),Status\n"
            + financials.installments.map(i => `"${i.installment}","${i.dueDate}","${i.amount}","${i.status}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Statement_${userProfile.name?.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 max-w-5xl animate-pulse">
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                    <div className="skeleton h-6 w-56 rounded bg-slate-200" />
                    <div className="skeleton h-36 w-full rounded bg-slate-100" />
                </div>
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                    <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                    <div className="skeleton h-48 w-full rounded bg-slate-100" />
                </div>
            </div>
        );
    }

    return (
        <>
            <PrintView financials={financials} userProfile={userProfile} />
            
            <div className="flex flex-col gap-6 print:hidden max-w-5xl text-slate-800">
                
                {/* ── Financial Ledger Overview (Center Column matching Figma) ── */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                    <div className="p-6 flex items-center justify-between border-b border-[#E2E8F0]">
                        <h2 className="text-[#003178] font-bold text-[18px]">Financial Ledger Overview</h2>
                        <div className="flex gap-3">
                            <button 
                                onClick={exportStatementCSV}
                                className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer text-slate-700"
                            >
                                <Download size={14} /> Export CSV
                            </button>
                            <button 
                                onClick={downloadStatement}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#003178] hover:bg-[#00255a] text-white rounded-lg font-bold text-xs cursor-pointer"
                            >
                                <Download size={14} /> Print Statement
                            </button>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-[#E2E8F0] px-6 py-2">
                        <div className="flex justify-between items-center py-4">
                            <span className="text-slate-600 font-medium">Total Property Valuation</span>
                            <span className="text-slate-800 font-bold text-base">৳ {financials.totalValuation}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-slate-600 font-medium">Total Amount Paid to Date</span>
                            <span className="text-[#006E1C] font-bold text-base">৳ {financials.totalPaid}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-slate-600 font-medium">Utility/Other Charges</span>
                            <span className="text-slate-800 font-bold text-base">৳ {financials.otherCharges}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-[#FDF2F2] rounded my-2 border border-red-100">
                            <span className="text-[#9B1C1C] font-bold">Current Due Balance</span>
                            <span className="text-[#9B1C1C] font-bold text-lg">৳ {financials.dueBalance}</span>
                        </div>
                    </div>
                </div>

                {/* ── Installment Schedule Table ── */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#E2E8F0]">
                        <h2 className="text-[#003178] font-bold text-[18px]">Installment Schedule</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F7F9FB] border-b border-[#E2E8F0]">
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Installment No.</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount (৳)</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                                {financials.installments.map((t) => (
                                    <tr key={t.id} className={`hover:bg-slate-50 ${t.active ? 'bg-blue-50/30 border-l-4 border-l-[#003178]' : 'border-l-4 border-l-transparent'}`}>
                                        <td className={`py-4 px-6 text-sm font-medium ${t.active ? 'text-slate-800 font-bold' : 'text-slate-700'}`}>
                                            {t.installment}
                                        </td>
                                        <td className={`py-4 px-6 text-sm ${t.active ? 'text-[#003178] font-bold' : 'text-slate-500'}`}>
                                            {t.dueDate}
                                        </td>
                                        <td className={`py-4 px-6 text-sm font-bold text-right ${t.active ? 'text-slate-800' : 'text-slate-700'}`}>
                                            ৳ {t.amount}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${t.statusPill}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent Transactions ── */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6">
                    <h2 className="text-[#003178] font-bold text-[18px] mb-5">Recent Transactions</h2>
                    
                    <div className="flex flex-col gap-5">
                        {financials.transactions.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-[#DEF7EC] flex items-center justify-center text-[#03543F] flex-shrink-0">
                                    <CheckCircle size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-800 text-sm">৳ {item.amount}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 truncate">{item.date} • {item.type}</div>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#003178] hover:bg-blue-100 transition-colors">
                                    <FileText size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default FinancialLedger;
