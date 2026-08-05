import React from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Download, Filter, Eye } from 'lucide-react';

const AdminFinancials = () => {
    const { properties } = useAdminData();

    const formatBDT = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(amount.replace(/,/g, '')));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Financial Ledgers</div>
                    <h1 className="text-2xl font-bold text-slate-800">Master Financial Ledgers</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of all client financial records and project revenues.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Download size={14} /> Download Report
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <Download size={14} /> Export Master
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1A4B9C]"></div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">৳4,250,000,000</div>
                    <div className="text-[10px] text-slate-500 mt-1">Collected this year <br/> 88% of portfolio</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Outstanding</div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">৳2,890,500,000</div>
                    <div className="text-[10px] text-slate-500 mt-1">Current pending dues</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Overdue</div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">৳1,245,000,000</div>
                    <div className="text-[10px] text-slate-500 mt-1">Expected within 24 months</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Not Active</div>
                    </div>
                    <div className="text-2xl font-extrabold text-red-700">৳114,500,000</div>
                    <div className="text-[10px] text-red-600 mt-1 font-medium">42 Active accounts</div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Client Ledger Directory</h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search client, ID, unit..."
                            className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-64 outline-none focus:border-[#1A4B9C]"
                        />
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Client / Unit</th>
                            <th className="px-6 py-3">Total Price</th>
                            <th className="px-6 py-3">Utility / Other</th>
                            <th className="px-6 py-3">Total Paid</th>
                            <th className="px-6 py-3">Balance</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {properties.map(prop => (
                            <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 text-xs">{prop.clientId === 'client_1' ? 'M. A. Rahman' : 'Syeda Fatima'}</div>
                                    <div className="text-[10px] text-slate-500">{prop.unitName} - {prop.projectId === 'p1' ? 'Sardar Tower' : 'Green Valley'}</div>
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-slate-800">
                                    ৳{formatBDT(prop.totalValuation)}
                                </td>
                                <td className="px-6 py-3 text-xs font-medium text-slate-600">
                                    ৳{formatBDT(prop.otherCharges)}
                                </td>
                                <td className="px-6 py-3 text-xs font-medium text-emerald-700">
                                    ৳{formatBDT(prop.totalPaid)}
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-red-600">
                                    ৳{formatBDT(prop.dueBalance)}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="inline-flex items-center px-2 py-0.5 rounded bg-[#DEF7EC] text-[#03543F] text-[10px] font-bold uppercase tracking-wider">
                                        On Track
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <button className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded text-slate-600 text-[10px] font-bold hover:bg-slate-100 uppercase tracking-wider">
                                        <Eye size={12} /> View Ledger
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminFinancials;
