import React, { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette, Settings, CheckCircle } from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
                <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Configuration</div>
                <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage global platform configurations and preferences.</p>
            </div>

            <div className="flex gap-6 items-start">
                
                {/* Sidebar Navigation */}
                <div className="w-[240px] bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                    <div className="p-4 border-b border-[#E2E8F0] bg-slate-50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Settings Menu</div>
                    </div>
                    <nav className="p-2 space-y-1">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-[#E1EFFE] text-[#1A4B9C]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Settings size={16} className={activeTab === 'general' ? 'text-[#1A4B9C]' : 'text-slate-400'} /> General Info
                        </button>
                        <button 
                            onClick={() => setActiveTab('branding')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'branding' ? 'bg-[#E1EFFE] text-[#1A4B9C]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Palette size={16} className={activeTab === 'branding' ? 'text-[#1A4B9C]' : 'text-slate-400'} /> Branding & Colors
                        </button>
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-[#E1EFFE] text-[#1A4B9C]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Bell size={16} className={activeTab === 'notifications' ? 'text-[#1A4B9C]' : 'text-slate-400'} /> Notifications
                        </button>
                        <button 
                            onClick={() => setActiveTab('roles')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'roles' ? 'bg-[#E1EFFE] text-[#1A4B9C]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Shield size={16} className={activeTab === 'roles' ? 'text-[#1A4B9C]' : 'text-slate-400'} /> Roles & Permissions
                        </button>
                    </nav>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {activeTab === 'general' && <><Settings size={16} className="text-[#1A4B9C]"/> General Information</>}
                            {activeTab === 'branding' && <><Palette size={16} className="text-[#1A4B9C]"/> Branding & Colors</>}
                            {activeTab === 'notifications' && <><Bell size={16} className="text-[#1A4B9C]"/> Notification Rules</>}
                            {activeTab === 'roles' && <><Shield size={16} className="text-[#1A4B9C]"/> Roles & Permissions</>}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="p-6">
                        
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                                        <input type="text" defaultValue="Reliance Housing Ltd." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Registration Number</label>
                                        <input type="text" defaultValue="REG-2023-998811" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Head Office Address</label>
                                    <input type="text" defaultValue="123 Corporate Tower, Banani, Dhaka" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Support Email</label>
                                        <input type="email" defaultValue="support@reliancehousing.com" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Support Phone</label>
                                        <input type="text" defaultValue="+880 1700-123456" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BRANDING TAB */}
                        {activeTab === 'branding' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-center text-[#1A4B9C]">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <button type="button" className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                                Change Logo
                                            </button>
                                            <div className="text-[10px] text-slate-500 mt-1">Recommended size: 200x200px (PNG, SVG)</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr className="border-[#E2E8F0]" />
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Theme Color</label>
                                    <div className="flex gap-3">
                                        <button type="button" className="w-8 h-8 rounded-full bg-[#1A4B9C] flex items-center justify-center text-white ring-2 ring-offset-2 ring-[#1A4B9C]"><CheckCircle size={14}/></button>
                                        <button type="button" className="w-8 h-8 rounded-full bg-[#03543F]"></button>
                                        <button type="button" className="w-8 h-8 rounded-full bg-[#4F46E5]"></button>
                                        <button type="button" className="w-8 h-8 rounded-full bg-[#0F172A]"></button>
                                        <button type="button" className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-slate-400">+</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1A4B9C] transition-colors">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Email Alerts for New Tickets</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">Send an email to support staff when a client submits a new ticket.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A4B9C]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1A4B9C] transition-colors">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Automated Payment Reminders</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">Automatically send reminders 7 days before installment due dates.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A4B9C]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1A4B9C] transition-colors">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Client Onboarding SMS</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">Send a welcome SMS when an application is fully approved.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A4B9C]"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ROLES TAB */}
                        {activeTab === 'roles' && (
                            <div className="space-y-4">
                                <div className="text-sm font-bold text-slate-800 mb-2">Administrative Access</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-[#1A4B9C]">Super Admin</div>
                                            <div className="px-2 py-0.5 bg-[#E1EFFE] text-[#1A4B9C] text-[10px] font-bold rounded uppercase">Active</div>
                                        </div>
                                        <div className="text-[10px] text-slate-500">Full access to all modules, financial ledgers, and system settings.</div>
                                    </div>
                                    <div className="border border-[#E2E8F0] rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-slate-800">Project Manager</div>
                                        </div>
                                        <div className="text-[10px] text-slate-500">Access limited to Site Progress, Messaging, and limited Client Directory.</div>
                                    </div>
                                    <div className="border border-[#E2E8F0] rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-slate-800">Finance Officer</div>
                                        </div>
                                        <div className="text-[10px] text-slate-500">Read/Write access to Financial Ledgers, Installments, and Invoicing.</div>
                                    </div>
                                    <div className="border border-dashed border-[#E2E8F0] rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <Shield size={16} className="mb-1" />
                                        <div className="text-xs font-bold text-slate-600">Create Custom Role</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
                            <button type="button" className="px-4 py-2 bg-white border border-[#E2E8F0] text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-[#1A4B9C] text-white rounded-lg text-sm font-bold hover:bg-[#153B7C] transition-colors shadow-sm">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
