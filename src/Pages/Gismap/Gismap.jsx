import { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Home, Building2, Layers, CheckSquare, Square, ChevronDown, Info, Navigation, Hospital, GraduationCap, Bus, ShoppingCart } from 'lucide-react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

// ─── GIS Map ──────────────────────────────────────────────────────────────────
// Figma frame: 1280×800, node-id=1:2
// Layout: Header (80px) + [Sidebar (320px) | Map Area (fill)] + Footer
// Sidebar: MAP FILTERS — checkboxes by type & status, legend
// Map:     Full-height tile/satellite view with project pin markers
// ─────────────────────────────────────────────────────────────────────────────

// ── Design tokens ─────────────────────────────────────────────────────────────
const CLR = {
    dark:       '#000f22',
    accent:     '#a14000',
    accentBright: '#fe762a',
    muted:      '#43474d',
    border:     '#c4c6ce',
    bg:         '#f3f4f5',
    white:      '#ffffff',
    textLight:  '#74777e',
    highlight:  '#0a2540',
};

// ── Project pin data ───────────────────────────────────────────────────────────
const PROJECTS = [
    {
        id: 1,
        name: 'Reliance Zenith Towers',
        type: 'Residential',
        status: 'Available',
        location: 'Narayanganj',
        // Approximate lat/lng for iframe embed
        lat: 23.6238,
        lng: 90.4993,
        color: '#a14000',
        description: 'Premium residential tower with panoramic river views across 32 floors.',
    },
    {
        id: 2,
        name: 'Nexus Business Hub',
        type: 'Commercial',
        status: 'Sold Out',
        location: 'BB Road, Narayanganj',
        lat: 23.6158,
        lng: 90.5010,
        color: '#000f22',
        description: 'Column-free commercial floors with fibre-optic connectivity.',
    },
    {
        id: 3,
        name: 'The Heritage Plaza',
        type: 'Mixed Use',
        status: 'Ready to Move',
        location: 'Shamabay, Narayanganj',
        lat: 23.6300,
        lng: 90.4940,
        color: '#0a3d2e',
        description: 'Heritage-inspired mixed-use development in the commercial district.',
    },
];

// ── Filter config ──────────────────────────────────────────────────────────────
const TYPE_FILTERS   = ['Residential', 'Commercial', 'Mixed Use'];
const STATUS_FILTERS = ['Available', 'Sold Out', 'Ready to Move'];

// ── Legend items ───────────────────────────────────────────────────────────────
const LEGEND = [
    { label: 'Residential',    color: '#a14000' },
    { label: 'Commercial',     color: '#000f22' },
    { label: 'Mixed Use',      color: '#0a3d2e' },
];

// ── Status badge colours ───────────────────────────────────────────────────────
const STATUS_COLORS = {
    'Available':     { bg: '#a14000',  text: '#fff' },
    'Sold Out':      { bg: '#000f22',  text: '#fff' },
    'Ready to Move': { bg: '#0a3d2e',  text: '#fff' },
};

