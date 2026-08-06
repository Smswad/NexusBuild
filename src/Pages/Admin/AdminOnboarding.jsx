import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../Context/AdminDataContext';

const AdminOnboarding = () => {
    const { applications, advanceApplicationStage, approveAllApplications, onboardClient } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApplications = applications.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Action Required': return 'bg-red-100 text-red-700';
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Registration</div>
                    <h1 className="text-2xl font-bold text-slate-800">Client Onboarding</h1>
                    <p className="text-slate-500 text-sm mt-1">Review, verify, and approve new client applications.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert("Advanced filtering will be available soon.")} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium shadow-sm transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button onClick={approveAllApplications} className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors">
                        <UserCheck size={14} /> Auto-Approve Batch
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Applications</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">112</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Active pipeline</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pending KYC</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">24</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Awaiting docs</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm bg-red-50">
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Action Required</div>
                    <div className="text-2xl font-extrabold text-red-700 mt-1">5</div>
                    <div className="text-[10px] text-red-600 mt-1 uppercase font-medium">Needs management review</div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Approved (MTD)</div>
                    <div className="text-2xl font-extrabold mt-1">42</div>
                    <div className="text-[10px] text-emerald-300 mt-1 font-bold uppercase">Ready for handover</div>
                </div>
            </div>

            {/* Onboarding Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Application Queue</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-64 outline-none focus:border-[#1A4B9C]"
                            />
                        </div>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Applicant Name</th>
                            <th className="px-6 py-3">Property Unit</th>
                            <th className="px-6 py-3">Submission Date</th>
                            <th className="px-6 py-3">Current Stage</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredApplications.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 text-xs">{app.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{app.id}</div>
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-slate-800">
                                    {app.unit}
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-600">
                                    {app.date}
                                </td>
                                <td className="px-6 py-3 text-xs font-bold text-[#1A4B9C]">
                                    {app.stage}
                                </td>
                                <td className="px-6 py-3">
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    {app.stage !== 'Completed' ? (
                                        <button onClick={() => advanceApplicationStage(app.id)} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                            Approve Stage <ChevronRight size={12} />
                                        </button>
                                    ) : (
                                        <button onClick={() => onboardClient(app.id)} className="flex items-center gap-1 text-emerald-600 font-bold text-xs hover:underline bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                            Onboard as Client <ChevronRight size={12} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminOnboarding;
