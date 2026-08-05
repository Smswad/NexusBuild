import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Filter, Download, Plus, ChevronRight, X } from 'lucide-react';

const ClientDirectory = () => {
    const { clients, properties, addClient, updateClient } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', status: 'Active' });

    const formatBDT = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(amount.replace(/,/g, '')));
    };

    const handleAddClient = (e) => {
        e.preventDefault();
        addClient(newClient);
        setIsAddModalOpen(false);
        setNewClient({ name: '', email: '', phone: '', status: 'Active' });
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Name,Email,Phone,Status\n"
            + clients.map(c => `${c.id},${c.name},${c.email},${c.phone},${c.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "clients_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Client Management</div>
                    <h1 className="text-2xl font-bold text-slate-800">Master Client Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all active clients, view financial standing, and assign portfolio managers.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Filter size={14} /> Advanced Filters
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <Plus size={14} /> New Client
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center font-bold text-lg">M</div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">M. Kabir</div>
                        <div className="text-xs text-slate-500">Portfolio Collection</div>
                        <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Achieved ৳ 1,20,00,000 | 75%</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#DEF7EC] text-[#03543F] flex items-center justify-center font-bold text-lg">S</div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">S. Rahman</div>
                        <div className="text-xs text-slate-500">Portfolio Collection</div>
                        <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Achieved ৳ 50,00,000 | 45%</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Active Clients</div>
                    <div className="text-2xl font-extrabold text-[#1A4B9C] mt-1">184 <span className="text-xs font-bold text-emerald-600 ml-1">↑ +12 THIS MONTH</span></div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Total Outstanding Due</div>
                    <div className="text-2xl font-extrabold mt-1">৳1.2Cr</div>
                    <div className="text-[10px] text-blue-200 mt-1 uppercase">Across all active projects</div>
                </div>
            </div>

            {/* Directory Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Directory Entries</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by Client or Unit..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-64 outline-none focus:border-[#1A4B9C]"
                            />
                        </div>
                        <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 font-bold shadow-sm transition-colors text-xs">
                            <Download size={12} /> Export
                        </button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Client Name</th>
                            <th className="px-6 py-3">Unit ID</th>
                            <th className="px-6 py-3">Total Value</th>
                            <th className="px-6 py-3">Total Paid</th>
                            <th className="px-6 py-3">Net Due</th>
                            <th className="px-6 py-3">Manager</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredClients.map(client => {
                            const prop = properties.find(p => p.clientId === client.id);
                            return (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="text-xs text-slate-500 font-bold">USR-{client.id.split('_')[1]}</div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center font-bold text-[10px]">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-slate-800 text-xs">{client.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        {prop ? (
                                            <div>
                                                <div className="text-xs font-bold text-slate-800">{prop.unitName}</div>
                                                <div className="text-[10px] text-slate-500">{prop.projectId === 'p1' ? 'Sardar Tower' : 'Green Valley'}</div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-xs font-bold text-slate-800">
                                        {prop ? `৳${formatBDT(prop.totalValuation)}` : '-'}
                                    </td>
                                    <td className="px-6 py-3">
                                        {prop ? (
                                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-[#DEF7EC] text-[#03543F] text-[10px] font-bold uppercase tracking-wider">
                                                ৳{formatBDT(prop.totalPaid)}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-3">
                                        {prop ? (
                                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                                                ৳{formatBDT(prop.dueBalance)}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="text-xs font-bold text-slate-700">M. Kabir</div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button onClick={() => alert('View Full Profile Feature Coming Soon')} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                            View Full Profile <ChevronRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="px-6 py-3 border-t border-[#E2E8F0] flex justify-between items-center text-xs font-bold text-slate-500">
                    <div>Showing {clients.length} of 184 entries</div>
                    <div className="flex gap-1">
                        <button className="px-2 py-1 border border-[#E2E8F0] rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-2 py-1 bg-[#1A4B9C] text-white rounded">1</button>
                        <button className="px-2 py-1 border border-[#E2E8F0] rounded hover:bg-slate-50">2</button>
                        <button className="px-2 py-1 border border-[#E2E8F0] rounded hover:bg-slate-50">3</button>
                        <button className="px-2 py-1 border border-[#E2E8F0] rounded hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Add New Client</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddClient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input type="text" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input type="email" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                                <input type="text" required value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C]">Save Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClientDirectory;
