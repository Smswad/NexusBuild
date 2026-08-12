import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Filter, CheckCircle2, MessageSquare, Clock, CornerDownRight, Send, X } from 'lucide-react';

const AdminTickets = () => {
    const { tickets, clients, resolveTicket, replyToTicket } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Reply form state
    const [replyingTicketId, setReplyingTicketId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleOpenReply = (ticket) => {
        setReplyingTicketId(ticket.id);
        setReplyText(ticket.adminReply || '');
    };

    const handleSendReply = async (ticketId, resolve = true) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message before sending.');
            return;
        }
        await replyToTicket(ticketId, replyText.trim(), resolve);
        setReplyingTicketId(null);
        setReplyText('');
        alert(`Reply sent to client successfully! ${resolve ? 'Ticket marked as Resolved.' : ''}`);
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = (ticket.subject && ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())) || 
                              (ticket.id && ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (ticket.message && ticket.message.toLowerCase().includes(searchTerm.toLowerCase()));
        
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
        <div className="max-w-5xl mx-auto space-y-6 px-4 lg:px-0 text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Support Portal</div>
                    <h1 className="text-2xl font-bold text-slate-800">Client Support Tickets</h1>
                    <p className="text-slate-500 text-sm mt-1">Review, reply back, and resolve incoming support requests from clients.</p>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {['All', 'Pending', 'In Review', 'Resolved'].map(status => (
                        <button
                            key={status}
                            type="button"
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
                    const isReplying = replyingTicketId === ticket.id;

                    return (
                        <div key={ticket.id} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
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
                            
                            {/* Client Message (Thread conversation) */}
                            {(() => {
                                let msgs = [];
                                try {
                                    if (ticket.message && ticket.message.trim().startsWith('[')) {
                                        msgs = JSON.parse(ticket.message);
                                    } else {
                                        msgs = [];
                                        if (ticket.message) {
                                            msgs.push({ sender: 'client', text: ticket.message, date: ticket.date || 'Original' });
                                        }
                                        if (ticket.adminReply || ticket.admin_reply) {
                                            msgs.push({ sender: 'admin', text: ticket.adminReply || ticket.admin_reply, date: ticket.date || 'Original' });
                                        }
                                    }
                                } catch(e) {
                                    msgs = [{ sender: 'client', text: ticket.message, date: ticket.date }];
                                }

                                return (
                                    <div className="mb-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Conversation History:</div>
                                        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60 max-h-64 overflow-y-auto flex flex-col">
                                            {msgs.map((m, idx) => {
                                                const isClient = m.sender === 'client';
                                                return (
                                                    <div key={idx} className={`flex flex-col mb-1 ${isClient ? 'items-start' : 'items-end'}`}>
                                                        <span className="text-[9px] text-slate-400 font-bold mb-1">{isClient ? (client?.name || 'Client') : 'Super Admin'} • {m.date}</span>
                                                        <div className={`p-3 rounded-lg text-xs max-w-lg ${isClient ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' : 'bg-[#E1EFFE] text-[#1A4B9C] rounded-tr-none border border-[#1A4B9C]/10'}`}>
                                                            <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Inline Reply Form */}
                            {isReplying && (
                                <div className="mb-4 p-4 border border-[#1A4B9C]/30 bg-blue-50/50 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-[#1A4B9C] uppercase tracking-wider flex items-center gap-1.5">
                                            <CornerDownRight size={14} /> Reply to {client?.name || 'Client'}
                                        </span>
                                        <button type="button" onClick={() => setReplyingTicketId(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <textarea 
                                        rows="3" 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Type your official response to ${client?.name || 'the client'}...`}
                                        className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setReplyingTicketId(null)}
                                            className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSendReply(ticket.id, false)}
                                            className="px-3 py-1.5 text-xs text-[#1A4B9C] bg-blue-100 hover:bg-blue-200 rounded-lg font-bold cursor-pointer"
                                        >
                                            Send Reply (In Review)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSendReply(ticket.id, true)}
                                            className="px-4 py-1.5 text-xs text-white bg-[#1A4B9C] hover:bg-[#153B7C] rounded-lg font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Send size={12} /> Send Reply & Resolve
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Card Footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#E2E8F0] pt-4 mt-4">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-[#E1EFFE] text-[#1A4B9C] flex items-center justify-center font-bold text-xs">
                                        {client?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800">{client?.name || 'Unknown Client'}</div>
                                        <div className="text-[10px] text-slate-400">{client?.email || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    {!isReplying && (
                                        <button 
                                            type="button"
                                            onClick={() => handleOpenReply(ticket)}
                                            className="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-[#1A4B9C] hover:bg-[#153B7C] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            <CornerDownRight size={14} /> Reply Back
                                        </button>
                                    )}

                                    {ticket.status !== 'Resolved' && (
                                        <button 
                                            type="button"
                                            onClick={async () => {
                                                await resolveTicket(ticket.id);
                                                alert(`Ticket ${ticket.id} marked as resolved!`);
                                            }}
                                            className="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-[#006E1C] hover:bg-[#005215] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            <CheckCircle2 size={14} /> Mark as Resolved
                                        </button>
                                    )}
                                </div>
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
