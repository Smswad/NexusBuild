import { 
    CheckCircle2, Circle, Lock, Download, 
    CheckCircle, FileText, Mail, Phone, Send 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import heroImg from '../../assets/pics/hero_pic.png';
import { useClientData } from '../../Context/ClientDataContext';

const Overview = () => {
    const navigate = useNavigate();
    const { loading, userProfile, financials, projects, downloadStatement } = useClientData();
    const activeProject = projects[0] || { progressPhase: 1 };
    
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
        <div className="flex gap-6 items-start">
            {/* ══ CENTER COLUMN (Flexible Main Content) ════════════════════════ */}
            <div className="flex-1 flex flex-col gap-6">
                
                {/* 1. Construction Progress Card */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 pb-8">
                    <h2 className="text-[#003178] font-bold text-[18px] mb-10">Sardar Tower Construction Progress</h2>
                    
                    <div className="relative mt-8">
                        {/* Connecting Lines */}
                        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-[#E2E8F0] z-0 rounded-full overflow-hidden">
                            <div className="h-full bg-[#006E1C] w-[66.66%]" />
                        </div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006E1C] flex items-center justify-center text-[#006E1C] z-10 relative">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center mt-4">Piling &<br/>Foundation</div>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006E1C] flex items-center justify-center text-[#006E1C] z-10 relative">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center mt-4">Structural<br/>Casting</div>
                            </div>

                            {/* Step 3 (Active) */}
                            <div className="flex flex-col items-center flex-1">
                                {activeProject.progressPhase >= 3 ? (
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006E1C] flex items-center justify-center text-[#006E1C] z-10 relative">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                ) : activeProject.progressPhase === 2 ? (
                                    <div className="w-9 h-9 rounded-full bg-white border-4 border-[#E1EFFE] flex items-center justify-center z-10 relative">
                                        <div className="w-3 h-3 rounded-full bg-[#003178]" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center text-slate-400 z-10 relative">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                )}
                                <div className={`text-[11px] uppercase tracking-wider text-center mt-4 ${activeProject.progressPhase === 3 ? 'font-bold text-[#003178]' : activeProject.progressPhase > 3 ? 'font-medium text-slate-500' : 'font-medium text-slate-400'}`}>Finishing</div>
                            </div>

                            {/* Step 4 (Locked) */}
                            <div className="flex flex-col items-center flex-1">
                                {activeProject.progressPhase >= 4 ? (
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006E1C] flex items-center justify-center text-[#006E1C] z-10 relative">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                ) : activeProject.progressPhase === 3 ? (
                                    <div className="w-9 h-9 rounded-full bg-white border-4 border-[#E1EFFE] flex items-center justify-center z-10 relative">
                                        <div className="w-3 h-3 rounded-full bg-[#003178]" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center text-slate-400 z-10 relative">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                )}
                                <div className={`text-[11px] uppercase tracking-wider text-center mt-4 ${activeProject.progressPhase === 4 ? 'font-bold text-[#003178]' : 'font-medium text-slate-400'}`}>Handover</div>
                            </div>
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
                </div>

            </div>


            {/* ══ RIGHT COLUMN (Widgets - Fixed 360px) ═════════════════════════ */}
            <div className="w-[360px] flex-shrink-0 flex flex-col gap-6">
                
                {/* 1. Property Hero Card */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
                    {/* Image Area with Gradient */}
                    <div className="h-48 relative overflow-hidden flex items-end p-5">
                        <img src={heroImg} alt="Sardar Tower" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003178] to-transparent opacity-80 z-10" />
                        <div className="relative z-20">
                            <h3 className="text-white font-bold text-[18px]">{userProfile.propertyName}</h3>
                            <p className="text-blue-100 text-sm mt-1">{userProfile.propertyLoc}</p>
                        </div>
                    </div>
                    {/* Info Pills */}
                    <div className="p-5 flex gap-4 text-sm bg-white border-b border-[#E2E8F0]">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Area</span>
                            <span className="text-slate-800 font-bold">{userProfile.area}</span>
                        </div>
                        <div className="w-[1px] bg-[#E2E8F0]"></div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Handover</span>
                            <span className="text-slate-800 font-bold">{userProfile.handoverDate}</span>
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

                {/* 3. Support/Account Exec Contact Card */}
                <div className="bg-[#0F3A70] rounded-lg shadow-sm p-6 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-[#A0B2C6] overflow-hidden flex-shrink-0">
                            {/* Avatar placeholder */}
                            <img src="https://i.pravatar.cc/150?u=farhana" alt="Farhana Islam" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-bold text-[16px]">Farhana Islam</div>
                            <div className="text-[#A0B2C6] text-xs mt-1">Dedicated Account Exec</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-3 text-[#A0B2C6] text-sm">
                            <Mail size={16} /> farhana@reliance.com
                        </div>
                        <div className="flex items-center gap-3 text-[#A0B2C6] text-sm">
                            <Phone size={16} /> +880 1700-123456
                        </div>
                    </div>

                    <form className="relative" onSubmit={e => e.preventDefault()}>
                        <textarea 
                            rows="3" 
                            className="w-full bg-white rounded-lg p-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                            placeholder="Message Farhana regarding your account..."
                        />
                        <button className="absolute right-2 bottom-2 w-8 h-8 bg-[#003178] text-white rounded-md flex items-center justify-center hover:bg-[#0A2550] transition-colors shadow-sm">
                            <Send size={14} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Overview;
