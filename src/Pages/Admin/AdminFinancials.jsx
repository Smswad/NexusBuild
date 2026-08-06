import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Download, Filter, Eye, Plus } from 'lucide-react';

const AdminFinancials = () => {
    const { properties, clients, transactions, installments } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');

    const formatBDT = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-IN').format(parseInt(String(amount).replace(/,/g, '')));
    };

    // Global Stats
    const totalRevenue = transactions.reduce((sum, tx) => sum + parseInt(String(tx.amount).replace(/,/g, '')), 0);
    const netOutstanding = properties.reduce((sum, p) => sum + parseInt(String(p.dueBalance).replace(/,/g, '')), 0);
    const totalOverdue = installments.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + parseInt(String(i.amount).replace(/,/g, '')), 0);

    const enrichedProperties = properties.map(prop => {
        const client = clients.find(c => c.id === prop.clientId);
        return {
            ...prop,
            clientName: client ? client.name : 'Unknown Client',
            projectName: prop.projectId === 'p1' ? 'Sardar Tower' : 'Green Valley' // Simple mock for now
        };
    });

    const filteredProperties = enrichedProperties.filter(p => 
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.unitName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <Download size={14} /> Export CSV
                    </button>
                    <button onClick={() => alert("Please go to 'Clients' to add a transaction for a specific property.")} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <Plus size={14} /> New Transaction
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
                    <div className="text-2xl font-extrabold text-slate-800">৳{formatBDT(totalRevenue)}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Total confirmed payments</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Outstanding</div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">৳{formatBDT(netOutstanding)}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Current pending dues</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Overdue</div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800">৳{formatBDT(totalOverdue)}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Needs immediate attention</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Active Ledgers</div>
                    </div>
                    <div className="text-2xl font-extrabold text-blue-700">{properties.length}</div>
                    <div className="text-[10px] text-blue-600 mt-1 font-medium">Across all projects</div>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                        {filteredProperties.map(prop => (
                            <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 text-xs">{prop.clientName}</div>
                                    <div className="text-[10px] text-slate-500">{prop.unitName} - {prop.projectName}</div>
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
                                    <button onClick={() => window.print()} className="flex items-center gap-1 px-3 py-1.5 border border-[#E2E8F0] rounded text-slate-600 text-[10px] font-bold hover:bg-slate-100 uppercase tracking-wider">
                                        <Download size={12} /> Receipt
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
