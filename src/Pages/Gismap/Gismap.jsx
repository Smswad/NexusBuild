import React, { useState, useMemo } from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import { useDatabase } from '../../Context/DatabaseContext';
import { 
    MapPin, Building2, Layers, Search, Navigation, 
    Hospital, GraduationCap, School, ShoppingBag, ExternalLink,
    CheckCircle2, Compass, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';

const Gismap = () => {
    const { publicProjects = [] } = useDatabase();

    // Extract unique location names for sidebar filtering (e.g., Dhanmondi, Narayanganj)
    const uniqueLocations = useMemo(() => {
        const locs = new Set();
        publicProjects.forEach(p => {
            if (p.location) {
                // Split multi-word locations like "Dhanmondi, Dhaka" into primary city/area
                const primaryLoc = p.location.split(',')[0].trim();
                locs.add(primaryLoc);
            }
        });
        return Array.from(locs);
    }, [publicProjects]);

    const [selectedLocation, setSelectedLocation] = useState('ALL');
    const [selectedProjectId, setSelectedProjectId] = useState(publicProjects[0]?.id || 'p1');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle switching location area tab: automatically pick first project in that area!
    const handleSelectLocation = (loc) => {
        setSelectedLocation(loc);
        const firstMatching = publicProjects.find(p => 
            loc === 'ALL' || (p.location && p.location.toLowerCase().includes(loc.toLowerCase()))
        );
        if (firstMatching) {
            setSelectedProjectId(firstMatching.id);
        }
    };

    // Handle project card click: select project and switch location tab to match it!
    const handleSelectProject = (proj) => {
        setSelectedProjectId(proj.id);
        if (proj.location) {
            const primaryLoc = proj.location.split(',')[0].trim();
            const matchingArea = uniqueLocations.find(l => l.toLowerCase() === primaryLoc.toLowerCase());
            if (matchingArea) {
                setSelectedLocation(matchingArea);
            }
        }
    };

    // Filter projects based on location & search query
    const filteredProjects = useMemo(() => {
        return publicProjects.filter(p => {
            const matchLoc = selectedLocation === 'ALL' || 
                (p.location && p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
            const matchSearch = !searchQuery || 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchLoc && matchSearch;
        });
    }, [publicProjects, selectedLocation, searchQuery]);

    // Active selected project object
    const activeProject = useMemo(() => {
        return publicProjects.find(p => p.id === selectedProjectId) || filteredProjects[0] || publicProjects[0] || {};
    }, [publicProjects, selectedProjectId, filteredProjects]);

    // Helper to format google map embed link or coordinates
    const getMapEmbedUrl = (proj) => {
        if (!proj) return 'https://maps.google.com/maps?q=23.6238,90.4993&z=15&output=embed';

        let raw = (proj.mapLink || proj.map_link || '').trim();

        // 1. If Admin pasted full iframe HTML snippet e.g. <iframe src="https://www.google.com/maps/embed?..." ...></iframe>
        if (raw.includes('<iframe') && raw.includes('src=')) {
            const match = raw.match(/src=["']([^"']+)["']/i);
            if (match && match[1]) {
                raw = match[1];
            }
        }

        // 2. If it's a direct valid embed URL (e.g. google.com/maps/embed?pb=... or already contains output=embed)
        if (raw.includes('google.com/maps/embed') || raw.includes('output=embed')) {
            return raw;
        }

        // 3. If it contains @latitude,longitude e.g. https://www.google.com/maps/place/Sardar+Tower/@23.6238,90.4993,17z
        if (raw.includes('@')) {
            const coordsMatch = raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (coordsMatch) {
                return `https://maps.google.com/maps?q=${coordsMatch[1]},${coordsMatch[2]}&z=16&output=embed`;
            }
        }

        // 4. If it contains coordinate pair like 23.6238, 90.4993 or q=23.6238,90.4993
        const pairMatch = raw.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
        if (pairMatch) {
            return `https://maps.google.com/maps?q=${pairMatch[1]},${pairMatch[2]}&z=16&output=embed`;
        }

        // 5. If it's a google maps place link like https://www.google.com/maps/place/Dhanmondi+32+Dhaka
        if (raw.includes('google.com/maps/place/')) {
            try {
                const placePart = raw.split('google.com/maps/place/')[1].split('/')[0].split('?')[0];
                if (placePart) {
                    const decoded = decodeURIComponent(placePart).replace(/\+/g, ' ');
                    return `https://maps.google.com/maps?q=${encodeURIComponent(decoded)}&z=16&output=embed`;
                }
            } catch(e) {}
        }

        // 6. If it's a shortened share link (e.g. maps.app.goo.gl or goo.gl/maps)
        if (raw.includes('maps.app.goo.gl') || raw.includes('goo.gl')) {
            if (proj.coordinates && proj.coordinates.lat && proj.coordinates.lng) {
                return `https://maps.google.com/maps?q=${proj.coordinates.lat},${proj.coordinates.lng}&z=16&output=embed`;
            }
            const queryLoc = proj.location || proj.name || 'Narayanganj, Bangladesh';
            return `https://maps.google.com/maps?q=${encodeURIComponent(queryLoc)}&z=15&output=embed`;
        }

        // 7. If it's a search URL or HTTP link with query
        if (raw.startsWith('http://') || raw.startsWith('https://')) {
            try {
                const urlObj = new URL(raw);
                const qParam = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
                if (qParam) {
                    return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&z=15&output=embed`;
                }
            } catch(e) {}
        }

        // 8. Fallback search Google Maps with project name & location
        const query = encodeURIComponent(`${proj.name || ''} ${proj.location || ''}`.trim() || 'Narayanganj, Bangladesh');
        return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    };

    // Helper to parse comma-separated amenity lists
    const parseAmenityList = (rawString, defaultFallback) => {
        const val = rawString || defaultFallback;
        if (!val) return [];
        return val.split(',').map(s => s.trim()).filter(Boolean);
    };

    const hospitals = parseAmenityList(
        activeProject.nearbyHospitals || activeProject.nearby_hospitals,
        activeProject.location?.toLowerCase().includes('dhanmondi')
            ? 'Labaid Specialized Hospital (0.5 km), Square Hospital (1.4 km), Ibn Sina Hospital (1.1 km)'
            : 'Narayanganj 200 Bed Hospital (0.8 km), Popular Diagnostic Center (1.2 km), General Hospital (1.5 km)'
    );

    const schools = parseAmenityList(
        activeProject.nearbySchools || activeProject.nearby_schools,
        activeProject.location?.toLowerCase().includes('dhanmondi')
            ? 'Scholastica School (0.8 km), Mastermind International (1.2 km), Maple Leaf International (0.9 km)'
            : 'Ideal School & College (0.6 km), Narayanganj Govt High School (1.1 km), Morning Star School (1.4 km)'
    );

    const colleges = parseAmenityList(
        activeProject.nearbyColleges || activeProject.nearby_colleges,
        activeProject.location?.toLowerCase().includes('dhanmondi')
            ? 'Dhaka City College (0.7 km), State University of Bangladesh (1.5 km), ULAB (1.8 km)'
            : 'Tolaram Govt College (1.3 km), Narayanganj College (1.6 km), MW High School & College (1.8 km)'
    );

    const markets = parseAmenityList(
        activeProject.nearbyMarkets || activeProject.nearby_markets,
        activeProject.location?.toLowerCase().includes('dhanmondi')
            ? 'Shimanto Square (0.6 km), Rapa Plaza (1.1 km), Metro Shopping Mall (1.3 km)'
            : 'Shamabay New Market (0.3 km), Balur Math Super Market (0.7 km), Narayanganj Central Market (1.0 km)'
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
            {/* Header Navigation */}
            <Navbar />

            {/* Page Banner */}
            <div className="bg-[#000f22] text-white py-10 px-6 border-b border-[#0a2540] relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Project Location & Nearby Amenities</h1>
                    </div>
                </div>
            </div>

            {/* Main Interactive Map Layout */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Upper Split View: Left Sidebar Controls + Right Interactive Map Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDEBAR: Area Selector & Project Catalog (4 cols) */}
                    <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
                        
                        {/* Area Location Filter Tabs */}
                        <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 space-y-3">
                            <div className="text-[10px] font-bold text-[#1A4B9C] uppercase tracking-wider flex justify-between items-center">
                                <span>Filter by Location Area</span>
                                <span className="bg-[#E1EFFE] text-[#1A4B9C] px-2 py-0.5 rounded font-bold">{uniqueLocations.length} Areas</span>
                            </div>

                            {/* Location Pills */}
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    onClick={() => handleSelectLocation('ALL')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        selectedLocation === 'ALL' 
                                            ? 'bg-[#1A4B9C] text-white shadow-sm' 
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    All Locations
                                </button>

                                {uniqueLocations.map(loc => (
                                    <button
                                        key={loc}
                                        onClick={() => handleSelectLocation(loc)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                            selectedLocation === loc 
                                                ? 'bg-[#1A4B9C] text-white shadow-sm' 
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <MapPin size={12} /> {loc}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="relative mt-2">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search project or address..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#1A4B9C]"
                                />
                            </div>
                        </div>

                        {/* Project Cards List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                                Available Projects ({filteredProjects.length})
                            </div>

                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(proj => {
                                    const isSelected = (activeProject.id === proj.id);
                                    return (
                                        <div
                                            key={proj.id}
                                            onClick={() => handleSelectProject(proj)}
                                            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                                                isSelected 
                                                    ? 'bg-blue-50/70 border-[#1A4B9C] shadow-md ring-1 ring-[#1A4B9C]' 
                                                    : 'bg-white border-[#E2E8F0] hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                                        {proj.name}
                                                        {isSelected && <CheckCircle2 size={14} className="text-[#1A4B9C]" />}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                        <MapPin size={12} className="text-[#fe762a] flex-shrink-0" />
                                                        <span className="truncate">{proj.location}</span>
                                                    </div>
                                                </div>

                                                <span 
                                                    className="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider text-white"
                                                    style={{ backgroundColor: proj.statusBg || '#a14000' }}
                                                >
                                                    {proj.status || 'AVAILABLE'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                                                <span className="text-slate-600 font-semibold">{proj.type || 'Residential'}</span>
                                                <span className="text-slate-500 font-medium">{proj.area || ''}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-400 text-xs">
                                    No project locations match your filter. Try selecting "All Locations".
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT MAIN AREA: Interactive Google/GIS Map Box (8 cols) */}
                    <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
                        
                        {/* Map Header Toolbar */}
                        <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#1A4B9C] text-white rounded-lg flex items-center justify-center font-bold">
                                    <Compass size={18} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        {activeProject.name || 'Select a Project Location'}
                                    </h2>
                                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <MapPin size={12} className="text-[#fe762a]" />
                                        <span>{activeProject.location || 'Narayanganj'}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-[#1A4B9C] font-semibold">GIS Map Location</span>
                                    </div>
                                </div>
                            </div>

                            {activeProject.mapLink && (
                                <a
                                    href={activeProject.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-white border border-[#E2E8F0] text-[#1A4B9C] hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                                >
                                    Open in Full Google Maps <ExternalLink size={12} />
                                </a>
                            )}
                        </div>

                        {/* Interactive Embedded Map Viewport */}
                        <div className="flex-1 bg-slate-100 relative">
                            <iframe
                                key={`${activeProject.id || 'p1'}_${getMapEmbedUrl(activeProject)}`}
                                title={`GIS Map for ${activeProject.name}`}
                                src={getMapEmbedUrl(activeProject)}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                            ></iframe>

                            {/* Floating Info Overlay Box */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-lg max-w-xs text-xs space-y-1">
                                <div className="font-extrabold text-slate-900">{activeProject.name}</div>
                                <div className="text-[#fe762a] font-bold flex items-center gap-1">
                                    <MapPin size={12} /> {activeProject.location}
                                </div>
                                <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">
                                    {activeProject.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOWER SECTION: Nearby Amenities */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <div className="text-[10px] font-bold text-[#fe762a] uppercase tracking-widest mb-0.5">
                                2 KM Radius Geographic Analysis
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                Nearby Amenities for <span className="text-[#1A4B9C]">{activeProject.name}</span>
                            </h2>
                        </div>
                    </div>

                    {/* 4 Amenity Cards Grid: Hospitals, Schools, Colleges, Markets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* 1. Hospitals */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-red-300 transition-colors">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                                <div className="w-9 h-9 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <Hospital size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Hospitals & Health</h3>
                                    <div className="text-[10px] text-slate-500 font-semibold">Within 2 km</div>
                                </div>
                            </div>
                            
                            <ul className="space-y-2 flex-1">
                                {hospitals.map((h, i) => (
                                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded border border-slate-100">
                                        <ChevronRight size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 2. Schools */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <School size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Nearby Schools</h3>
                                    <div className="text-[10px] text-slate-500 font-semibold">Within 2 km</div>
                                </div>
                            </div>
                            
                            <ul className="space-y-2 flex-1">
                                {schools.map((s, i) => (
                                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded border border-slate-100">
                                        <ChevronRight size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 3. Colleges / Varsities */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                                <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Colleges & Universities</h3>
                                    <div className="text-[10px] text-slate-500 font-semibold">Within 2 km</div>
                                </div>
                            </div>
                            
                            <ul className="space-y-2 flex-1">
                                {colleges.map((c, i) => (
                                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded border border-slate-100">
                                        <ChevronRight size={12} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{c}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. Markets / Malls */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                                <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                    <ShoppingBag size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Markets & Malls</h3>
                                    <div className="text-[10px] text-slate-500 font-semibold">Within 2 km</div>
                                </div>
                            </div>
                            
                            <ul className="space-y-2 flex-1">
                                {markets.map((m, i) => (
                                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded border border-slate-100">
                                        <ChevronRight size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Gismap;