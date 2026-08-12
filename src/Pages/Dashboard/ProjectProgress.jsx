import { useState } from 'react';
import { 
    CheckCircle2, Circle, Lock, 
    Camera, FileText, Wrench, Clock, Download
} from 'lucide-react';
import { useClientData } from '../../Context/ClientDataContext';

const ICONS = {
    'Site Photo': Camera,
    'Document': FileText,
    'Logistics': Wrench,
};

const ProjectProgress = () => {
    const { loading, projects, siteUpdates, downloadStatement } = useClientData();
    const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id);

    const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
    const clientPhases = activeProject?.phases || [];
    const incompleteClientPhase = clientPhases.find(p => p.progress < 100);
    const rawPhase = activeProject?.progressPhase || activeProject?.progress_phase;
    const phase = rawPhase && rawPhase <= 4 
        ? rawPhase 
        : (incompleteClientPhase ? incompleteClientPhase.id : (clientPhases.length || 3));

    if (loading) {
        return (
            <div className="flex flex-col gap-6 max-w-5xl animate-pulse">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 pb-8 flex flex-col gap-4">
                    <div className="skeleton h-6 w-64 rounded bg-slate-200" />
                    <div className="skeleton h-20 w-full rounded-lg bg-slate-100" />
                </div>
                <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-4">
                    <div className="skeleton h-6 w-48 rounded bg-slate-200" />
                    <div className="skeleton h-48 w-full rounded bg-slate-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            
            {/* Top Bar */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="font-bold text-2xl text-[#191C1E]">Project Progress</h1>
                    <p className="text-sm text-[#737783] mt-1">Track construction milestones and site updates.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] p-1 rounded-sm shadow-sm">
                    {projects.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActiveProjectId(p.id)}
                            className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-sm transition-all ${
                                activeProjectId === p.id
                                    ? 'bg-[#003178] text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-[#F0F4F8]'
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 1. Construction Progress Card (Matched to Overview Figma style) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 pb-8">
                <h2 className="text-[#003178] font-bold text-[18px] mb-10">Overall Construction Progress</h2>
                
                <div className="relative mt-8 pb-4">
                    {/* Connecting Lines */}
                    <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-[#E2E8F0] z-0 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#006E1C] transition-all duration-500 ease-out`} style={{ width: `${(Math.max(0, phase - 1) / 3) * 100}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-start relative z-10">
                        {[
                            { id: 1, name: 'Piling &\nFoundation' },
                            { id: 2, name: 'Structural\nCasting' },
                            { id: 3, name: 'Finishing' },
                            { id: 4, name: 'Handover' },
                        ].map(step => {
                            const isCompleted = phase > step.id;
                            const isCurrent = phase === step.id;
                            return (
                                <div key={step.id} className="flex flex-col items-center flex-1">
                                    {isCompleted ? (
                                        <div className="w-9 h-9 rounded-full bg-[#006E1C] border-2 border-[#006E1C] flex items-center justify-center text-white z-10 relative shadow-sm">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-9 h-9 rounded-full bg-white border-4 border-[#003178] flex items-center justify-center z-10 relative shadow-md">
                                            <div className="w-3.5 h-3.5 rounded-full bg-[#003178] animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-white border-2 border-[#CBD5E1] flex items-center justify-center text-slate-400 font-bold text-xs z-10 relative">
                                            {step.id}
                                        </div>
                                    )}
                                    <div className={`text-[11px] uppercase tracking-wider text-center mt-4 whitespace-pre-line ${
                                        isCurrent 
                                            ? 'font-bold text-[#003178]' 
                                            : isCompleted 
                                            ? 'font-semibold text-[#006E1C]' 
                                            : 'font-medium text-slate-400'
                                    }`}>
                                        {step.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. Site Updates */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
                    <h2 className="text-[#003178] font-bold text-[18px]">Latest Site Updates</h2>
                </div>
                
                <div className="divide-y divide-[#E2E8F0]">
                    {siteUpdates.filter(u => {
                        const pId = u.projectId || u.project_id;
                        return !activeProjectId || !pId || pId === activeProjectId;
                    }).map((u) => {
                        const IconComponent = ICONS[u.type] || Clock;
                        return (
                            <div key={u.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-5">
                                <div className="w-12 h-12 flex-shrink-0 bg-[#E1EFFE] rounded-full flex items-center justify-center text-[#1E429F]">
                                    <IconComponent size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-base text-slate-800">{u.title}</h4>
                                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                                            <Clock size={12} /> {u.date}
                                        </div>
                                    </div>
                                    <div className="inline-block px-2.5 py-1 bg-blue-100 text-[#003178] text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                                        {u.type || 'Announcement'}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                                        {u.desc}
                                    </p>
                                    
                                    {(u.type === 'Document' || u.type === 'Site Photo') && (
                                        <button onClick={downloadStatement} className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#003178] hover:text-[#0A2550] bg-[#E1EFFE]/50 hover:bg-[#E1EFFE] px-4 py-2 rounded-full transition-colors border border-transparent hover:border-[#003178]/20">
                                            <Download size={14} /> Download Asset
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {siteUpdates.filter(u => {
                        const pId = u.projectId || u.project_id;
                        return !activeProjectId || !pId || pId === activeProjectId;
                    }).length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm italic">
                            No broadcast site updates recorded for {activeProject?.name || 'this project'} yet.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProjectProgress;
