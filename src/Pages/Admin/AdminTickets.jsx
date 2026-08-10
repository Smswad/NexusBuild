import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Filter, CheckCircle2, MessageSquare, Clock, User } from 'lucide-react';

const AdminTickets = () => {
    const { tickets, clients, resolveTicket } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'In Review': return 'bg-amber-100 text-amber-700 border border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border border-blue-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Support Portal</div>
                    <h1 className="text-2xl font-bold text-slate-800">Client Support Tickets</h1>
                    <p className="text-slate-500 text-sm mt-1">Review, follow up, and resolve incoming support requests from clients.</p>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                    {['All', 'Pending', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                statusFilter === status
                                    ? 'bg-[#1A4B9C] text-white'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-[#E2E8F0]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search tickets by subject, ID, message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-xs w-full outline-none focus:border-[#1A4B9C]"
                    />
                </div>
            </div>

            {/* Ticket Cards */}
            <div className="space-y-4">
                {filteredTickets.map(ticket => {
                    const client = clients.find(c => c.id === ticket.clientId);
                    return (
                        <div key={ticket.id} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400">{ticket.id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {ticket.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">{ticket.subject}</h3>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            
                            <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm whitespace-pre-wrap leading-relaxed mb-4">
                                {ticket.message}
                            </p>

                            <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-4 mt-4">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center font-bold text-xs">
                                        {client?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800">{client?.name || 'Unknown Client'}</div>
                                        <div className="text-[10px] text-slate-400">{client?.email || 'N/A'}</div>
                                    </div>
                                </div>

                                {ticket.status !== 'Resolved' && (
                                    <button 
                                        onClick={async () => {
                                            await resolveTicket(ticket.id);
                                            alert(`Ticket ${ticket.id} marked as resolved!`);
                                        }}
                                        className="px-4 py-2 bg-[#006E1C] hover:bg-[#005215] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        <CheckCircle2 size={14} /> Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredTickets.length === 0 && (
                    <div className="p-12 text-center text-slate-500 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                        <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
                        <p className="font-semibold text-sm">No support tickets found matching the criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTickets;
