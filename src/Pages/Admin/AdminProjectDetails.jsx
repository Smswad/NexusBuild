import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../Context/AdminDataContext';
import { 
    Building2, MapPin, Save, Trash2, Plus, UploadCloud, 
    Link as LinkIcon, AlertTriangle, Layers, Home, Check, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router';

const AdminProjectDetails = () => {
    const { 
        projects, activeProject, setActiveProject, 
        updatePublicProject, deletePublicProject, publicProjects,
        projectPhotos = [], addProjectPhoto, deleteProjectPhoto
    } = useAdminData();
    const navigate = useNavigate();

    const fileInputRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Determine current project to edit
    const currentProject = projects.find(p => p.id === activeProject);
    const matchingPublicProj = publicProjects.find(p => p.id === currentProject?.id) || {};

    const currentPhotos = projectPhotos.filter(p => p.projectId === (currentProject?.id || 'p1'));

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
        if (!files || files.length === 0 || !currentProject) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (PNG, JPG, SVG, WebP).');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                addProjectPhoto(currentProject.id, dataUrl, file.name);
            };
            reader.readAsDataURL(file);
        });
    };

    const [formData, setFormData] = useState({
        name: '',
        status: 'AVAILABLE',
        statusBg: '#a14000',
        location: 'Narayanganj',
        type: 'Residential',
        image: '/Frontend/Projects/Reliance_Zenith_Towers.svg',
        description: 'Luxury residential development equipped with modern amenities.',
        detailsLink: '#',
        mapLink: 'https://maps.google.com/maps?q=23.6238,90.4993&z=15&output=embed',
        price: '৳ 1.25 Crore - ৳ 2.50 Crore',
        area: '1,200 - 2,200 sqft',
        totalUnits: 25,
        nearbyHospitals: '',
        nearbySchools: '',
        nearbyColleges: '',
        nearbyMarkets: ''
    });

    useEffect(() => {
        if (currentProject) {
            setFormData({
                name: currentProject.name || matchingPublicProj.name || '',
                status: matchingPublicProj.status || 'AVAILABLE',
                statusBg: matchingPublicProj.statusBg || '#a14000',
                location: matchingPublicProj.location || 'Narayanganj',
                type: matchingPublicProj.type || 'Mixed Use',
                image: matchingPublicProj.image || '/Frontend/Projects/Hero_Section.svg',
                description: matchingPublicProj.description || 'Flagship real estate project equipped with modern infrastructure amenities.',
                detailsLink: matchingPublicProj.detailsLink || '#',
                mapLink: matchingPublicProj.mapLink || matchingPublicProj.map_link || 'https://maps.google.com/maps?q=23.6238,90.4993&z=15&output=embed',
                price: matchingPublicProj.price || '৳ 1.50 Crore - ৳ 3.50 Crore',
                area: matchingPublicProj.area || '1,400 - 2,800 sqft',
                totalUnits: currentProject.totalUnits || matchingPublicProj.totalUnits || 32,
                nearbyHospitals: matchingPublicProj.nearbyHospitals || matchingPublicProj.nearby_hospitals || 'Narayanganj 200 Bed Hospital (0.8 km), Popular Diagnostic (1.2 km)',
                nearbySchools: matchingPublicProj.nearbySchools || matchingPublicProj.nearby_schools || 'Ideal School & College (0.6 km), Narayanganj Govt High School (1.1 km)',
                nearbyColleges: matchingPublicProj.nearbyColleges || matchingPublicProj.nearby_colleges || 'Tolaram Govt College (1.3 km)',
                nearbyMarkets: matchingPublicProj.nearbyMarkets || matchingPublicProj.nearby_markets || 'Shamabay New Market (0.3 km), Balur Math Market (0.7 km)'
            });
        }
    }, [currentProject?.id]);

    const [isSaving, setIsSaving] = useState(false);

    // Flat units management for this project
    const projId = currentProject?.id || 'p1';
    const [flatsList, setFlatsList] = useState([]);

    useEffect(() => {
        if (projId) {
            const stored = JSON.parse(localStorage.getItem('flats_project_' + projId) || '[]');
            if (stored.length === 0) {
                const defaultFlats = [
                    { id: 'f1', unit: 'Flat 1A', size: '1,200 sqft', price: '৳1.25Cr', status: 'AVAILABLE' },
                    { id: 'f2', unit: 'Flat 1B', size: '1,500 sqft', price: '৳1.55Cr', status: 'SOLD' },
                    { id: 'f3', unit: 'Flat 2A', size: '1,200 sqft', price: '৳1.25Cr', status: 'RESERVED' },
                    { id: 'f4', unit: 'Flat 2B', size: '1,500 sqft', price: '৳1.55Cr', status: 'AVAILABLE' }
                ];
                localStorage.setItem('flats_project_' + projId, JSON.stringify(defaultFlats));
                setFlatsList(defaultFlats);
            } else {
                setFlatsList(stored);
            }
        }
    }, [projId]);

    const [newFlat, setNewFlat] = useState({ unit: '', size: '', price: '', status: 'AVAILABLE' });

    // ── IF IN GLOBAL/ALL PROJECTS MODE: Render Project Selector ──────────────
    if (activeProject === 'all' || !currentProject) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 text-slate-800">
                <div className="border-b border-slate-200 pb-4">
                    <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider mb-1">
                        Specific Project Details Scope
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Select a Project to View Specific Details</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        You are currently in All Projects Overview. Select a specific project below to open its dedicated specification editor, photo gallery, and flat inventory.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(proj => (
                        <div key={proj.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-lg">{proj.name}</h3>
                                    <span className="text-xs bg-[#E1EFFE] text-[#1A4B9C] px-2 py-0.5 rounded font-bold">ID: {proj.id}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">{proj.totalUnits || 0} Total Units Billed</p>
                            </div>
                            <button 
                                onClick={() => setActiveProject(proj.id)}
                                className="w-full py-2 bg-[#1A4B9C] text-white text-xs font-bold rounded-lg hover:bg-[#153B7C] transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Building2 size={14} /> Open {proj.name} Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── SPECIFIC PROJECT DETAILED VIEW ────────────────────────────────────────
    const handleSaveProjectDetails = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalMapLink = formData.mapLink;
            // Resolve shortened Google Maps URLs
            if (finalMapLink && (finalMapLink.includes('maps.app.goo.gl') || finalMapLink.includes('goo.gl/maps'))) {
                try {
                    const res = await fetch(`/api/resolve-map?url=${encodeURIComponent(finalMapLink)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.resolvedUrl) {
                            finalMapLink = data.resolvedUrl;
                        }
                    }
                } catch (err) {
                    console.warn("Failed to resolve shortened map link:", err);
                }
            }

            const updatedForm = { ...formData, mapLink: finalMapLink };
            await updatePublicProject(currentProject.id, updatedForm);
            setFormData(updatedForm);
            alert(`Project Details for "${formData.name}" saved successfully!`);
        } catch (err) {
            alert('Error updating project details: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEntireProject = async () => {
        const confirmName = prompt(`CAUTION: Deleting "${formData.name}" will permanently wipe all unit ledgers and site records.\n\nType DELETE to confirm:`);
        if (confirmName === 'DELETE') {
            await deletePublicProject(currentProject.id);
            alert(`Project "${formData.name}" deleted successfully.`);
            setActiveProject('all');
            navigate('/admin');
        }
    };

    const handleAddFlat = (e) => {
        e.preventDefault();
        if (!newFlat.unit) return;
        const updated = [...flatsList, { ...newFlat, id: 'f_' + Date.now() }];
        localStorage.setItem('flats_project_' + projId, JSON.stringify(updated));
        setFlatsList(updated);
        setNewFlat({ unit: '', size: '', price: '', status: 'AVAILABLE' });
    };

    const handleDeleteFlat = (flatId) => {
        const updated = flatsList.filter(f => f.id !== flatId);
        localStorage.setItem('flats_project_' + projId, JSON.stringify(updated));
        setFlatsList(updated);
    };

    const handleUpdateFlatStatus = (flatId, newStatus) => {
        const updated = flatsList.map(f => f.id === flatId ? { ...f, status: newStatus } : f);
        localStorage.setItem('flats_project_' + projId, JSON.stringify(updated));
        setFlatsList(updated);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-slate-800">
            
            {/* Header with Back button & Project Switcher */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button 
                            onClick={() => setActiveProject('all')}
                            className="text-xs font-bold text-[#1A4B9C] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <ArrowLeft size={12} /> All Projects
                        </button>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Single Project Details</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        {formData.name || currentProject.name}
                        <span className="text-xs bg-[#E1EFFE] text-[#1A4B9C] px-2.5 py-0.5 rounded-full font-bold">
                            ID: {currentProject.id}
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Isolated management space specifically for <strong>{currentProject.name}</strong>.
                    </p>
                </div>

                {/* Quick Switch Dropdown */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500">Active Scope:</label>
                    <select 
                        value={currentProject.id} 
                        onChange={(e) => setActiveProject(e.target.value)}
                        className="bg-white border border-[#E2E8F0] text-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-[#1A4B9C] shadow-sm cursor-pointer"
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Details Form */}
            <form onSubmit={handleSaveProjectDetails} className="space-y-6">
                
                {/* Hero Banner Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Building2 size={16} className="text-[#1A4B9C]" />
                        {formData.name} Hero Banner & Photo Gallery
                    </h3>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Hero Photo</div>
                            <div className="h-44 rounded-lg border border-slate-200 overflow-hidden relative group bg-slate-100">
                                <img src={formData.image} alt="Hero Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                                    Hero Preview
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Image URL / File Link</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Paste image URL (e.g. /Frontend/Projects/sample.svg)"
                                        className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                </div>
                            </div>

                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
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
                                <UploadCloud size={28} className={`mx-auto mb-1 ${isDragging ? 'text-[#1A4B9C]' : 'text-slate-400'}`} />
                                <div className="text-xs font-bold text-slate-700">
                                    {isDragging ? 'Drop images here to save to database...' : `Drag & drop project photos for ${formData.name}`}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">
                                    Click to select from your device or drag & drop (Saved in Database until deleted)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saved Project Photos Gallery */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-xs font-bold text-slate-800">
                                Saved Gallery Photos for {formData.name} ({currentPhotos.length})
                            </div>
                        </div>

                        {currentPhotos.length > 0 ? (
                            <div className="grid grid-cols-4 gap-3">
                                {currentPhotos.map(photo => (
                                    <div key={photo.id} className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-100 h-32">
                                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                                            <div className="text-[10px] font-bold truncate">{photo.caption}</div>
                                            <div className="flex gap-1 justify-end">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData({ ...formData, image: photo.url });
                                                        alert(`Set photo as main hero image for ${formData.name}!`);
                                                    }}
                                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-[9px] font-bold rounded cursor-pointer"
                                                >
                                                    Set Hero
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm("Delete this photo permanently from the database?")) {
                                                            deleteProjectPhoto(photo.id);
                                                        }
                                                    }}
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-[9px] font-bold rounded cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400 italic">
                                No uploaded photos saved for {formData.name} yet. Drag & drop or select images above from your device.
                            </div>
                        )}
                    </div>
                </div>

                {/* Specifications Grid */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Layers size={16} className="text-[#1A4B9C]" />
                        Project Specifications & Location Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Project Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Location / Address</label>
                            <input 
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Development Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            >
                                <option value="Residential">Residential Luxury Apartments</option>
                                <option value="Commercial">Commercial Business Center</option>
                                <option value="Mixed Use">Mixed-Use Commercial & Residential</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Booking Availability Status</label>
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            >
                                <option value="AVAILABLE">AVAILABLE FOR BOOKING</option>
                                <option value="READY TO MOVE">READY TO MOVE IN</option>
                                <option value="SOLD OUT">SOLD OUT</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Starting Price Info (BDT)</label>
                            <input 
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g. Starting from ৳1.25Cr"
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Floor Area / Unit Size</label>
                            <input 
                                type="text"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                placeholder="e.g. 1,200 - 2,500 sqft"
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Total Unit Capacity</label>
                            <input 
                                type="number"
                                value={formData.totalUnits}
                                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block font-bold text-slate-600 uppercase tracking-wider">Google Maps Location Link / Embed URL</label>
                                <span className="text-[10px] text-slate-400">Accepts Embed HTML, Share Link, or Coordinates</span>
                            </div>
                            <input 
                                type="text"
                                value={formData.mapLink}
                                onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                                placeholder="e.g. https://maps.app.goo.gl/... or <iframe src='...'> or 23.6238,90.4993"
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1A4B9C]"
                            />
                            <p className="text-[10px] text-slate-500 mt-1 italic">
                                Note: You can paste Google Maps embed code (<code className="bg-slate-100 px-1 rounded">&lt;iframe src="..."&gt;</code>), share link (<code className="bg-slate-100 px-1 rounded">https://maps.app.goo.gl/...</code>), or latitude/longitude (<code className="bg-slate-100 px-1 rounded">23.6238,90.4993</code>).
                            </p>
                        </div>

                        {/* Nearby Amenities (Within 2 km) Section */}
                        <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={14} className="text-[#1A4B9C]" />
                                Nearby Amenities (Within 2 km Radius for GIS Map View)
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">🏥 Nearby Hospitals (Name & Distance)</label>
                                    <input 
                                        type="text"
                                        value={formData.nearbyHospitals}
                                        onChange={(e) => setFormData({ ...formData, nearbyHospitals: e.target.value })}
                                        placeholder="e.g. Labaid Hospital (0.8 km), Square Hospital (1.5 km)"
                                        className="w-full border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">🏫 Nearby Schools (Name & Distance)</label>
                                    <input 
                                        type="text"
                                        value={formData.nearbySchools}
                                        onChange={(e) => setFormData({ ...formData, nearbySchools: e.target.value })}
                                        placeholder="e.g. Ideal School & College (0.6 km), Scholastica (1.1 km)"
                                        className="w-full border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">🎓 Nearby Colleges / Varsities</label>
                                    <input 
                                        type="text"
                                        value={formData.nearbyColleges}
                                        onChange={(e) => setFormData({ ...formData, nearbyColleges: e.target.value })}
                                        placeholder="e.g. Dhaka City College (0.7 km), Tolaram College (1.3 km)"
                                        className="w-full border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">🛒 Nearby Markets / Shopping Malls</label>
                                    <input 
                                        type="text"
                                        value={formData.nearbyMarkets}
                                        onChange={(e) => setFormData({ ...formData, nearbyMarkets: e.target.value })}
                                        placeholder="e.g. Shimanto Square (0.6 km), Shamabay Market (0.3 km)"
                                        className="w-full border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#1A4B9C]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Project Description & Overview</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1A4B9C] h-20 resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A4B9C] hover:bg-[#153B7C] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors"
                        >
                            <Save size={14} /> {isSaving ? 'Saving Changes...' : `Save ${formData.name} Details`}
                        </button>
                    </div>
                </div>
            </form>

            {/* Flat Units Inventory Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Flat Units Inventory for {formData.name} ({flatsList.length})</h3>
                        <p className="text-xs text-slate-500">Specific unit floor plans, prices, and booking status</p>
                    </div>
                </div>

                {/* Add Flat Inline Form */}
                <form onSubmit={handleAddFlat} className="p-4 bg-blue-50/50 border-b border-[#E2E8F0] flex items-center gap-3 text-xs">
                    <input 
                        type="text" 
                        placeholder="Flat No (e.g. Flat 3A)" 
                        value={newFlat.unit} 
                        onChange={e => setNewFlat({...newFlat, unit: e.target.value})}
                        className="px-3 py-1.5 border border-slate-300 rounded bg-white font-bold w-36"
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Size (e.g. 1,450 sqft)" 
                        value={newFlat.size} 
                        onChange={e => setNewFlat({...newFlat, size: e.target.value})}
                        className="px-3 py-1.5 border border-slate-300 rounded bg-white w-36"
                    />
                    <input 
                        type="text" 
                        placeholder="Price (e.g. ৳1.45Cr)" 
                        value={newFlat.price} 
                        onChange={e => setNewFlat({...newFlat, price: e.target.value})}
                        className="px-3 py-1.5 border border-slate-300 rounded bg-white font-bold w-36"
                    />
                    <select 
                        value={newFlat.status}
                        onChange={e => setNewFlat({...newFlat, status: e.target.value})}
                        className="px-3 py-1.5 border border-slate-300 rounded bg-white font-bold"
                    >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="SOLD">SOLD</option>
                    </select>
                    <button type="submit" className="px-4 py-1.5 bg-[#1A4B9C] text-white font-bold rounded hover:bg-[#153B7C] cursor-pointer flex items-center gap-1">
                        <Plus size={14} /> Add Flat
                    </button>
                </form>

                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-white border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Flat Unit</th>
                            <th className="px-6 py-3">Floor Area</th>
                            <th className="px-6 py-3">Valuation Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {flatsList.map(flat => (
                            <tr key={flat.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-bold text-slate-800">{flat.unit}</td>
                                <td className="px-6 py-3 text-slate-600">{flat.size}</td>
                                <td className="px-6 py-3 font-bold text-[#1A4B9C]">{flat.price}</td>
                                <td className="px-6 py-3">
                                    <select 
                                        value={flat.status}
                                        onChange={(e) => handleUpdateFlatStatus(flat.id, e.target.value)}
                                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            flat.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                                            flat.status === 'RESERVED' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                                            'bg-slate-100 text-slate-700 border-slate-300'
                                        }`}
                                    >
                                        <option value="AVAILABLE">AVAILABLE</option>
                                        <option value="RESERVED">RESERVED</option>
                                        <option value="SOLD">SOLD</option>
                                    </select>
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button 
                                        onClick={() => handleDeleteFlat(flat.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="Delete Flat"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DANGER ZONE: Delete Entire Project */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex justify-between items-center text-xs">
                <div>
                    <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                        <AlertTriangle size={18} />
                        Danger Zone: Delete {formData.name}
                    </div>
                    <p className="text-red-600 mt-1">
                        Permanently delete <strong>{formData.name}</strong> along with all flat unit listings, image media, and site progress records.
                    </p>
                </div>
                <button 
                    onClick={handleDeleteEntireProject}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm cursor-pointer transition-colors flex items-center gap-2"
                >
                    <Trash2 size={16} /> Delete Entire Project
                </button>
            </div>

        </div>
    );
};

export default AdminProjectDetails;
