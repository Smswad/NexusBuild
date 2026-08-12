import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Filter, Download, Plus, ChevronRight, X, User, CreditCard, Wallet, MessageSquare, CheckCircle, Send, CornerDownRight } from 'lucide-react';
import { showToast } from '../../Components/Toast/globalToast';

const ClientManagement = () => {
    const { 
        clients, properties, installments, transactions, tickets, leads,
        addClient, updateClient, updateProperty, 
        addInstallment, updateInstallment, deleteInstallment, addTransaction, resolveTicket, replyToTicket,
        deleteClient, activeProject
    } = useAdminData();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Add Client Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', status: 'Active' });

    // Manage Profile Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile Form State
    const [editForm, setEditForm] = useState({
        name: '', email: '', phone: '', status: 'Active',
        propertyId: null,
        unitName: '', area: '', handoverDate: '', totalValuation: '', totalPaid: '', otherCharges: '', dueBalance: '', location: ''
    });

    // Sub-forms state
    const [newInstallment, setNewInstallment] = useState({ installment: '', dueDate: '', amount: '' });
    const [newTransaction, setNewTransaction] = useState({ type: '', date: '', amount: '' });

    // Support Ticket Reply State
    const [replyingTicketId, setReplyingTicketId] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Mode Selector & Auto Generator State for Installments
    const [installmentMode, setInstallmentMode] = useState('auto'); // 'auto' | 'manual'
    const [autoConfig, setAutoConfig] = useState({
        totalAmount: '',
        numInstallments: 12,
        freq: 'Monthly',
        startDate: new Date().toISOString().split('T')[0]
    });

    const formatBDT = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(amount.toString().replace(/,/g, '')));
    };

    const calculateNetDue = (val, paid, other) => {
        const v = parseInt(String(val || 0).replace(/,/g, '')) || 0;
        const p = parseInt(String(paid || 0).replace(/,/g, '')) || 0;
        const o = parseInt(String(other || 0).replace(/,/g, '')) || 0;
        const due = Math.max(0, v + o - p);
        return due.toLocaleString('en-IN');
    };

    const handleAddClient = (e) => {
        e.preventDefault();
        addClient(newClient, activeProject);
        setIsAddModalOpen(false);
        setNewClient({ name: '', email: '', phone: '', status: 'Active' });
    };

    const openEditModal = (client, prop) => {
        setSelectedClient(client);
        setActiveTab('profile');
        setReplyingTicketId(null);
        setReplyText('');
        setEditForm({
            name: client.name,
            email: client.email,
            phone: client.phone,
            status: client.status,
            propertyId: prop ? prop.id : null,
            unitName: prop ? prop.unitName : '',
            area: prop ? prop.area : '',
            handoverDate: prop ? prop.handoverDate : '',
            totalValuation: prop ? prop.totalValuation || '0' : '0',
            totalPaid: prop ? prop.totalPaid || '0' : '0',
            otherCharges: prop ? prop.otherCharges || '0' : '0',
            dueBalance: prop ? prop.dueBalance || '0' : '0',
            location: prop ? prop.location : ''
        });
        setAutoConfig({
            totalAmount: prop ? prop.totalValuation || '0' : '0',
            numInstallments: 12,
            freq: 'Monthly',
            startDate: new Date().toISOString().split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const handleAutoGenerateInstallments = async (e) => {
        e.preventDefault();
        if (!editForm.propertyId) return;

        const amountToUse = autoConfig.totalAmount || editForm.totalValuation;
        const valuationNum = parseFloat(String(amountToUse).replace(/,/g, '')) || 0;

        if (valuationNum <= 0) {
            showToast("Please set a Total Valuation or enter an amount to generate the auto schedule.", 'warning', 'Missing Valuation');
            return;
        }

        const num = parseInt(autoConfig.numInstallments) || 12;
        const perAmount = Math.round(valuationNum / num);
        const formattedAmount = perAmount.toLocaleString('en-IN');

        let currentD = new Date(autoConfig.startDate || new Date());

        for (let i = 1; i <= num; i++) {
            const installmentName = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Installment`;
            const dateStr = currentD.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            await addInstallment({
                propertyId: editForm.propertyId,
                installment: installmentName,
                dueDate: dateStr,
                amount: formattedAmount,
                status: 'Pending',
                statusPill: 'bg-amber-100 text-amber-700',
                active: i === 1
            });

            if (autoConfig.freq === 'Monthly') {
                currentD.setMonth(currentD.getMonth() + 1);
            } else if (autoConfig.freq === 'Quarterly') {
                currentD.setMonth(currentD.getMonth() + 3);
            } else if (autoConfig.freq === 'Semi-Annually') {
                currentD.setMonth(currentD.getMonth() + 6);
            }
        }

        showToast(`Successfully auto-generated ${num} installments! Total Scheduled: ৳ ${valuationNum.toLocaleString('en-IN')}`, 'success', 'Installments Generated');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateClient(selectedClient.id, {
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            status: editForm.status
        });

        if (editForm.propertyId) {
            updateProperty(editForm.propertyId, {
                unitName: editForm.unitName,
                area: editForm.area,
                handoverDate: editForm.handoverDate,
                totalValuation: editForm.totalValuation,
                totalPaid: editForm.totalPaid,
                otherCharges: editForm.otherCharges,
                dueBalance: editForm.dueBalance,
                location: editForm.location
            });
        }
        showToast("Profile & Property details saved successfully and synced with Client!", 'success', 'Client Updated');
    };

    const handleAddInstallment = (e) => {
        e.preventDefault();
        if (!editForm.propertyId) return;

        let formattedDate = newInstallment.dueDate;
        try {
            if (formattedDate) {
                const parts = formattedDate.split('-');
                if (parts.length === 3) {
                    const d = new Date(formattedDate);
                    if (!isNaN(d.getTime())) {
                        formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
                }
            }
        } catch(err) {}

        addInstallment({
            propertyId: editForm.propertyId,
            installment: newInstallment.installment,
            dueDate: formattedDate,
            amount: newInstallment.amount,
            status: 'Pending',
            statusPill: 'bg-[#E1EFFE] text-[#1E429F]',
            active: false
        });
        setNewInstallment({ installment: '', dueDate: '', amount: '' });
    };

    const handleMarkInstallmentPaid = (id) => {
        updateInstallment(id, {
            status: 'Paid',
            statusPill: 'bg-[#DEF7EC] text-[#03543F]',
            active: false
        });
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!editForm.propertyId) return;
        addTransaction({
            propertyId: editForm.propertyId,
            date: newTransaction.date,
            type: newTransaction.type,
            amount: newTransaction.amount
        });
        setNewTransaction({ type: '', date: '', amount: '' });
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

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filtered data for the active client
    const clientInstallments = editForm.propertyId 
        ? [...installments.filter(i => i.propertyId === editForm.propertyId)].sort((a, b) => {
            const aPaid = (a.status || '').toLowerCase() === 'paid';
            const bPaid = (b.status || '').toLowerCase() === 'paid';
            if (aPaid && !bPaid) return 1;
            if (!aPaid && bPaid) return -1;
            return new Date(a.dueDate || a.due_date) - new Date(b.dueDate || b.due_date);
          }) 
        : [];
    const clientTransactions = editForm.propertyId ? transactions.filter(t => t.propertyId === editForm.propertyId) : [];
    const clientTickets = selectedClient ? tickets.filter(t => t.clientId === selectedClient.id) : [];

    // Parse a ticket's message field into a conversation thread
    const parseTicketMessages = (t) => {
        let msgs = [];
        try {
            if (t.message && t.message.trim().startsWith('[')) {
                msgs = JSON.parse(t.message);
            } else {
                if (t.message) msgs.push({ sender: 'client', text: t.message, date: t.date || 'Original Date' });
                if (t.adminReply || t.admin_reply) msgs.push({ sender: 'admin', text: t.adminReply || t.admin_reply, date: t.date || 'Original Date' });
            }
        } catch (e) {
            msgs = [{ sender: 'client', text: t.message, date: t.date }];
        }
        return msgs;
    };

    const handleSendTicketReply = async (ticket, resolve = false) => {
        if (!replyText.trim()) {
            showToast('Please type a reply before sending.', 'warning', 'Missing Reply');
            return;
        }
        if (replyingTicketId !== ticket.id) return;
        await replyToTicket(ticket.id, replyText.trim(), resolve);
        setReplyText('');
        setReplyingTicketId(null);
        showToast(`Reply sent to ${selectedClient?.name || 'client'}.${resolve ? ' Ticket resolved.' : ''}`, 'success', 'Reply Sent');
    };

    const totalDue = properties.reduce((sum, p) => sum + (parseInt(String(p.dueBalance).replace(/,/g, '')) || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 lg:px-0 text-slate-800">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Client Management</div>
                    <h1 className="text-2xl font-bold text-slate-800">Master Client Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all active clients, update financial standing, and resolve tickets.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none flex items-center justify-between gap-1.5 bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 shadow-sm text-xs text-slate-600">
                        <Filter size={14} className="text-slate-400" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent font-medium outline-none cursor-pointer text-slate-700"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors cursor-pointer flex-shrink-0">
                        <Plus size={14} /> Add Client
                    </button>
                </div>
            </div>

            {/* Directory Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Client Directory</h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-full sm:w-64 outline-none focus:border-[#1A4B9C] bg-white text-slate-800"
                            />
                        </div>
                        <button onClick={exportToCSV} className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 font-bold shadow-sm transition-colors text-xs cursor-pointer w-full sm:w-auto flex-shrink-0">
                            <Download size={12} /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Client Name</th>
                            <th className="px-6 py-3">Unit ID</th>
                            <th className="px-6 py-3">Total Value</th>
                            <th className="px-6 py-3">Total Paid</th>
                            <th className="px-6 py-3">Net Due</th>
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
                                        <button onClick={() => openEditModal(client, prop)} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                            Manage Hub <ChevronRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
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

            {/* Comprehensive Edit Hub Modal */}
            {isEditModalOpen && selectedClient && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#1A4B9C] text-white flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-lg">Client Management Hub</h3>
                                <p className="text-xs text-blue-200 mt-0.5">Managing: {selectedClient.name}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-blue-200 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-[#E2E8F0] flex flex-row md:flex-col overflow-x-auto p-4 gap-2 flex-shrink-0">
                                <button 
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setActiveTab('profile')}
                                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <User size={18} /> Profile & Property
                                </button>
                                <button 
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setActiveTab('installments')}
                                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${activeTab === 'installments' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <CreditCard size={18} /> Installment Schedule
                                </button>
                                <button 
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setActiveTab('transactions')}
                                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${activeTab === 'transactions' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Wallet size={18} /> Transactions Log
                                </button>
                                <button 
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setActiveTab('tickets')}
                                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${activeTab === 'tickets' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <MessageSquare size={18} /> Support Tickets
                                </button>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white relative">
                                
                                {/* ── TAB 1: PROFILE & PROPERTY ── */}
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleSaveProfile} className="space-y-8 max-w-3xl">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1A4B9C] border-b border-[#E2E8F0] pb-2 mb-4">Personal Information</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                                    <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                                                    <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white">
                                                        <option>Active</option>
                                                        <option>Inactive</option>
                                                        <option>Lead</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                                    <input type="email" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                                                    <input type="text" required value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                </div>
                                            </div>
                                        </div>

                                        {editForm.propertyId ? (
                                            <div>
                                                <h4 className="text-sm font-bold text-[#1A4B9C] border-b border-[#E2E8F0] pb-2 mb-4">Property & Financial Details</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Property Location / Block</label>
                                                        <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Name</label>
                                                        <input type="text" value={editForm.unitName} onChange={e => setEditForm({...editForm, unitName: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Area (sqft)</label>
                                                        <input type="text" value={editForm.area} onChange={e => setEditForm({...editForm, area: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Handover Date</label>
                                                        <input type="text" value={editForm.handoverDate} onChange={e => setEditForm({...editForm, handoverDate: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Valuation (৳)</label>
                                                        <input type="text" value={editForm.totalValuation} onChange={e => {
                                                            const newVal = e.target.value;
                                                            const calculatedDue = calculateNetDue(newVal, editForm.totalPaid, editForm.otherCharges);
                                                            setEditForm({...editForm, totalValuation: newVal, dueBalance: calculatedDue});
                                                        }} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paid (৳)</label>
                                                        <input type="text" value={editForm.totalPaid} onChange={e => {
                                                            const newPaid = e.target.value;
                                                            const calculatedDue = calculateNetDue(editForm.totalValuation, newPaid, editForm.otherCharges);
                                                            setEditForm({...editForm, totalPaid: newPaid, dueBalance: calculatedDue});
                                                        }} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Utility / Other Charges (৳)</label>
                                                        <input type="text" value={editForm.otherCharges} onChange={e => {
                                                            const newOther = e.target.value;
                                                            const calculatedDue = calculateNetDue(editForm.totalValuation, editForm.totalPaid, newOther);
                                                            setEditForm({...editForm, otherCharges: newOther, dueBalance: calculatedDue});
                                                        }} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Due Balance (৳)</label>
                                                            <button type="button" onClick={() => {
                                                                const calculatedDue = calculateNetDue(editForm.totalValuation, editForm.totalPaid, editForm.otherCharges);
                                                                setEditForm({...editForm, dueBalance: calculatedDue});
                                                            }} className="text-[10px] font-bold text-[#1A4B9C] hover:underline cursor-pointer">
                                                                Auto-Calculate
                                                            </button>
                                                        </div>
                                                        <input type="text" value={editForm.dueBalance} onChange={e => setEditForm({...editForm, dueBalance: e.target.value})} className="w-full border border-red-200 bg-red-50/30 rounded-lg px-3 py-2 text-sm font-bold text-red-700 focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm text-slate-500">
                                                This client does not have any assigned properties yet.
                                            </div>
                                        )}
                                        <div className="pt-4 border-t border-[#E2E8F0] flex justify-between">
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${selectedClient.name}? This will remove all their properties, transactions, and installment schedules.`)) {
                                                        deleteClient(selectedClient.id);
                                                        setIsEditModalOpen(false);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                            >
                                                Delete Client
                                            </button>
                                            <button type="submit" className="px-6 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C] transition-colors shadow-sm">
                                                Save Profile & Property
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* ── TAB 2: INSTALLMENTS ── */}
                                {activeTab === 'installments' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Installment Schedule & Tracking</h2>
                                                <p className="text-xs text-slate-500 mt-0.5">Select Auto or Manual mode to configure installment plan for client.</p>
                                            </div>
                                                 {/* Mode Selector Toggle */}
                                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-[#E2E8F0]">
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => setInstallmentMode('auto')}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${installmentMode === 'auto' ? 'bg-[#1A4B9C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                                >
                                                    Auto Mode
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => setInstallmentMode('manual')}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${installmentMode === 'manual' ? 'bg-[#1A4B9C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                                >
                                                    Manual Mode
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {!editForm.propertyId ? (
                                            <p className="text-slate-500">No property assigned to this client.</p>
                                        ) : (
                                            <>
                                                {/* Summary KPI Bar */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                                                    <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] text-center">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Installments</span>
                                                        <span className="text-lg font-extrabold text-slate-800 mt-1 block">{clientInstallments.length}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] text-center">
                                                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">Paid Installments</span>
                                                        <span className="text-lg font-extrabold text-emerald-600 mt-1 block">{clientInstallments.filter(i => i.status === 'Paid').length}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] text-center">
                                                        <span className="text-[10px] font-bold text-amber-600 uppercase block">Pending / Due</span>
                                                        <span className="text-lg font-extrabold text-amber-600 mt-1 block">{clientInstallments.filter(i => i.status !== 'Paid').length}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] text-center">
                                                        <span className="text-[10px] font-bold text-[#1A4B9C] uppercase block">Total Scheduled</span>
                                                        <span className="text-lg font-extrabold text-[#1A4B9C] mt-1 block">
                                                            ৳ {formatBDT(clientInstallments.reduce((sum, i) => sum + (parseInt(String(i.amount).replace(/,/g, '')) || 0), 0))}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Mode 1: Auto Schedule Generator */}
                                                {installmentMode === 'auto' && (
                                                    <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-200 space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-bold text-sm text-[#1A4B9C]">Auto Schedule Generator</h3>
                                                                <p className="text-xs text-slate-500 mt-0.5">Automated per-installment calculation & date scheduling based on total valuation.</p>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-[#1A4B9C] bg-blue-100 px-2 py-0.5 rounded uppercase">
                                                                Auto Mode
                                                            </span>
                                                        </div>
                                                        <form onSubmit={handleAutoGenerateInstallments} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Valuation to Split (৳)</label>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="e.g. 50,00,000" 
                                                                    value={autoConfig.totalAmount} 
                                                                    onChange={e => setAutoConfig({...autoConfig, totalAmount: e.target.value})} 
                                                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#1A4B9C]" 
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Installments Count</label>
                                                                <select 
                                                                    value={autoConfig.numInstallments} 
                                                                    onChange={e => setAutoConfig({...autoConfig, numInstallments: parseInt(e.target.value)})} 
                                                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#1A4B9C]"
                                                                >
                                                                    <option value={6}>6 Installments</option>
                                                                    <option value={12}>12 Installments (1 Yr)</option>
                                                                    <option value={18}>18 Installments</option>
                                                                    <option value={24}>24 Installments (2 Yrs)</option>
                                                                    <option value={36}>36 Installments (3 Yrs)</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Frequency</label>
                                                                <select 
                                                                    value={autoConfig.freq} 
                                                                    onChange={e => setAutoConfig({...autoConfig, freq: e.target.value})} 
                                                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#1A4B9C]"
                                                                >
                                                                    <option value="Monthly">Monthly</option>
                                                                    <option value="Quarterly">Quarterly</option>
                                                                    <option value="Semi-Annually">Semi-Annually</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">First Due Date</label>
                                                                <input 
                                                                    type="date" 
                                                                    value={autoConfig.startDate} 
                                                                    onChange={e => setAutoConfig({...autoConfig, startDate: e.target.value})} 
                                                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#1A4B9C]"
                                                                    required 
                                                                />
                                                            </div>
                                                            <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end">
                                                                <button 
                                                                    type="submit" 
                                                                    className="px-5 py-2.5 bg-[#1A4B9C] hover:bg-[#153B7C] text-white rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                                                                >
                                                                    Generate Auto Schedule Now
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}

                                                {/* Mode 2: Manual Installment Entry Form */}
                                                {installmentMode === 'manual' && (
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                                                        <h3 className="font-bold text-sm text-slate-800 mb-3">Add Manual Installment</h3>
                                                        <form onSubmit={handleAddInstallment} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                                                            <div className="w-full sm:flex-1">
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Installment Name</label>
                                                                <input type="text" placeholder="e.g. 1st Installment" required value={newInstallment.installment} onChange={e => setNewInstallment({...newInstallment, installment: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white" />
                                                            </div>
                                                            <div className="w-full sm:flex-1">
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                                                                <input type="date" required value={newInstallment.dueDate} onChange={e => setNewInstallment({...newInstallment, dueDate: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white text-slate-800" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount (৳)</label>
                                                                <input type="text" placeholder="e.g. 2,50,000" required value={newInstallment.amount} onChange={e => setNewInstallment({...newInstallment, amount: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white" />
                                                            </div>
                                                            <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold flex-shrink-0 hover:bg-[#153B7C] cursor-pointer">
                                                                Add Installment
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}

                                                {/* Installments Table with Deletion & Status Toggle */}
                                                <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                                    <thead>
                                                        <tr className="bg-slate-100 border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <th className="px-4 py-3">Installment No.</th>
                                                            <th className="px-4 py-3">Due Date</th>
                                                            <th className="px-4 py-3 text-right">Amount (৳)</th>
                                                            <th className="px-4 py-3 text-center">Status</th>
                                                            <th className="px-4 py-3 text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#E2E8F0]">
                                                        {clientInstallments.map(inst => (
                                                            <tr key={inst.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 text-sm font-bold text-slate-800">{inst.installment}</td>
                                                                <td className="px-4 py-3 text-sm text-slate-600">{inst.dueDate}</td>
                                                                <td className="px-4 py-3 text-sm font-bold text-right text-slate-800">৳ {inst.amount}</td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${inst.statusPill}`}>
                                                                        {inst.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <div className="flex items-center justify-center gap-3">
                                                                        {inst.status !== 'Paid' ? (
                                                                            <button onClick={() => handleMarkInstallmentPaid(inst.id)} className="text-[#006E1C] font-bold text-[10px] uppercase hover:underline flex items-center gap-1 cursor-pointer">
                                                                                <CheckCircle size={12} /> Mark Paid
                                                                            </button>
                                                                        ) : (
                                                                            <button onClick={() => updateInstallment(inst.id, { status: 'Pending', statusPill: 'bg-amber-100 text-amber-700' })} className="text-amber-700 font-bold text-[10px] uppercase hover:underline cursor-pointer">
                                                                                Set Pending
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => deleteInstallment(inst.id)} className="text-red-600 font-bold text-[10px] uppercase hover:underline cursor-pointer">
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {clientInstallments.length === 0 && (
                                                            <tr>
                                                                <td colSpan="5" className="p-6 text-center text-sm text-slate-500">
                                                                    No installments recorded for this client. Enter installment details above.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── TAB 3: TRANSACTIONS ── */}
                                {activeTab === 'transactions' && (
                                    <div className="space-y-8">
                                        <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
                                        
                                        {!editForm.propertyId ? (
                                            <p className="text-slate-500">No property assigned to this client.</p>
                                        ) : (
                                            <>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                                                    <h3 className="font-bold text-sm text-slate-800 mb-3">Log New Payment</h3>
                                                    <form onSubmit={handleAddTransaction} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Type</label>
                                                            <input type="text" placeholder="e.g. Bank Transfer" required value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                                                            <input type="text" placeholder="e.g. 15 Apr 2024" required value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount (৳)</label>
                                                            <input type="text" placeholder="e.g. 15,00,000" required value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold flex-shrink-0 w-full sm:w-auto">
                                                            Log Payment
                                                        </button>
                                                    </form>
                                                </div>

                                                <div className="space-y-3">
                                                    {clientTransactions.map(tx => (
                                                        <div key={tx.id} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1A4B9C] transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-[#DEF7EC] flex items-center justify-center text-[#03543F]">
                                                                    <CheckCircle size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800">{tx.type}</div>
                                                                    <div className="text-xs text-slate-500">{tx.date}</div>
                                                                </div>
                                                            </div>
                                                            <div className="font-bold text-lg text-slate-800">
                                                                ৳ {tx.amount}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {clientTransactions.length === 0 && (
                                                        <div className="p-4 text-center text-sm text-slate-500 border border-[#E2E8F0] rounded-lg">No transactions recorded.</div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── TAB 4: TICKETS ── */}
                                {activeTab === 'tickets' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
                                            <span className="text-xs font-bold text-slate-500">{clientTickets.length} ticket{clientTickets.length === 1 ? '' : 's'}</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {clientTickets.map(ticket => {
                                                const msgs = parseTicketMessages(ticket);
                                                const isReplying = replyingTicketId === ticket.id;
                                                return (
                                                <div key={ticket.id} className="border border-[#E2E8F0] rounded-lg p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold text-slate-500">{ticket.id}</span>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-xs text-slate-500">{ticket.date}</span>
                                                            </div>
                                                            <h3 className="font-bold text-slate-800 text-lg">{ticket.subject}</h3>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ticket.status === 'Resolved' ? 'bg-[#DEF7EC] text-[#03543F]' : ticket.status === 'In Review' ? 'bg-[#FDF6B2] text-[#723B13]' : 'bg-[#E1EFFE] text-[#1E429F]'}`}>
                                                            {ticket.status}
                                                        </span>
                                                    </div>

                                                    {/* Conversation Thread */}
                                                    <div className="space-y-3 max-h-72 overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col">
                                                        {msgs.map((m, idx) => {
                                                            const isClient = m.sender === 'client';
                                                            return (
                                                                <div key={idx} className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}>
                                                                    <div className={`p-3 rounded-lg text-xs max-w-[85%] ${
                                                                        isClient 
                                                                            ? 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200' 
                                                                            : 'bg-[#1A4B9C] text-white rounded-br-none'
                                                                    }`}>
                                                                        <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                                                                    </div>
                                                                    <span className="text-[9px] text-slate-400 mt-1 font-mono">{isClient ? selectedClient?.name || 'Client' : 'Official Support'} • {m.date}</span>
                                                                </div>
                                                            );
                                                        })}
                                                        {msgs.length === 0 && (
                                                            <div className="text-center text-xs text-slate-400 italic p-2">No messages in this thread yet.</div>
                                                        )}
                                                    </div>

                                                    {/* Reply Box */}
                                                    {ticket.status !== 'Resolved' && (
                                                        isReplying ? (
                                                            <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
                                                                <textarea
                                                                    rows="3"
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder={`Type your official response to ${selectedClient?.name || 'the client'}...`}
                                                                    className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                                                />
                                                                <div className="flex flex-wrap justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setReplyingTicketId(null); setReplyText(''); }}
                                                                        className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSendTicketReply(ticket, false)}
                                                                        className="px-3 py-1.5 text-xs text-[#1A4B9C] bg-blue-100 hover:bg-blue-200 rounded-lg font-bold cursor-pointer"
                                                                    >
                                                                        Send Reply (In Review)
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSendTicketReply(ticket, true)}
                                                                        className="px-4 py-1.5 text-xs text-white bg-[#1A4B9C] hover:bg-[#153B7C] rounded-lg font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                                                                    >
                                                                        <Send size={12} /> Send Reply & Resolve
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-wrap justify-end gap-2">
                                                                <button onClick={() => { setReplyingTicketId(ticket.id); setReplyText(''); }} className="px-4 py-1.5 bg-[#1A4B9C] hover:bg-[#153B7C] text-white rounded text-sm font-bold transition-colors flex items-center gap-2">
                                                                    <CornerDownRight size={14} /> Reply Back
                                                                </button>
                                                                <button onClick={() => resolveTicket(ticket.id)} className="px-4 py-1.5 bg-[#006E1C] text-white rounded text-sm font-bold hover:bg-[#005215] transition-colors flex items-center gap-2">
                                                                    <CheckCircle size={14} /> Mark as Resolved
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                );
                                            })}
                                            {clientTickets.length === 0 && (
                                                <div className="p-4 text-center text-sm text-slate-500 border border-[#E2E8F0] rounded-lg">No active tickets for this client.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClientManagement;
