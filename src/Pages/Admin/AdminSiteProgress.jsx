import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Camera, Image as ImageIcon, Send, Clock, CheckCircle, Circle } from 'lucide-react';

const AdminSiteProgress = () => {
    const { projects, activeProject, updateProjectPhase, addSiteUpdate } = useAdminData();

    // Find matching project. If activeProject is 'all', default to the first project in the list.
    const selectedProject = projects.find(p => p.id === activeProject) || projects[0];

    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');

    const phases = [
        { id: 1, name: 'Piling', date: 'Completed Dec 23', progress: 100 },
        { id: 2, name: 'Structural / Basement', date: 'Completed Feb 24', progress: 100 },
        { id: 3, name: 'Slabs & Brickwork', date: 'Target: May 24', progress: 85 },
        { id: 4, name: 'Handover', date: 'Target: Dec 24', progress: 0 },
    ];

    if (!selectedProject) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center text-slate-500">
                <span className="loading loading-spinner loading-md text-[#1A4B9C] mb-2"></span>
                <p className="text-sm font-semibold">Loading construction projects...</p>
            </div>
        );
    }

    const currentPhase = selectedProject.progressPhase;

    const handlePhaseChange = (phaseId) => {
        updateProjectPhase(selectedProject.id, phaseId);
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        addSiteUpdate(selectedProject.id, broadcastSubject, broadcastMsg);
        alert(`Broadcast sent to all clients in ${selectedProject.name}!`);
        setBroadcastSubject('');
        setBroadcastMsg('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
                <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Project Switcher</div>
                <h1 className="text-2xl font-bold text-slate-800">{selectedProject.name} Construction</h1>
                <p className="text-slate-500 text-sm mt-1">Real-time site progress and milestone tracking.</p>
            </div>

            <div className="flex gap-6">
                {/* Timeline Column */}
                <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-slate-800">Milestone Tracker</h3>
                        <div className="px-3 py-1 bg-[#E1EFFE] text-[#1A4B9C] rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Phase {currentPhase} Active
                        </div>
                    </div>

                    <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                        {phases.map((phase) => {
                            const isCompleted = phase.id < currentPhase;
                            const isActive = phase.id === currentPhase;
                            return (
                                <div key={phase.id} className="relative">
                                    <div className={`absolute -left-[37px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${isCompleted ? 'border-emerald-500 text-emerald-500' : isActive ? 'border-[#1A4B9C] text-[#1A4B9C]' : 'border-slate-300 text-slate-300'}`}>
                                        {isCompleted ? <CheckCircle size={14} /> : <Circle size={10} fill="currentColor" />}
                                    </div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className={`text-sm font-bold ${isActive ? 'text-[#1A4B9C]' : 'text-slate-800'}`}>{phase.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{phase.date}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isActive && <button onClick={() => handlePhaseChange(phase.id + 1)} className="text-[10px] bg-[#1A4B9C] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider hover:bg-[#153B7C] transition-colors">Mark Complete</button>}
                                            {isCompleted && <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle size={12}/> COMPLETED</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                                            <div className={`h-full ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-[#1A4B9C]' : 'bg-transparent'} transition-all duration-500`} style={{ width: isCompleted ? '100%' : isActive ? `${phase.progress}%` : '0%' }}></div>
                                        </div>
                                        {isActive && (
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                                                {phase.progress}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Broadcast Column */}
                <div className="w-[380px] space-y-6">
                    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MegaphoneIcon />
                            <h3 className="text-sm font-bold text-slate-800">Broadcast Update</h3>
                        </div>
                        <form onSubmit={handleBroadcast} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject Line</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]"
                                    placeholder="e.g., Slab 6 Concrete Pour Completed"
                                    value={broadcastSubject}
                                    onChange={(e) => setBroadcastSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Update Details</label>
                                <textarea 
                                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C] h-24 resize-none"
                                    placeholder="Provide details about the update..."
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                <ImageIcon size={20} className="mx-auto text-slate-400 mb-2" />
                                <div className="text-xs font-bold text-slate-700">Click to upload images</div>
                                <div className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 5MB</div>
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#1A4B9C] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#153B7C] transition-colors shadow-sm">
                                <Send size={14} /> Send Broadcast
                            </button>
                        </form>
                    </div>

                    {/* Recent Photos */}
                    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Site Photos</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center"><Camera className="text-slate-400" /></div>
                            <div className="h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center"><Camera className="text-slate-400" /></div>
                            <div className="h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center"><Camera className="text-slate-400" /></div>
                            <div className="h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center"><Camera className="text-slate-400" /></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Extracted simple Megaphone icon wrapper
const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A4B9C]">
        <path d="M3 11l18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
    </svg>
);

export default AdminSiteProgress;