// ─────────────────────────────────────────────────────────────────────────────
const Gismap = () => {
    const [activeTypes,   setActiveTypes]   = useState(new Set(TYPE_FILTERS));
    const [activeStatuses, setActiveStatuses] = useState(new Set(STATUS_FILTERS));
    const [selectedProject, setSelectedProject] = useState(null);
    const [filtersOpen,   setFiltersOpen]   = useState(true);
    const [legendOpen,    setLegendOpen]    = useState(true);
    const [amenitiesOpen, setAmenitiesOpen] = useState(true);
    const [activeAmenities, setActiveAmenities] = useState(new Set());

    const AMENITIES = [
        { key: 'hospital', label: 'Hospital',  icon: Hospital,      color: '#dc2626' },
        { key: 'school',   label: 'School',    icon: GraduationCap, color: '#2563eb' },
        { key: 'transit',  label: 'Transit',   icon: Bus,           color: '#7c3aed' },
        { key: 'shops',    label: 'Shops',     icon: ShoppingCart,  color: '#059669' },
    ];

    const toggleAmenity = (key) =>
        setActiveAmenities(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    const toggleType = (t) =>
        setActiveTypes(prev => {
            const next = new Set(prev);
            next.has(t) ? next.delete(t) : next.add(t);
            return next;
        });

    const toggleStatus = (s) =>
        setActiveStatuses(prev => {
            const next = new Set(prev);
            next.has(s) ? next.delete(s) : next.add(s);
            return next;
        });

    const visibleProjects = PROJECTS.filter(
        p => activeTypes.has(p.type) && activeStatuses.has(p.status)
    );

    // Build an OpenStreetMap embed URL centered on Narayanganj
    const mapCenter = '23.6238,90.4993';
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=90.47%2C23.60%2C90.52%2C23.65&layer=mapnik&marker=${mapCenter}`;

    return (
        <div className="flex flex-col min-h-screen bg-[#f3f4f5]">
            <Navbar />

            {/* ══ Page Title Bar ══════════════════════════════════════════════ */}
            <div className="bg-[#000f22] border-b border-[#0a2540]">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#a14000] flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-[18px] font-bold text-white leading-tight tracking-tight">
                                GIS Property Map
                            </h1>
                            <p className="text-[12px] font-normal text-[#768dad]">
                                Narayanganj — Live project site locations
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#0a2540] border border-[#a14000]/30 px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#a14000] animate-pulse" />
                            <span className="text-[11px] font-semibold text-[#c4c6ce] uppercase tracking-wider">
                                Live Map View
                            </span>
                        </span>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#a14000] hover:bg-[#5e2200] text-white text-[11px] font-bold uppercase tracking-wider transition-colors duration-200"
                        >
                            ← All Projects
                        </Link>
                    </div>
                </div>
            </div>

            {/* ══ Main Content ════════════════════════════════════════════════ */}
            <div className="flex-grow flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 220px)' }}>

                {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
                <aside className="
                    w-full lg:w-[320px] lg:flex-shrink-0
                    bg-white border-b lg:border-b-0 lg:border-r border-[#c4c6ce]
                    flex flex-col overflow-y-auto
                    lg:max-h-[calc(100vh-160px)] lg:sticky lg:top-0
                ">
                    {/* Sidebar header */}
                    <div className="px-5 py-4 border-b border-[#e1e3e4] flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Layers size={14} className="text-[#a14000]" />
                            <span className="text-[11px] font-semibold text-[#74777e] uppercase tracking-[0.1em]">
                                Map Controls
                            </span>
                        </div>
                    </div>

                    {/* Scrollable filter area */}
                    <div className="flex-grow overflow-y-auto">

                        {/* MAP FILTERS Section */}
                        <div className="border-b border-[#e1e3e4]">
                            <button
                                onClick={() => setFiltersOpen(f => !f)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f8f9fa] transition-colors"
                            >
                                <span className="text-[12px] font-semibold text-[#000f22] uppercase tracking-[0.1em]">
                                    MAP FILTERS
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-[#74777e] transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {filtersOpen && (
                                <div className="px-5 pb-4 flex flex-col gap-5">

                                    {/* By Property Type */}
                                    <div>
                                        <p className="text-[10px] font-semibold text-[#74777e] uppercase tracking-[0.12em] mb-2">
                                            Property Type
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            {TYPE_FILTERS.map(type => {
                                                const checked = activeTypes.has(type);
                                                const legendColor = LEGEND.find(l => l.label === type)?.color || '#a14000';
                                                return (
                                                    <label
                                                        key={type}
                                                        className="flex items-center gap-3 cursor-pointer py-2 px-2 hover:bg-[#f8f9fa] rounded-sm group"
                                                    >
                                                        {/* Custom checkbox */}
                                                        <div
                                                            onClick={() => toggleType(type)}
                                                            className="w-[18px] h-[18px] border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors"
                                                            style={{
                                                                background: checked ? legendColor : '#fff',
                                                                borderColor: checked ? legendColor : '#c4c6ce',
                                                            }}
                                                        >
                                                            {checked && (
                                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-[14px] font-normal text-[#43474d] group-hover:text-[#000f22] select-none">
                                                            {type}
                                                        </span>
                                                        {/* colour dot */}
                                                        <span
                                                            className="ml-auto w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                            style={{ background: legendColor }}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* By Status */}
                                    <div>
                                        <p className="text-[10px] font-semibold text-[#74777e] uppercase tracking-[0.12em] mb-2">
                                            Availability Status
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            {STATUS_FILTERS.map(status => {
                                                const checked = activeStatuses.has(status);
                                                const sc = STATUS_COLORS[status];
                                                return (
                                                    <label
                                                        key={status}
                                                        className="flex items-center gap-3 cursor-pointer py-2 px-2 hover:bg-[#f8f9fa] rounded-sm group"
                                                    >
                                                        <div
                                                            onClick={() => toggleStatus(status)}
                                                            className="w-[18px] h-[18px] border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors"
                                                            style={{
                                                                background: checked ? sc.bg : '#fff',
                                                                borderColor: checked ? sc.bg : '#c4c6ce',
                                                            }}
                                                        >
                                                            {checked && (
                                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-[14px] font-normal text-[#43474d] group-hover:text-[#000f22] select-none">
                                                            {status}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* LEGEND Section */}
                        <div className="border-b border-[#e1e3e4]">
                            <button
                                onClick={() => setLegendOpen(l => !l)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f8f9fa] transition-colors"
                            >
                                <span className="text-[12px] font-semibold text-[#000f22] uppercase tracking-[0.1em]">
                                    LEGEND
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-[#74777e] transition-transform duration-200 ${legendOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {legendOpen && (
                                <div className="px-5 pb-4 flex flex-col gap-2">
                                    {LEGEND.map(({ label, color }) => (
                                        <div key={label} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ background: color }} />
                                            <span className="text-[13px] font-normal text-[#43474d]">{label}</span>
                                        </div>
                                    ))}
                                    <div className="mt-2 pt-2 border-t border-[#e1e3e4]">
                                        <p className="text-[11px] text-[#74777e]">
                                            {visibleProjects.length} of {PROJECTS.length} sites visible
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NEARBY AMENITIES Section */}
                        <div className="border-b border-[#e1e3e4]">
                            <button
                                onClick={() => setAmenitiesOpen(a => !a)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f8f9fa] transition-colors"
                            >
                                <span className="text-[12px] font-semibold text-[#000f22] uppercase tracking-[0.1em]">
                                    NEARBY AMENITIES
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-[#74777e] transition-transform duration-200 ${amenitiesOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {amenitiesOpen && (
                                <div className="px-5 pb-4 flex flex-col gap-1">
                                    {AMENITIES.map(({ key, label, icon: Icon, color }) => {
                                        const active = activeAmenities.has(key);
                                        return (
                                            <label
                                                key={key}
                                                className="flex items-center gap-3 cursor-pointer py-2 px-2 hover:bg-[#f8f9fa] rounded-sm group"
                                            >
                                                {/* Custom checkbox */}
                                                <div
                                                    onClick={() => toggleAmenity(key)}
                                                    className="w-[18px] h-[18px] border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors"
                                                    style={{
                                                        background: active ? color : '#fff',
                                                        borderColor: active ? color : '#c4c6ce',
                                                    }}
                                                >
                                                    {active && (
                                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </div>
                                                {/* Icon badge */}
                                                <div
                                                    className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
                                                    style={{ background: active ? color : '#f3f4f5' }}
                                                >
                                                    <Icon size={14} style={{ color: active ? '#fff' : color }} />
                                                </div>
                                                <span className="text-[14px] font-normal text-[#43474d] group-hover:text-[#000f22] select-none">
                                                    {label}
                                                </span>
                                                {active && (
                                                    <span
                                                        className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                                        style={{ background: color, color: '#fff' }}
                                                    >
                                                        ON
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                    {activeAmenities.size > 0 && (
                                        <p className="mt-1 text-[10px] text-[#74777e] px-2">
                                            {activeAmenities.size} amenity layer{activeAmenities.size > 1 ? 's' : ''} active — shown on map
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PROJECT LIST */}
                        <div className="px-5 py-4">
                            <p className="text-[10px] font-semibold text-[#74777e] uppercase tracking-[0.12em] mb-3">
                                Site Index
                            </p>
                            {visibleProjects.length === 0 ? (
                                <div className="text-center py-6">
                                    <MapPin size={24} className="mx-auto text-[#c4c6ce] mb-2" />
                                    <p className="text-[13px] text-[#74777e]">No sites match filters</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {visibleProjects.map(project => {
                                        const isSelected = selectedProject?.id === project.id;
                                        const sc = STATUS_COLORS[project.status];
                                        return (
                                            <button
                                                key={project.id}
                                                onClick={() => setSelectedProject(isSelected ? null : project)}
                                                className={`
                                                    w-full text-left border px-3 py-3 transition-all duration-150
                                                    ${isSelected
                                                        ? 'border-[#a14000] bg-[#a14000]/5'
                                                        : 'border-[#e1e3e4] bg-white hover:border-[#c4c6ce] hover:bg-[#f8f9fa]'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-start gap-2 mb-1.5">
                                                    <div
                                                        className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                                                        style={{ background: LEGEND.find(l => l.label === project.type)?.color }}
                                                    />
                                                    <span className="text-[13px] font-semibold text-[#000f22] leading-tight">
                                                        {project.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between ml-4">
                                                    <span className="text-[11px] text-[#74777e] flex items-center gap-1">
                                                        <MapPin size={10} />
                                                        {project.location}
                                                    </span>
                                                    <span
                                                        className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                                                        style={{ background: sc.bg, color: sc.text }}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <p className="mt-2 ml-4 text-[11px] text-[#43474d] leading-snug">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>{/* end scrollable */}
                </aside>

                {/* ── MAP AREA ─────────────────────────────────────────────── */}
                <div className="flex-grow relative overflow-hidden min-h-[400px] lg:min-h-0 bg-[#000f22]">

                    {/* OpenStreetMap embed */}
                    <iframe
                        title="NexusBuild GIS Property Map — Narayanganj"
                        src={mapUrl}
                        className="absolute inset-0 w-full h-full border-0 z-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Dark colour-grade overlay matching Figma desaturation */}
                    <div className="absolute inset-0 bg-[#000f22]/10 pointer-events-none z-10" />

                    {/* ── MAP MARKER PINS overlay (visual, non-interactive) ── */}
                    {/* These are positioned using % to mimic Figma placement */}
                    {visibleProjects.map((project, i) => {
                        // Spread markers across the map area visually
                        const positions = [
                            { top: '38%', left: '46%' },
                            { top: '60%', left: '55%' },
                            { top: '25%', left: '34%' },
                        ];
                        const pos = positions[i % positions.length];
                        const isSelected = selectedProject?.id === project.id;
                        const pinColor = LEGEND.find(l => l.label === project.type)?.color || '#a14000';
                        return (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProject(isSelected ? null : project)}
                                className="absolute group z-10 cursor-pointer"
                                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%,-100%)' }}
                                aria-label={`Select ${project.name}`}
                            >
                                {/* Pin tooltip */}
                                {isSelected && (
                                    <div className="
                                        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                        bg-[#000f22] text-white text-[11px] font-semibold
                                        px-3 py-2 whitespace-nowrap shadow-xl pointer-events-none
                                        border-t-2
                                    "
                                    style={{ borderColor: pinColor }}
                                    >
                                        <div>{project.name}</div>
                                        <div className="text-[10px] font-normal text-[#768dad] mt-0.5">{project.location}</div>
                                        {/* Triangle */}
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                                            style={{
                                                borderLeft: '6px solid transparent',
                                                borderRight: '6px solid transparent',
                                                borderTop: `6px solid #000f22`,
                                            }}
                                        />
                                    </div>
                                )}
                                {/* Pin body — Figma: rounded rect + downward triangle */}
                                <div
                                    className={`
                                        w-11 h-12 rounded-[8px] shadow-lg flex items-center justify-center
                                        transition-all duration-150
                                        ${isSelected ? 'scale-110 ring-2 ring-white ring-offset-1' : 'hover:scale-105'}
                                    `}
                                    style={{ background: pinColor }}
                                >
                                    {project.type === 'Residential' && <Home size={18} className="text-white" />}
                                    {project.type === 'Commercial'  && <Building2 size={18} className="text-white" />}
                                    {project.type === 'Mixed Use'   && <Layers size={18} className="text-white" />}
                                </div>
                                {/* Pin tail triangle */}
                                <div
                                    className="mx-auto w-0 h-0"
                                    style={{
                                        borderLeft: '7px solid transparent',
                                        borderRight: '7px solid transparent',
                                        borderTop: `10px solid ${pinColor}`,
                                    }}
                                />
                                {/* Pulse ring on selected */}
                                {isSelected && (
                                    <div
                                        className="absolute inset-0 rounded-[8px] animate-ping opacity-30"
                                        style={{ background: pinColor }}
                                    />
                                )}
                            </button>
                        );
                    })}

                    {/* ── Bottom-right: Selected project info card ───────────── */}
                    {selectedProject && (
                        <div className="
                            absolute bottom-6 right-6 z-20
                            w-[280px] bg-white shadow-[0px_25px_50px_#00000040]
                            border-t-4
                        "
                        style={{ borderColor: LEGEND.find(l => l.label === selectedProject.type)?.color }}
                        >
                            <div className="px-4 pt-4 pb-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="text-[14px] font-bold text-[#000f22] leading-tight">
                                        {selectedProject.name}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="text-[#74777e] hover:text-[#000f22] flex-shrink-0 mt-0.5"
                                        aria-label="Close"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
                                        style={{
                                            background: STATUS_COLORS[selectedProject.status]?.bg,
                                            color: STATUS_COLORS[selectedProject.status]?.text,
                                        }}
                                    >
                                        {selectedProject.status}
                                    </span>
                                    <span className="text-[11px] text-[#74777e]">{selectedProject.type}</span>
                                </div>
                                <p className="text-[12px] text-[#43474d] leading-relaxed mb-3">
                                    {selectedProject.description}
                                </p>
                                <div className="flex items-center gap-1 text-[11px] text-[#74777e] mb-3">
                                    <MapPin size={11} />
                                    {selectedProject.location}
                                </div>
                                <Link
                                    to="/"
                                    className="
                                        flex items-center justify-center gap-2 w-full py-2.5
                                        bg-[#000f22] hover:bg-[#0a2540] text-white
                                        text-[12px] font-bold uppercase tracking-wider
                                        transition-colors duration-200
                                    "
                                >
                                    View Project Details
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── Top-right: Map controls ────────────────────────────── */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <a
                            href={`https://www.openstreetmap.org/#map=14/23.6238/90.4993`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                w-10 h-10 bg-white shadow-lg flex items-center justify-center
                                hover:bg-[#f3f4f5] transition-colors duration-150
                                border border-[#c4c6ce]
                            "
                            title="Open in full map"
                        >
                            <Navigation size={16} className="text-[#000f22]" />
                        </a>
                        <div className="
                            bg-white shadow-lg border border-[#c4c6ce]
                            px-3 py-2 max-w-[180px]
                        ">
                            <p className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider mb-0.5">
                                Map Area
                            </p>
                            <p className="text-[11px] font-normal text-[#000f22]">Narayanganj District</p>
                            <p className="text-[10px] text-[#74777e]">23.62°N, 90.49°E</p>
                        </div>
                    </div>

                    {/* OSM Attribution */}
                    <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                        <span className="text-[9px] text-[#000f22]/50 bg-white/70 px-1.5 py-0.5">
                            © OpenStreetMap contributors
                        </span>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Gismap;