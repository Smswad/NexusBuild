import { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useClientData } from '../../Context/ClientDataContext';

const PrintView = ({ financials, userProfile }) => (
    <div id="print-area" className="hidden print:block bg-white text-black p-10 font-sans">
        <div className="flex justify-between items-start border-b border-gray-300 pb-8 mb-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-lg">N</div>
                    <span className="font-bold text-xl tracking-widest uppercase">Reliance Housing LTD</span>
                </div>
                <div className="text-sm text-gray-600">Client Portal Account Statement</div>
            </div>
            <div className="text-right">
                <div className="font-bold text-lg mb-1">Statement Date: {new Date().toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Client: {userProfile.name}</div>
            </div>
        </div>

        <table className="w-full text-left border-collapse mb-8">
            <thead>
                <tr className="border-b-2 border-black">
                    <th className="py-2 text-xs uppercase tracking-wider text-gray-600">Installment No.</th>
                    <th className="py-2 text-xs uppercase tracking-wider text-gray-600">Due Date</th>
                    <th className="py-2 text-xs uppercase tracking-wider text-gray-600 text-right">Amount (৳)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {financials.installments.map((t) => (
                    <tr key={t.id}>
                        <td className="py-3 text-sm">{t.installment}</td>
                        <td className="py-3 text-sm">{t.dueDate}</td>
                        <td className="py-3 font-bold text-sm text-right">{t.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const FinancialLedger = () => {
    const { financials, userProfile, downloadStatement } = useClientData();

    return (
        <>
            <PrintView financials={financials} userProfile={userProfile} />
            
            <div className="flex flex-col gap-6 print:hidden max-w-5xl">
                
                {/* ── Financial Ledger Overview (Center Column matching Figma) ── */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                    <div className="p-6 flex items-center justify-between border-b border-[#E2E8F0]">
                        <h2 className="text-[#003178] font-bold text-[18px]">Financial Ledger Overview</h2>
                        <button 
                            onClick={downloadStatement}
                            className="flex items-center gap-2 text-[#003178] font-bold text-sm hover:underline"
                        >
                            <Download size={16} /> Statement
                        </button>
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
                                            {t.amount}
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
