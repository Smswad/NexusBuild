import React, { useState } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Camera, Image as ImageIcon, Send, Clock, CheckCircle, Circle, Edit3, Plus, X, Save } from 'lucide-react';

const AdminSiteProgress = () => {
    const { 
        projects, activeProject, updateProjectPhase, updateProjectMilestones, addSiteUpdate,
        projectPhotos = [], addProjectPhoto, deleteProjectPhoto 
    } = useAdminData();

    // Find matching project. If activeProject is 'all', default to the first project in the list.
    const selectedProject = projects.find(p => p.id === activeProject) || projects[0];

    const fileInputRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const currentPhotos = projectPhotos.filter(p => p.projectId === (selectedProject?.id || 'p1'));

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesUpload(e.dataTransfer.files);
        }
    };

    const handleFilesUpload = (files) => {
        if (!files || files.length === 0 || !selectedProject) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                addProjectPhoto(selectedProject.id, dataUrl, file.name);
            };
            reader.readAsDataURL(file);
        });
    };

    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');

    // Modal state for editing phase
    const [editingPhase, setEditingPhase] = useState(null);
    const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
    const [newPhaseForm, setNewPhaseForm] = useState({ name: '', date: 'Target: Q4 2026', progress: 0 });

    if (!selectedProject) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center text-slate-500">
                <span className="loading loading-spinner loading-md text-[#1A4B9C] mb-2"></span>
                <p className="text-sm font-semibold">Loading construction projects...</p>
            </div>
        );
    }

    const defaultPhases = [
        { id: 1, name: 'Piling & Foundation', date: 'Completed Dec 23', progress: 100 },
        { id: 2, name: 'Structural Basement & Columns', date: 'Target: Feb 24', progress: 0 },
        { id: 3, name: 'Slabs Casting & Brickwork', date: 'Target: May 26', progress: 0 },
        { id: 4, name: 'Finishing & Handover', date: 'Target: Dec 26', progress: 0 },
    ];

    const phases = selectedProject?.phases || defaultPhases;
    const currentPhase = selectedProject?.progressPhase || selectedProject?.progress_phase || 1;

    const handlePhaseChange = async (phaseId) => {
        await updateProjectPhase(selectedProject.id, phaseId);
    };

    const handleSavePhaseEdit = async (e) => {
        e.preventDefault();
        if (!editingPhase) return;
        const updatedPhases = phases.map(p => p.id === editingPhase.id ? { ...editingPhase, progress: parseInt(editingPhase.progress) || 0 } : p);
        if (updateProjectMilestones) {
            await updateProjectMilestones(selectedProject.id, updatedPhases);
        }
        setEditingPhase(null);
        alert(`Milestone "${editingPhase.name}" saved to database successfully!`);
    };

    const handleAddPhaseSubmit = async (e) => {
        e.preventDefault();
        if (!newPhaseForm.name) return;
        const nextId = phases.length > 0 ? Math.max(...phases.map(p => p.id)) + 1 : 1;
        const updatedPhases = [...phases, { id: nextId, name: newPhaseForm.name, date: newPhaseForm.date, progress: parseInt(newPhaseForm.progress) || 0 }];
        if (updateProjectMilestones) {
            await updateProjectMilestones(selectedProject.id, updatedPhases);
        }
        setIsAddPhaseOpen(false);
        setNewPhaseForm({ name: '', date: 'Target: Q4 2026', progress: 0 });
        alert(`New milestone "${newPhaseForm.name}" saved to database!`);
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
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Project Switcher</div>
                    <h1 className="text-2xl font-bold text-slate-800">{selectedProject.name} Construction</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time site progress and milestone tracking.</p>
                </div>
                <button 
                    onClick={() => setIsAddPhaseOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                    <Plus size={14} /> Add New Milestone
                </button>
            </div>

            <div className="flex gap-6">
                {/* Timeline Column */}
                <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Milestone Tracker</h3>
                            <p className="text-xs text-slate-500">Edit milestones, progress percentages, and target completion dates</p>
                        </div>
                        <div className="px-3 py-1 bg-[#E1EFFE] text-[#1A4B9C] rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {currentPhase > phases.length ? 'All Phases Complete' : `Phase ${currentPhase} Active`}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1">Set Active Site Phase:</span>
                        {phases.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handlePhaseChange(p.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    currentPhase === p.id 
                                        ? 'bg-[#1A4B9C] text-white shadow-sm' 
                                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                Phase {p.id}: {p.name.split('\n')[0]}
                            </button>
                        ))}
                    </div>

                    <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                        {phases.map((phase) => {
                            const isCompleted = phase.id < currentPhase || phase.progress >= 100;
                            const isActive = phase.id === currentPhase && phase.progress < 100;
                            return (
                                <div key={phase.id} className="relative group">
                                    <div className={`absolute -left-[37px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${isCompleted ? 'border-emerald-500 text-emerald-500' : isActive ? 'border-[#1A4B9C] text-[#1A4B9C]' : 'border-slate-300 text-slate-300'}`}>
                                        {isCompleted ? <CheckCircle size={14} /> : <Circle size={10} fill="currentColor" />}
                                    </div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${isActive ? 'text-[#1A4B9C]' : 'text-slate-800'}`}>{phase.name}</span>
                                                <button 
                                                    onClick={() => setEditingPhase({ ...phase })} 
                                                    className="p-1 text-slate-400 hover:text-[#1A4B9C] transition-colors cursor-pointer"
                                                    title="Edit Milestone"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{phase.date}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isActive && !isCompleted && (
                                                <button onClick={() => handlePhaseChange(phase.id + 1)} className="text-[10px] bg-[#1A4B9C] text-white px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-[#153B7C] transition-colors cursor-pointer">
                                                    Mark Complete
                                                </button>
                                            )}
                                            {isCompleted && (
                                                <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                    <CheckCircle size={12}/> COMPLETED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar & Percentage Controller */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-[#1A4B9C]'} transition-all duration-500`} 
                                                style={{ width: `${phase.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">
                                            <span>{phase.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Edit Milestone Modal */}
                {editingPhase && (
                    <div className="fixed inset-0 bg-[#000f22]/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-[#1A4B9C] text-white p-5 flex justify-between items-center">
                                <h3 className="font-bold text-base">Edit Milestone Details</h3>
                                <button onClick={() => setEditingPhase(null)} className="text-blue-200 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleSavePhaseEdit} className="p-6 space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Milestone Name</label>
                                    <input 
                                        type="text"
                                        value={editingPhase.name}
                                        onChange={(e) => setEditingPhase({ ...editingPhase, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target / Completion Date</label>
                                    <input 
                                        type="text"
                                        value={editingPhase.date}
                                        onChange={(e) => setEditingPhase({ ...editingPhase, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="font-bold text-slate-700 uppercase tracking-wider">Completion Progress (%)</label>
                                        <span className="font-extrabold text-[#1A4B9C] text-sm">{editingPhase.progress}%</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={editingPhase.progress}
                                        onChange={(e) => setEditingPhase({ ...editingPhase, progress: e.target.value })}
                                        className="w-full accent-[#1A4B9C] cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                                    <button 
                                        type="button" 
                                        onClick={() => setEditingPhase(null)}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-[#1A4B9C] hover:bg-[#153B7C] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Save size={14} /> Save Milestone
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add New Milestone Modal */}
                {isAddPhaseOpen && (
                    <div className="fixed inset-0 bg-[#000f22]/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-[#1A4B9C] text-white p-5 flex justify-between items-center">
                                <h3 className="font-bold text-base">Add New Milestone</h3>
                                <button onClick={() => setIsAddPhaseOpen(false)} className="text-blue-200 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleAddPhaseSubmit} className="p-6 space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Milestone Name</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Interior Finishing & Elevators"
                                        value={newPhaseForm.name}
                                        onChange={(e) => setNewPhaseForm({ ...newPhaseForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target / Completion Date</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Target: Q4 2026"
                                        value={newPhaseForm.date}
                                        onChange={(e) => setNewPhaseForm({ ...newPhaseForm, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="font-bold text-slate-700 uppercase tracking-wider">Initial Progress (%)</label>
                                        <span className="font-extrabold text-[#1A4B9C] text-sm">{newPhaseForm.progress}%</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={newPhaseForm.progress}
                                        onChange={(e) => setNewPhaseForm({ ...newPhaseForm, progress: e.target.value })}
                                        className="w-full accent-[#1A4B9C] cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddPhaseOpen(false)}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-[#1A4B9C] hover:bg-[#153B7C] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus size={14} /> Add Milestone
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                                    isDragging ? 'border-[#1A4B9C] bg-blue-50/80 scale-[1.01]' : 'border-[#E2E8F0] hover:bg-slate-50'
                                }`}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={(e) => handleFilesUpload(e.target.files)} 
                                    accept="image/*" 
                                    multiple 
                                    className="hidden" 
                                />
                                <ImageIcon size={22} className={`mx-auto mb-1 ${isDragging ? 'text-[#1A4B9C]' : 'text-slate-400'}`} />
                                <div className="text-xs font-bold text-slate-700">
                                    {isDragging ? 'Drop project photos here...' : `Drag & drop photos for ${selectedProject.name}`}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">Click to select files or drop here (Saved in Database)</div>
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#1A4B9C] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#153B7C] transition-colors shadow-sm cursor-pointer">
                                <Send size={14} /> Send Broadcast
                            </button>
                        </form>
                    </div>

                    {/* Recent Site Photos */}
                    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-800">Saved Site Photos ({currentPhotos.length})</h3>
                        </div>
                        {currentPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {currentPhotos.map(photo => (
                                    <div key={photo.id} className="h-24 rounded border border-slate-200 overflow-hidden relative group bg-slate-100">
                                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                                            <div className="text-[9px] font-bold truncate">{photo.caption}</div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm("Remove this site photo permanently from database?")) {
                                                        deleteProjectPhoto(photo.id);
                                                    }
                                                }}
                                                className="self-end px-2 py-0.5 bg-red-600 hover:bg-red-700 text-[9px] font-bold rounded cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400 border border-slate-200 rounded-lg italic">
                                No site photos uploaded for {selectedProject.name} yet. Drag & drop photos above to save them.
                            </div>
                        )}
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
