import React, { useState } from 'react';
import { Search, Filter, Download, Plus, ChevronRight, X } from 'lucide-react';
import { useAdminData } from '../../Context/AdminDataContext';

const AdminLeads = () => {
    const { leads, addLead, updateLeadStatus } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', phone: '', interest: '', source: 'Manual Entry', status: 'New' });

    const handleAddLead = (e) => {
        e.preventDefault();
        addLead(newLead);
        setIsAddModalOpen(false);
        setNewLead({ name: '', phone: '', interest: '', source: 'Manual Entry', status: 'New' });
    };

    const handleUpdateStatus = (id, currentStatus) => {
        const flow = ['New', 'Contacted', 'Qualified', 'Converted'];
        const currentIndex = flow.indexOf(currentStatus);
        if (currentIndex < flow.length - 1) {
            updateLeadStatus(id, flow[currentIndex + 1]);
        }
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Name,Phone,Interest,Source,Status,Date\n"
            + leads.map(l => `${l.id},${l.name},${l.phone},${l.interest},${l.source},${l.status},${l.date}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm));

    const getStatusStyle = (status) => {
        switch(status) {
            case 'New': return 'bg-blue-100 text-blue-700';
            case 'Contacted': return 'bg-amber-100 text-amber-700';
            case 'Qualified': return 'bg-purple-100 text-purple-700';
            case 'Converted': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const newLeadsCount = leads.filter(l => l.status === 'New').length;
    const pipelineCount = leads.filter(l => ['Contacted', 'Meeting Scheduled', 'Qualified'].includes(l.status)).length;
    const convertedCount = leads.filter(l => l.status === 'Application Submitted').length;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Sales Pipeline</div>
                    <h1 className="text-2xl font-bold text-slate-800">Lead Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Track and manage potential clients across all projects.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert("Advanced filtering will be available soon.")} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <Plus size={14} /> Add Lead
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Leads</div>
                    <div className="text-2xl font-extrabold text-[#1A4B9C] mt-1">{leads.length}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Across all sources</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">New (Uncontacted)</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">{newLeadsCount}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Requires immediate action</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">In Pipeline</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">{pipelineCount}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Actively engaged</div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Converted (Total)</div>
                    <div className="text-2xl font-extrabold mt-1">{convertedCount}</div>
                    <div className="text-[10px] text-emerald-300 mt-1 font-bold uppercase">Awaiting Approval</div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Active Leads</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                            <th className="px-6 py-3">Lead Info</th>
                            <th className="px-6 py-3">Interest</th>
                            <th className="px-6 py-3">Source</th>
                            <th className="px-6 py-3">Date Added</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredLeads.map(lead => (
                            <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 text-xs">{lead.name}</div>
                                    <div className="text-[10px] text-slate-500">{lead.phone}</div>
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-slate-800">
                                    {lead.interest}
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-600">
                                    {lead.source}
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-600">
                                    {lead.date}
                                </td>
                                <td className="px-6 py-3">
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                                        {lead.status}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    {lead.status !== 'Converted' ? (
                                        <button onClick={() => handleUpdateStatus(lead.id, lead.status)} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                            Advance <ChevronRight size={12} />
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 text-xs font-bold">Done</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Add New Lead</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddLead} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input type="text" required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                                <input type="text" required value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Property Interest</label>
                                <input type="text" required value={newLead.interest} onChange={e => setNewLead({...newLead, interest: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" placeholder="e.g. Sardar Tower - 5A" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C]">Save Lead</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminLeads;
