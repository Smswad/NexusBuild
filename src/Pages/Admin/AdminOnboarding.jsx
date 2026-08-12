import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../Context/AdminDataContext';
import { showToast } from '../../Components/Toast/globalToast';

const AdminOnboarding = () => {
    const { 
        applications, 
        projects, 
        advanceApplicationStage, 
        approveAllApplications, 
        onboardClient, 
        rejectApplication 
    } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showSchedulerModal, setShowSchedulerModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState('p1');
    const [selectedUnitName, setSelectedUnitName] = useState('Not specified');
    const [numInstallments, setNumInstallments] = useState(12);
    const [freq, setFreq] = useState('Monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              app.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const selectedApp = applications.find(a => a.id === selectedAppId);

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
        <div className="max-w-5xl mx-auto space-y-6 px-4 lg:px-0 text-slate-800">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Registration</div>
                    <h1 className="text-2xl font-bold text-slate-800">Client Onboarding</h1>
                    <p className="text-slate-500 text-sm mt-1">Review, verify, and approve new client applications.</p>
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
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
                    <button onClick={approveAllApplications} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-medium shadow-sm transition-colors cursor-pointer flex-shrink-0">
                        <UserCheck size={14} /> Auto-Approve Batch
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Applications</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">{(applications || []).length}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Active pipeline</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pending KYC</div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-1">
                        {(applications || []).filter(a => a.status === 'Pending' || a.stage === 'KYC Verification').length}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase">Awaiting docs</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm bg-red-50">
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Action Required</div>
                    <div className="text-2xl font-extrabold text-red-700 mt-1">
                        {(applications || []).filter(a => a.status === 'Action Required').length}
                    </div>
                    <div className="text-[10px] text-red-600 mt-1 uppercase font-medium">Needs management review</div>
                </div>
                <div className="bg-[#1A4B9C] p-4 rounded-xl border border-[#153B7C] shadow-sm text-white">
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Approved (MTD)</div>
                    <div className="text-2xl font-extrabold mt-1">
                        {(applications || []).filter(a => a.status === 'Approved').length}
                    </div>
                    <div className="text-[10px] text-emerald-300 mt-1 font-bold uppercase">Ready for onboarding</div>
                </div>
            </div>

            {/* Onboarding Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Application Queue</h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-[#E2E8F0] rounded-lg text-xs w-full sm:w-64 outline-none focus:border-[#1A4B9C] bg-white text-slate-800"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
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
                                    {app.stage === 'Verify Client' ? (
                                        <button 
                                            onClick={() => {
                                                setSelectedAppId(app.id);
                                                setSelectedProjectId(projects[0]?.id || 'p1');
                                                setSelectedUnitName('Not specified');
                                                setShowVerifyModal(true);
                                            }} 
                                            className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline bg-blue-50 border border-blue-200 px-2 py-1 rounded cursor-pointer"
                                        >
                                            Verify <ChevronRight size={12} />
                                        </button>
                                    ) : app.stage !== 'Completed' ? (
                                        <button onClick={() => advanceApplicationStage(app.id)} className="flex items-center gap-1 text-[#1A4B9C] font-bold text-xs hover:underline">
                                            Approve Stage <ChevronRight size={12} />
                                        </button>
                                    ) : (
                                         <button 
                                             onClick={() => {
                                                 setSelectedAppId(app.id);
                                                 setShowSchedulerModal(true);
                                             }} 
                                             className="flex items-center gap-1 text-emerald-600 font-bold text-xs hover:underline bg-emerald-50 px-2 py-1 rounded border border-emerald-200 cursor-pointer"
                                         >
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

             {/* Onboarding Scheduler Modal */}
             {showSchedulerModal && (
                 <div className="fixed inset-0 bg-[#000f22]/50 flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all text-slate-800">
                         <div className="bg-[#1A4B9C] text-white p-6">
                             <h3 className="text-xl font-bold">Configure Installment Plan</h3>
                             <p className="text-blue-100 text-sm mt-1">
                                 Configure an installment plan for onboarding client or skip to configure later.
                             </p>
                         </div>
                         <div className="p-6 flex flex-col gap-4">
                             <div>
                                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Number of Installments</label>
                                 <select 
                                     value={numInstallments} 
                                     onChange={(e) => setNumInstallments(parseInt(e.target.value))}
                                     className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#1A4B9C]"
                                 >
                                     <option value={6}>6 Installments</option>
                                     <option value={12}>12 Installments (1 Year)</option>
                                     <option value={18}>18 Installments</option>
                                     <option value={24}>24 Installments (2 Years)</option>
                                     <option value={36}>36 Installments (3 Years)</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Payment Frequency</label>
                                 <select 
                                     value={freq} 
                                     onChange={(e) => setFreq(e.target.value)}
                                     className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#1A4B9C]"
                                 >
                                     <option value="Monthly">Monthly</option>
                                     <option value="Quarterly">Quarterly</option>
                                     <option value="Semi-Annually">Semi-Annually</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">First Payment Start Date</label>
                                 <input 
                                     type="date" 
                                     value={startDate} 
                                     onChange={(e) => setStartDate(e.target.value)} 
                                     className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#1A4B9C]"
                                     required 
                                 />
                             </div>
                             <div className="flex gap-3 mt-4 justify-between">
                                 <button 
                                     type="button" 
                                     onClick={async () => {
                                         await onboardClient(selectedAppId);
                                         setShowSchedulerModal(false);
                                         showToast('Client onboarded successfully. Installment plan skipped.', 'success', 'Client Onboarded');
                                     }}
                                     className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer"
                                 >
                                     Skip & Onboard
                                 </button>
                                 <div className="flex gap-2">
                                     <button 
                                         type="button" 
                                         onClick={() => setShowSchedulerModal(false)}
                                         className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer"
                                     >
                                         Cancel
                                     </button>
                                     <button 
                                         type="button"
                                         onClick={async () => {
                                             await onboardClient(selectedAppId, { numInstallments, freq, startDate });
                                             setShowSchedulerModal(false);
                                             showToast('Client onboarded successfully with installment plan!', 'success', 'Client Onboarded');
                                         }}
                                         className="px-4 py-2 bg-[#1A4B9C] hover:bg-[#153B7C] text-white font-semibold rounded-md transition-colors cursor-pointer"
                                     >
                                         Confirm & Onboard
                                     </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* Onboarding Verification Modal */}
             {showVerifyModal && selectedApp && (
                 <div className="fixed inset-0 bg-[#000f22]/50 flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all text-slate-800">
                         <div className="bg-[#1A4B9C] text-white p-6">
                             <h3 className="text-xl font-bold">Verify Client Registration</h3>
                             <p className="text-blue-100 text-sm mt-1 font-medium">
                                 Review client details and assign a project to approve their registration.
                             </p>
                         </div>
                         <div className="p-6 flex flex-col gap-4">
                             {/* Client Info Card */}
                             <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                                 <div>
                                     <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Full Name</span>
                                     <span className="text-sm font-semibold text-slate-800">{selectedApp.name}</span>
                                 </div>
                                 <div>
                                     <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Email Address</span>
                                     <span className="text-sm font-semibold text-slate-800">{selectedApp.email || 'N/A'}</span>
                                 </div>
                                 <div>
                                     <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Phone Number</span>
                                     <span className="text-sm font-semibold text-slate-800">{selectedApp.phone || 'N/A'}</span>
                                 </div>
                             </div>

                             {/* Project Selector */}
                             <div>
                                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Assign Project</label>
                                 <select 
                                     value={selectedProjectId} 
                                     onChange={(e) => {
                                         setSelectedProjectId(e.target.value);
                                         setSelectedUnitName('Not specified');
                                     }}
                                     className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#1A4B9C] text-sm"
                                 >
                                     {projects.map(p => (
                                         <option key={p.id} value={p.id}>{p.name}</option>
                                     ))}
                                 </select>
                             </div>

                             {/* Unit Name Input (Dropdown Selector) */}
                             <div>
                                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Assign Property Unit</label>
                                 {(() => {
                                     let availableFlats = [];
                                     try {
                                         const stored = localStorage.getItem('flats_project_' + selectedProjectId);
                                         if (stored) {
                                             const list = JSON.parse(stored);
                                             availableFlats = list.filter(f => f.status === 'AVAILABLE' || f.status === 'RESERVED' || f.unit === selectedUnitName);
                                         } else {
                                             availableFlats = [
                                                 { id: 'f1', unit: 'Flat 1A', size: '1,200 sqft', price: '৳1.25Cr', status: 'AVAILABLE' },
                                                 { id: 'f2', unit: 'Flat 1B', size: '1,500 sqft', price: '৳1.55Cr', status: 'SOLD' },
                                                 { id: 'f3', unit: 'Flat 2A', size: '1,200 sqft', price: '৳1.25Cr', status: 'RESERVED' },
                                                 { id: 'f4', unit: 'Flat 2B', size: '1,500 sqft', price: '৳1.55Cr', status: 'AVAILABLE' }
                                             ].filter(f => f.status === 'AVAILABLE' || f.status === 'RESERVED');
                                         }
                                     } catch(e) {
                                         availableFlats = [];
                                     }

                                     return (
                                         <select 
                                             value={selectedUnitName} 
                                             onChange={(e) => setSelectedUnitName(e.target.value)}
                                             className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#1A4B9C] text-sm bg-white"
                                         >
                                             <option value="Not specified">Select Unit...</option>
                                             {availableFlats.map(f => (
                                                 <option key={f.id} value={f.unit}>
                                                     {f.unit} ({f.size} - {f.price}) - {f.status}
                                                 </option>
                                             ))}
                                         </select>
                                     );
                                 })()}
                             </div>

                             {/* Modal Actions */}
                             <div className="flex gap-3 mt-4 justify-between">
                                 <button 
                                     type="button" 
                                     onClick={async () => {
                                         if (window.confirm(`Are you sure you want to REJECT and delete registration for ${selectedApp.name}?`)) {
                                             await rejectApplication(selectedApp.id);
                                             setShowVerifyModal(false);
                                             showToast('Registration rejected.', 'error', 'Application Rejected');
                                         }
                                     }}
                                     className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-md font-semibold text-sm transition-colors cursor-pointer"
                                 >
                                     Reject Registration
                                 </button>
                                 <div className="flex gap-2">
                                     <button 
                                         type="button" 
                                         onClick={() => setShowVerifyModal(false)}
                                         className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-semibold cursor-pointer"
                                     >
                                         Cancel
                                     </button>
                                     <button 
                                         type="button"
                                         onClick={async () => {
                                             await onboardClient(selectedApp.id, selectedProjectId, null, selectedUnitName);
                                             setShowVerifyModal(false);
                                             showToast('Client verified and onboarded successfully! Set financial details in Client Management Hub.', 'success', 'Client Verified');
                                         }}
                                         className="px-4 py-2 bg-[#1A4B9C] hover:bg-[#153B7C] text-white font-semibold rounded-md transition-colors text-sm cursor-pointer"
                                     >
                                         Accept
                                     </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

         </div>
    );
};

export default AdminOnboarding;
