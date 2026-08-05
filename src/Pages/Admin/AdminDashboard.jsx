import React from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { 
    Download, TrendingUp, DollarSign, Building, AlertCircle,
    UserPlus, CreditCard, CheckSquare, Megaphone,
    FileText, UserCheck, Clock
} from 'lucide-react';

const StatCard = ({ title, value, subtitle, trend, trendUp, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Icon size={18} />
                <span>{title}</span>
            </div>
            {trend && (
                <div className={`px-2 py-1 rounded text-xs font-semibold ${trendUp ? 'bg-[#DEF7EC] text-[#03543F]' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </div>
            )}
        </div>
        <div className="text-3xl font-bold text-slate-800 mb-2">{value}</div>
        <div className="text-sm text-slate-500">{subtitle}</div>
    </div>
);

const AdminDashboard = () => {
    const { clients, properties, transactions } = useAdminData();

    // Calculate dynamic stats
    const totalRevenue = transactions.reduce((sum, tx) => sum + parseInt(tx.amount.replace(/,/g, '')), 0);
    const activeClients = clients.length;

    // Format currency
    const formatBDT = (amount) => new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Global Portfolio Context</div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        All Projects <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">(12 Active)</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Aggregate executive summary and operational metrics across all active developments.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                    <Download size={14} />
                    Export Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Top Row: 2 Large Cards */}
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                            <TrendingUp size={16} className="text-slate-400" />
                            <span>Total Revenue Collected</span>
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-800 mb-2">৳85,40,50,000</div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-slate-500">Across all projects • Fiscal Year 2023-2024</div>
                        <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded flex items-center gap-1">
                            <TrendingUp size={12} /> +23.4%
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                            <DollarSign size={16} className="text-slate-400" />
                            <span>Total Net Receivables</span>
                        </div>
                        <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                            Global Outstanding
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-800 mb-2">৳12,30,00,000</div>
                    <div className="mt-4">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                            <div className="bg-amber-500 h-full w-[82%]"></div>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">82% average collection rate on schedule</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Bottom Row: 3 Smaller Cards */}
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-4">
                        <Building size={16} className="text-[#1A4B9C]" />
                        <span>Units Sold</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800 mb-1">142 <span className="text-slate-400 text-lg font-medium">/ 200</span></div>
                    <div className="text-xs text-slate-500">Across 5 Active Projects</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-4">
                        <AlertCircle size={16} className="text-red-500" />
                        <span>Pending Approvals</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800 mb-1">24</div>
                    <div className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> Requires MD signature
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-4">
                        <UserPlus size={16} className="text-emerald-500" />
                        <span>New Public Leads</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800 mb-1">56</div>
                    <div className="text-xs text-slate-500">Generated today across portfolio</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1A4B9C] text-white rounded-lg font-medium hover:bg-[#153B7C] transition-colors shadow-sm text-sm">
                        <UserPlus size={16} /> Add Client
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        <CreditCard size={16} /> Record Payment
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        <CheckSquare size={16} /> Approve Registration
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        <Megaphone size={16} /> Publish Announcement
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                    <button className="text-[#1A4B9C] text-xs font-bold hover:underline">View All</button>
                </div>
                <div className="divide-y divide-[#E2E8F0]">
                    {/* Activity Row 1 */}
                    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 w-1/4">
                            <div className="w-8 h-8 rounded bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center">
                                <UserCheck size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Registration</div>
                                <div className="text-xs text-slate-500">New Client</div>
                            </div>
                        </div>
                        <div className="w-1/4 text-sm font-bold text-slate-800">Md. Rahman (Apt 4B)</div>
                        <div className="w-1/4 text-sm text-slate-500">Installment #12 - Sardar Tower</div>
                        <div className="w-1/4 flex items-center justify-end gap-6">
                            <div className="text-sm font-extrabold text-slate-800">৳5,00,000</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> 10 mins ago</div>
                        </div>
                    </div>
                    {/* Activity Row 2 */}
                    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 w-1/4">
                            <div className="w-8 h-8 rounded bg-[#DEF7EC] text-[#03543F] flex items-center justify-center">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Payment</div>
                                <div className="text-xs text-slate-500">Bank Transfer</div>
                            </div>
                        </div>
                        <div className="w-1/4 text-sm font-bold text-slate-800">Syeda Fatima</div>
                        <div className="w-1/4 text-sm text-slate-500">New Booking - Apt 12A submitted</div>
                        <div className="w-1/4 flex items-center justify-end gap-6">
                            <div className="text-sm font-extrabold text-slate-800">Pending</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> 1 hour ago</div>
                        </div>
                    </div>
                    {/* Activity Row 3 */}
                    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 w-1/4">
                            <div className="w-8 h-8 rounded bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center">
                                <FileText size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Registration</div>
                                <div className="text-xs text-slate-500">Document Upload</div>
                            </div>
                        </div>
                        <div className="w-1/4 text-sm font-bold text-slate-800">Kamal Hossain</div>
                        <div className="w-1/4 text-sm text-slate-500">Downpayment Cleared - Green Valley</div>
                        <div className="w-1/4 flex items-center justify-end gap-6">
                            <div className="text-sm font-extrabold text-slate-800">৳25,00,000</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> 3 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
