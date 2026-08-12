import React, { useState, useRef } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { Plus, Edit2, MapPin, Search, UploadCloud, Link as LinkIcon, Home, Trash2, CheckCircle2 } from 'lucide-react';

const AdminWebsiteProjects = () => {
    const { publicProjects, addPublicProject, updatePublicProject, deletePublicProject } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        status: 'AVAILABLE',
        statusBg: '#a14000',
        location: '',
        type: 'Residential',
        image: '/Frontend/Projects/Hero_Section.svg',
        description: '',
        detailsLink: '#',
        mapLink: '#',
        price: '',
        area: ''
    });

    const [showFlatsModal, setShowFlatsModal] = useState(false);
    const [selectedProjectForFlats, setSelectedProjectForFlats] = useState(null);
    const [flatsList, setFlatsList] = useState([]);
    const [newFlat, setNewFlat] = useState({ unit: '', size: '', price: '', status: 'AVAILABLE' });

    const openFlatsModal = (project) => {
        setSelectedProjectForFlats(project);
        const stored = JSON.parse(localStorage.getItem('flats_project_' + project.id) || '[]');
        if (stored.length === 0) {
            const mockFlats = [
                { id: 'f1', unit: 'Flat 1A', size: '1,200 sqft', price: '৳1.25Cr', status: 'AVAILABLE' },
                { id: 'f2', unit: 'Flat 1B', size: '1,500 sqft', price: '৳1.55Cr', status: 'SOLD' },
                { id: 'f3', unit: 'Flat 2A', size: '1,200 sqft', price: '৳1.25Cr', status: 'RESERVED' },
                { id: 'f4', unit: 'Flat 2B', size: '1,500 sqft', price: '৳1.55Cr', status: 'AVAILABLE' }
            ];
            localStorage.setItem('flats_project_' + project.id, JSON.stringify(mockFlats));
            setFlatsList(mockFlats);
        } else {
            setFlatsList(stored);
        }
        setShowFlatsModal(true);
    };

    const handleAddFlat = (e) => {
        e.preventDefault();
        const updated = [...flatsList, { ...newFlat, id: 'f_' + Date.now() }];
        localStorage.setItem('flats_project_' + selectedProjectForFlats.id, JSON.stringify(updated));
        setFlatsList(updated);
        setNewFlat({ unit: '', size: '', price: '', status: 'AVAILABLE' });
    };

    const handleDeleteFlat = (flatId) => {
        const updated = flatsList.filter(f => f.id !== flatId);
        localStorage.setItem('flats_project_' + selectedProjectForFlats.id, JSON.stringify(updated));
        setFlatsList(updated);
    };

    const handleUpdateFlatStatus = (flatId, newStatus) => {
        const updated = flatsList.map(f => f.id === flatId ? { ...f, status: newStatus } : f);
        localStorage.setItem('flats_project_' + selectedProjectForFlats.id, JSON.stringify(updated));
        setFlatsList(updated);
    };

    const statusOptions = [
        { label: 'AVAILABLE', bg: '#a14000' },
        { label: 'SOLD OUT', bg: '#000f22' },
        { label: 'READY TO MOVE', bg: '#a14000' }
    ];

    const typeOptions = ['Residential', 'Commercial', 'Mixed Use'];

    const filteredProjects = publicProjects.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            name: '', status: 'AVAILABLE', statusBg: '#a14000',
            location: '', type: 'Residential',
            image: '/Frontend/Projects/Hero_Section.svg', 
            description: '', detailsLink: '#', mapLink: '#',
            price: '', area: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setModalMode('edit');
        setCurrentId(project.id);
        setFormData({
            name: project.name,
            status: project.status,
            statusBg: project.statusBg,
            location: project.location,
            type: project.type,
            image: project.image,
            description: project.description,
            detailsLink: project.detailsLink || '#',
            mapLink: project.mapLink || '#',
            price: project.price || '',
            area: project.area || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Find matching bg for status
        const selectedStatusOption = statusOptions.find(o => o.label === formData.status);
        const finalData = { ...formData, statusBg: selectedStatusOption ? selectedStatusOption.bg : '#000f22' };

        if (modalMode === 'add') {
            addPublicProject(finalData);
        } else {
            updatePublicProject(currentId, finalData);
        }
        setIsModalOpen(false);
    };

    const fileInputRef = useRef(null);

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, SVG, WebP).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            setFormData(prev => ({ ...prev, image: uploadEvent.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 lg:px-0 text-slate-800">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end mb-6">
                <div>
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">Website Content</div>
                    <h1 className="text-2xl font-bold text-slate-800">Public Projects Portfolio</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage the projects displayed on the public website.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm w-full sm:w-64 outline-none focus:border-[#1A4B9C] bg-white text-slate-800"
                        />
                    </div>
                    <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1A4B9C] text-white rounded-lg hover:bg-[#153B7C] text-sm font-bold shadow-sm transition-colors cursor-pointer w-full sm:w-auto flex-shrink-0">
                        <Plus size={16} /> Add New Project
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white border border-[#c4c6ce] rounded-lg overflow-hidden shadow-sm flex flex-col group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3">
                                <span className="text-[10px] font-bold text-white px-2 py-1 uppercase tracking-wider" style={{ backgroundColor: project.statusBg }}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="absolute top-3 right-3">
                                <button onClick={() => openEditModal(project)} className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1A4B9C] shadow-sm backdrop-blur-sm transition-colors">
                                    <Edit2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                <span className="flex items-center gap-1"><MapPin size={12}/> {project.location}</span>
                                <span>•</span>
                                <span>{project.type}</span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1 mb-4">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#E2E8F0] justify-between items-center">
                                <button 
                                    onClick={() => openEditModal(project)}
                                    className="px-3 py-1.5 bg-blue-50 text-[#1A4B9C] text-xs font-bold rounded hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <Edit2 size={13} /> Project Details
                                </button>
                                <button 
                                    onClick={() => openFlatsModal(project)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded transition-colors cursor-pointer"
                                >
                                    Manage Flats
                                </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to permanently delete "${project.name}"? This will remove all unit listings and records.`)) {
                                            deletePublicProject(project.id);
                                            alert(`Project "${project.name}" has been deleted.`);
                                        }
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete Project"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-[#c4c6ce]">
                        No public projects match your search.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50 flex-shrink-0">
                            <h3 className="font-bold text-slate-800">{modalMode === 'add' ? 'Add New Project' : 'Edit Project'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]">
                                        {statusOptions.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C]">
                                        {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Details Page Link</label>
                                    <input type="text" placeholder="/projects/zenith" value={formData.detailsLink} onChange={e => setFormData({...formData, detailsLink: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Google Maps Link</label>
                                    <input type="text" placeholder="https://maps.google.com/..." value={formData.mapLink} onChange={e => setFormData({...formData, mapLink: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price Info</label>
                                    <input type="text" placeholder="e.g. Starting from ৳1.2Cr" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Area / Size Info</label>
                                    <input type="text" placeholder="e.g. 1,200 - 2,500 sqft" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Image</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Drag and Drop Zone */}
                                        <div 
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleImageDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-[#c4c6ce] rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileChange} 
                                                accept="image/*" 
                                                className="hidden" 
                                            />
                                            <UploadCloud size={24} className="text-slate-400 mb-2" />
                                            <span className="text-xs font-bold text-slate-700">Click or Drag Image</span>
                                            <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, SVG, WebP up to 5MB</span>
                                        </div>
                                        {/* Direct Link Input */}
                                        <div className="flex flex-col justify-center gap-2">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><LinkIcon size={12}/> Or Image URL</div>
                                            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] bg-white text-slate-800" />
                                            {formData.image && (
                                                <div className="mt-2 h-16 w-32 rounded border border-slate-200 overflow-hidden">
                                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A4B9C] h-24 resize-none bg-white text-slate-800"></textarea>
                                </div>
                            </div>
                            </div>
                            <div className="p-6 border-t border-[#E2E8F0] flex justify-between gap-3 flex-shrink-0 bg-slate-50">
                                {modalMode === 'edit' && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${formData.name}?`)) {
                                                deletePublicProject(currentId);
                                                setIsModalOpen(false);
                                            }
                                        }}
                                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-[4px] text-sm font-bold transition-colors shadow-sm cursor-pointer"
                                    >
                                        Delete Project
                                    </button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 bg-slate-100 rounded-[4px] text-sm font-bold hover:bg-slate-200 cursor-pointer">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-[#1A4B9C] text-white rounded-[4px] text-sm font-bold hover:bg-[#153B7C] cursor-pointer">Save Project</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Flats Manager Modal */}
            {showFlatsModal && selectedProjectForFlats && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 text-slate-800">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#1A4B9C] text-white flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-lg">Manage Flats - {selectedProjectForFlats.name}</h3>
                                <p className="text-xs text-blue-200 mt-0.5">Location: {selectedProjectForFlats.location}</p>
                            </div>
                            <button onClick={() => setShowFlatsModal(false)} className="text-blue-200 hover:text-white text-lg">✕</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                            {/* Add Flat Form */}
                            <div className="w-full md:w-80 bg-slate-50 border border-[#E2E8F0] rounded-xl p-5 h-fit flex-shrink-0">
                                <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                                    <Home size={16} className="text-[#1A4B9C]" /> Add New Flat Unit
                                </h4>
                                <form onSubmit={handleAddFlat} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Name / Number</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="e.g. Flat 3A" 
                                            value={newFlat.unit} 
                                            onChange={e => setNewFlat({...newFlat, unit: e.target.value})} 
                                            className="w-full border border-[#E2E8F0] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Size (sqft)</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="e.g. 1,500 sqft" 
                                            value={newFlat.size} 
                                            onChange={e => setNewFlat({...newFlat, size: e.target.value})} 
                                            className="w-full border border-[#E2E8F0] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price Info</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="e.g. ৳1.5Cr" 
                                            value={newFlat.price} 
                                            onChange={e => setNewFlat({...newFlat, price: e.target.value})} 
                                            className="w-full border border-[#E2E8F0] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Availability Status</label>
                                        <select 
                                            value={newFlat.status} 
                                            onChange={e => setNewFlat({...newFlat, status: e.target.value})} 
                                            className="w-full border border-[#E2E8F0] bg-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                                        >
                                            <option value="AVAILABLE">AVAILABLE</option>
                                            <option value="SOLD">SOLD</option>
                                            <option value="RESERVED">RESERVED</option>
                                        </select>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="w-full py-2 bg-[#1A4B9C] hover:bg-[#153B7C] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                                    >
                                        Add Flat to Project
                                    </button>
                                </form>
                            </div>

                            {/* Flats List Grid */}
                            <div className="flex-grow space-y-4">
                                <h4 className="font-bold text-sm text-slate-800">Existing Units & Distinguished Flat Data</h4>
                                
                                <div className="border border-[#E2E8F0] rounded-xl overflow-x-auto shadow-sm">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <th className="px-6 py-3">Unit</th>
                                                <th className="px-6 py-3">Size (sqft)</th>
                                                <th className="px-6 py-3">Price</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E2E8F0]">
                                            {flatsList.map(flat => (
                                                <tr key={flat.id} className="hover:bg-slate-50 transition-colors text-xs text-slate-700">
                                                    <td className="px-6 py-3 font-bold text-slate-800">{flat.unit}</td>
                                                    <td className="px-6 py-3">{flat.size}</td>
                                                    <td className="px-6 py-3 font-semibold text-slate-800">{flat.price}</td>
                                                    <td className="px-6 py-3">
                                                        <select 
                                                            value={flat.status} 
                                                            onChange={(e) => handleUpdateFlatStatus(flat.id, e.target.value)}
                                                            className={`font-bold uppercase rounded px-2 py-1 text-[10px] tracking-wide border cursor-pointer ${
                                                                flat.status === 'AVAILABLE' 
                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                                                    : flat.status === 'SOLD' 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                            }`}
                                                        >
                                                            <option value="AVAILABLE">AVAILABLE</option>
                                                            <option value="SOLD">SOLD</option>
                                                            <option value="RESERVED">RESERVED</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteFlat(flat.id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer"
                                                            title="Delete Unit"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {flatsList.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">No flats recorded for this project yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex justify-end flex-shrink-0">
                            <button 
                                onClick={() => setShowFlatsModal(false)}
                                className="px-5 py-2 bg-[#1A4B9C] text-white font-bold rounded-lg text-sm transition-colors cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWebsiteProjects;
