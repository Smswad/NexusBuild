import React, { useState } from 'react';
import { Search, Filter, Download, BellRing, ChevronRight, X } from 'lucide-react';

const AdminInstallments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstallment, setSelectedInstallment] = useState(null);

    // Mock Data
    const installments = [
        { id: 'INS-01', client: 'M. A. Rahman', unit: 'Sardar Tower - 5A', amount: '25,00,000', dueDate: '15 Mar 2026', status: 'Overdue' },
        { id: 'INS-04', client: 'Syeda Fatima', unit: 'Sardar Tower - 4B', amount: '25,00,000', dueDate: '10 Apr 2026', status: 'Pending' },
        { id: 'INS-12', client: 'Tariqul Islam', unit: 'Green Valley - 2A', amount: '15,00,000', dueDate: '15 Apr 2026', status: 'Upcoming' },
        { id: 'INS-02', client: 'Kamal Uddin', unit: 'Sardar Tower - 8C', amount: '25,00,000', dueDate: '05 Mar 2026', status: 'Paid' },
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Paid': return 'bg-[#DEF7EC] text-[#03543F]';
            case 'Pending': return 'bg-[#E1EFFE] text-[#1A4B9C]';
            case 'Upcoming': return 'bg-slate-100 text-slate-600';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleReminders = () => {
        alert("Automated reminders have been dispatched to all clients with upcoming or overdue installments.");
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Client,Unit,Amount,DueDate,Status\n"
            + installments.map(i => `${i.id},${i.client},${i.unit},${i.amount},${i.dueDate},${i.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "installments.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredInstallments = installments.filter(i => i.client.toLowerCase().includes(searchTerm.toLowerCase()) || i.unit.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Receivables</div>
                    <h1 className="text-2xl font-bold text-slate-800">Installment Schedules</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor upcoming dues, collected amounts, and overdue payments.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button onClick={handleReminders} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <BellRing size={14} /> Send Reminders
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected This Month</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">৳ 2.50 Cr</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Total billed</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Collected (MTD)</div>
                    <div className="text-2xl font-extrabold text-emerald-700 mt-1">৳ 1.75 Cr</div>
                    <div className="text-[10px] text-emerald-600 mt-1 uppercase font-medium">70% Collection Rate</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm bg-red-50">
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Overdue Payments</div>
                    <div className="text-2xl font-extrabold text-red-700 mt-1">৳ 0.75 Cr</div>
                    <div className="text-[10px] text-red-600 mt-1 uppercase font-medium">Across 8 Clients</div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Upcoming Next 30 Days</div>
                    <div className="text-2xl font-extrabold mt-1">৳ 3.20 Cr</div>
                    <div className="text-[10px] text-blue-200 mt-1 uppercase">14 Installments</div>
                </div>
            </div>

            {/* Installments Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Payment Master List</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search client, unit..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-64 outline-none focus:border-[#1A4B9C]"
                            />
                        </div>
                        <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 font-bold shadow-sm transition-colors text-xs">
                            <Download size={12} /> Export CSV
                        </button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Client & Unit</th>
                            <th className="px-6 py-3">Installment Ref</th>
                            <th className="px-6 py-3">Due Date</th>
                            <th className="px-6 py-3 text-right">Amount (BDT)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredInstallments.map(inst => (
                            <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 text-xs">{inst.client}</div>
                                    <div className="text-[10px] text-slate-500">{inst.unit}</div>
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-slate-800">
                                    {inst.id}
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-600">
                                    {inst.dueDate}
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-slate-800 text-right">
                                    {inst.amount}
                                </td>
                                <td className="px-6 py-3">
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(inst.status)}`}>
                                        {inst.status}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <button onClick={() => setSelectedInstallment(inst)} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                        View Details <ChevronRight size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {selectedInstallment && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Installment Details</h3>
                            <button onClick={() => setSelectedInstallment(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Installment Ref</span>
                                <span className="text-sm font-bold text-slate-800">{selectedInstallment.id}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Client</span>
                                <span className="text-sm font-bold text-slate-800">{selectedInstallment.client}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Unit</span>
                                <span className="text-sm font-bold text-slate-800">{selectedInstallment.unit}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Amount</span>
                                <span className="text-sm font-bold text-[#1A4B9C]">৳ {selectedInstallment.amount}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Due Date</span>
                                <span className="text-sm font-bold text-slate-800">{selectedInstallment.dueDate}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(selectedInstallment.status)}`}>
                                    {selectedInstallment.status}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button onClick={() => setSelectedInstallment(null)} className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C]">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminInstallments;
