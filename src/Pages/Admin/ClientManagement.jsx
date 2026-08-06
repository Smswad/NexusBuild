import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Search, Filter, Download, Plus, ChevronRight, X, User, CreditCard, Wallet, MessageSquare, CheckCircle } from 'lucide-react';

const ClientManagement = () => {
    const { 
        clients, properties, installments, transactions, tickets, leads,
        addClient, updateClient, updateProperty, 
        addInstallment, updateInstallment, addTransaction, resolveTicket 
    } = useAdminData();
    
    const [searchTerm, setSearchTerm] = useState('');
    
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
        unitName: '', area: '', handoverDate: '', totalValuation: '', totalPaid: '', dueBalance: '', location: ''
    });

    // Sub-forms state
    const [newInstallment, setNewInstallment] = useState({ installment: '', dueDate: '', amount: '' });
    const [newTransaction, setNewTransaction] = useState({ type: '', date: '', amount: '' });

    const formatBDT = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(amount.toString().replace(/,/g, '')));
    };

    const handleAddClient = (e) => {
        e.preventDefault();
        addClient(newClient);
        setIsAddModalOpen(false);
        setNewClient({ name: '', email: '', phone: '', status: 'Active' });
    };

    const openEditModal = (client, prop) => {
        setSelectedClient(client);
        setActiveTab('profile');
        setEditForm({
            name: client.name,
            email: client.email,
            phone: client.phone,
            status: client.status,
            propertyId: prop ? prop.id : null,
            unitName: prop ? prop.unitName : '',
            area: prop ? prop.area : '',
            handoverDate: prop ? prop.handoverDate : '',
            totalValuation: prop ? prop.totalValuation : '',
            totalPaid: prop ? prop.totalPaid : '',
            dueBalance: prop ? prop.dueBalance : '',
            location: prop ? prop.location : ''
        });
        setIsEditModalOpen(true);
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
                dueBalance: editForm.dueBalance,
                location: editForm.location
            });
        }
        // Don't close modal immediately, allow user to keep editing or switch tabs
        alert("Profile & Property details saved successfully.");
    };

    const handleAddInstallment = (e) => {
        e.preventDefault();
        if (!editForm.propertyId) return;
        addInstallment({
            propertyId: editForm.propertyId,
            installment: newInstallment.installment,
            dueDate: newInstallment.dueDate,
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

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtered data for the active client
    const clientInstallments = editForm.propertyId ? installments.filter(i => i.propertyId === editForm.propertyId) : [];
    const clientTransactions = editForm.propertyId ? transactions.filter(t => t.propertyId === editForm.propertyId) : [];
    const clientTickets = selectedClient ? tickets.filter(t => t.clientId === selectedClient.id) : [];

    const totalDue = properties.reduce((sum, p) => sum + (parseInt(String(p.dueBalance).replace(/,/g, '')) || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Client Management</div>
                    <h1 className="text-2xl font-bold text-slate-800">Master Client Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all active clients, update financial standing, and resolve tickets.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert("Advanced filtering will be available soon.")} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <Plus size={14} /> Add Client
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
                    <div className="text-2xl font-extrabold text-[#1A4B9C] mt-1">{clients.length} <span className="text-xs font-bold text-emerald-600 ml-1">↑ +{leads.length} LEADS</span></div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Total Outstanding Due</div>
                    <div className="text-2xl font-extrabold mt-1">৳ {formatBDT(totalDue)}</div>
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
                        
                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-64 bg-slate-50 border-r border-[#E2E8F0] flex flex-col p-4 gap-2 flex-shrink-0">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <User size={18} /> Profile & Property
                                </button>
                                <button 
                                    onClick={() => setActiveTab('installments')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'installments' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <CreditCard size={18} /> Installment Schedule
                                </button>
                                <button 
                                    onClick={() => setActiveTab('transactions')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'transactions' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Wallet size={18} /> Transactions Log
                                </button>
                                <button 
                                    onClick={() => setActiveTab('tickets')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'tickets' ? 'bg-[#1A4B9C] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <MessageSquare size={18} /> Support Tickets
                                </button>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white relative">
                                
                                {/* ── TAB 1: PROFILE & PROPERTY ── */}
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleSaveProfile} className="space-y-8 max-w-3xl">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1A4B9C] border-b border-[#E2E8F0] pb-2 mb-4">Personal Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
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
                                                <div className="grid grid-cols-2 gap-4">
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
                                                        <input type="text" value={editForm.totalValuation} onChange={e => setEditForm({...editForm, totalValuation: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paid (৳)</label>
                                                        <input type="text" value={editForm.totalPaid} onChange={e => setEditForm({...editForm, totalPaid: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Balance (৳)</label>
                                                        <input type="text" value={editForm.dueBalance} onChange={e => setEditForm({...editForm, dueBalance: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm text-slate-500">
                                                This client does not have any assigned properties yet.
                                            </div>
                                        )}
                                        <div className="pt-4 border-t border-[#E2E8F0]">
                                            <button type="submit" className="px-6 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C] transition-colors shadow-sm">
                                                Save Profile & Property
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* ── TAB 2: INSTALLMENTS ── */}
                                {activeTab === 'installments' && (
                                    <div className="space-y-8">
                                        <h2 className="text-xl font-bold text-slate-800">Installment Schedule</h2>
                                        
                                        {!editForm.propertyId ? (
                                            <p className="text-slate-500">No property assigned to this client.</p>
                                        ) : (
                                            <>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                                                    <h3 className="font-bold text-sm text-slate-800 mb-3">Add New Installment</h3>
                                                    <form onSubmit={handleAddInstallment} className="flex gap-4 items-end">
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Installment Name</label>
                                                            <input type="text" placeholder="e.g. Installment 06" required value={newInstallment.installment} onChange={e => setNewInstallment({...newInstallment, installment: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                                                            <input type="text" placeholder="e.g. 10 May 2024" required value={newInstallment.dueDate} onChange={e => setNewInstallment({...newInstallment, dueDate: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount (৳)</label>
                                                            <input type="text" placeholder="e.g. 25,00,000" required value={newInstallment.amount} onChange={e => setNewInstallment({...newInstallment, amount: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                                                        </div>
                                                        <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold flex-shrink-0">
                                                            Add Installment
                                                        </button>
                                                    </form>
                                                </div>

                                                <table className="w-full text-left border-collapse border border-[#E2E8F0] rounded-lg overflow-hidden">
                                                    <thead>
                                                        <tr className="bg-slate-100 border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <th className="px-4 py-3">Installment No.</th>
                                                            <th className="px-4 py-3">Due Date</th>
                                                            <th className="px-4 py-3 text-right">Amount (৳)</th>
                                                            <th className="px-4 py-3 text-center">Status</th>
                                                            <th className="px-4 py-3 text-center">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#E2E8F0]">
                                                        {clientInstallments.map(inst => (
                                                            <tr key={inst.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 text-sm font-bold text-slate-800">{inst.installment}</td>
                                                                <td className="px-4 py-3 text-sm text-slate-600">{inst.dueDate}</td>
                                                                <td className="px-4 py-3 text-sm font-bold text-right text-slate-800">{inst.amount}</td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${inst.statusPill}`}>
                                                                        {inst.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    {inst.status !== 'Paid' && (
                                                                        <button onClick={() => handleMarkInstallmentPaid(inst.id)} className="text-[#006E1C] font-bold text-[10px] uppercase hover:underline flex items-center justify-center gap-1 mx-auto">
                                                                            <CheckCircle size={12} /> Mark Paid
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {clientInstallments.length === 0 && (
                                                            <tr>
                                                                <td colSpan="5" className="p-4 text-center text-sm text-slate-500">No installments recorded.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
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
                                                    <form onSubmit={handleAddTransaction} className="flex gap-4 items-end">
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
                                                        <button type="submit" className="px-4 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold flex-shrink-0">
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
                                        <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
                                        
                                        <div className="space-y-4">
                                            {clientTickets.map(ticket => (
                                                <div key={ticket.id} className="border border-[#E2E8F0] rounded-lg p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
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
                                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">{ticket.message}</p>
                                                    
                                                    {ticket.status !== 'Resolved' && (
                                                        <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex justify-end">
                                                            <button onClick={() => resolveTicket(ticket.id)} className="px-4 py-1.5 bg-[#006E1C] text-white rounded text-sm font-bold hover:bg-[#005215] transition-colors flex items-center gap-2">
                                                                <CheckCircle size={14} /> Mark as Resolved
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
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
