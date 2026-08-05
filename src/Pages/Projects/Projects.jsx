import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, ArrowRight, Wrench, CalendarCheck, RotateCcw } from "lucide-react";
import { PROJECTS } from "../../data/projectsData";

// ── Public image paths (files in /public/frontend/projects/) ──────────────────
const IMG_HERO = "/Frontend/Projects/Hero_Section.svg";
const IMG_SERVICES = "/Frontend/Projects/Professional_Services_Remodeling.svg";
const IMG_ABOUT = "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg";

// ─── Projects ─────────────────────────────────────────────────────────────────
// Figma frame: 1310×3783, node-id=1:753
// Sections:
//   1. Hero Section (1310×870): dark overlay, search/filter bar
//   2. All Projects Section (1280×898): 3-card grid with filter integration
//   3. GIS Map Module
//   4. Services & Remodeling Section (#000f22)
//   5. About Us Section
// ─────────────────────────────────────────────────────────────────────────────

const Projects = () => {
    // ── Filter State ──────────────────────────────────────────────────────────
    const [locationFilter, setLocationFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Applied filter state (triggered by Search button or immediate select)
    const [appliedFilters, setAppliedFilters] = useState({
        location: "",
        type: "",
        status: "",
    });

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setAppliedFilters({
            location: locationFilter,
            type: typeFilter,
            status: statusFilter,
        });
    };

    const handleResetFilters = () => {
        setLocationFilter("");
        setTypeFilter("");
        setStatusFilter("");
        setAppliedFilters({ location: "", type: "", status: "" });
    };

    // Filter projects based on active applied criteria
    const filteredProjects = PROJECTS.filter((project) => {
        // Location filter match
        if (
            appliedFilters.location &&
            project.location.toLowerCase() !== appliedFilters.location.toLowerCase()
        ) {
            return false;
        }
        // Type filter match
        if (
            appliedFilters.type &&
            project.type.toLowerCase() !== appliedFilters.type.toLowerCase()
        ) {
            return false;
        }
        // Status filter match
        if (
            appliedFilters.status &&
            project.status.toLowerCase() !== appliedFilters.status.toLowerCase()
        ) {
            return false;
        }
        return true;
    });

    return (
        <div className="flex flex-col min-h-screen bg-white font-[Inter,sans-serif]">

            {/* ══════════════════════════════════════════════════════════════
             * 1. HERO SECTION
             * Figma: 1310×870, HORIZONTAL, bg #000f22 overlay
             *   Container: 1280px wide, 48px H pad
             *   Content: 672px wide, vertical, 16px gap
             *     - Red pill "RELIANCE HOUSING LTD." 12px fw=500 #ffffff, bg #a14000
             *     - Heading: "Modern Real Estate & Infrastructure Management." 48px fw=700 white
             *     - Body: 18px fw=400 #e1e3e4
             *     - Integrated Search/Filter bar: white bg r=8, 3 filter cells + search button (#000f22)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[600px] lg:min-h-[870px] overflow-hidden flex items-center">

                {/* Hero background image */}
                <img
                    src={IMG_HERO}
                    alt="NexusBuild Modern Real Estate"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                />
                {/* Dark overlay for text legibility */}
                <div className="absolute inset-0 bg-[#000f22]/75" />

                <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                    <div className="max-w-[672px] flex flex-col gap-4">

                        {/* Figma: red pill — #a14000 fill, 12px fw=500 white */}
                        <div className="inline-flex self-start">
                            <span className="bg-[#a14000] text-white text-[12px] font-medium px-3 py-1 uppercase tracking-wider">
                                Reliance Housing Ltd.
                            </span>
                        </div>

                        {/* Figma: Heading 1 — 48px fw=700 white */}
                        <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-white leading-tight tracking-tight">
                            Modern Real Estate &amp; Infrastructure Management.
                        </h1>

                        {/* Figma: body — 18px fw=400 #e1e3e4 */}
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#e1e3e4] leading-relaxed">
                            Precision-engineered living spaces and commercial hubs designed for the next generation. Leveraging GIS technology for unparalleled site accuracy.
                        </p>

                        {/* Figma: Integrated Search/Filter Form — white bg r=8, shadow */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mt-4 bg-white rounded-[8px] shadow-[0px_25px_50px_#00000040] flex flex-col sm:flex-row overflow-hidden"
                        >

                            {/* Filter cell 1: Location */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <MapPin size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col w-full">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Location</span>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => {
                                            setLocationFilter(e.target.value);
                                            setAppliedFilters(prev => ({ ...prev, location: e.target.value }));
                                        }}
                                        className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer w-full"
                                    >
                                        <option value="">All Areas</option>
                                        <option value="Narayanganj">Narayanganj</option>
                                        <option value="BB Road">BB Road</option>
                                        <option value="Shamabay">Shamabay</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter cell 2: Type */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <Wrench size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col w-full">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Type</span>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => {
                                            setTypeFilter(e.target.value);
                                            setAppliedFilters(prev => ({ ...prev, type: e.target.value }));
                                        }}
                                        className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer w-full"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Mixed Use">Mixed Use</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter cell 3: Status */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <CalendarCheck size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col w-full">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Status</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setAppliedFilters(prev => ({ ...prev, status: e.target.value }));
                                        }}
                                        className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer w-full"
                                    >
                                        <option value="">Any Status</option>
                                        <option value="Available">Available</option>
                                        <option value="Sold Out">Sold Out</option>
                                        <option value="Ready to Move">Ready to Move</option>
                                    </select>
                                </div>
                            </div>

                            {/* Figma: Search button — #000f22 fill, white text, 14px fw=700 */}
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#000f22] hover:bg-[#0a2540] text-white text-[14px] font-bold transition-colors duration-200 cursor-pointer min-h-[44px] flex-shrink-0"
                            >
                                <Search size={16} />
                                <span>Search<br className="hidden lg:block" /> Projects</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 2. ALL PROJECTS SECTION
             * Figma: 1280×898, vertical, 48px gap, 96px V / 48px H padding
             *   Header: "Signature Developments" 32px fw=600 #000f22
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

                    {/* Section header & active filter info */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            {/* Figma: 32px fw=600 #000f22 */}
                            <h2 className="text-[28px] lg:text-[32px] font-semibold text-[#000f22] leading-tight">
                                Signature Developments
                            </h2>
                            {/* Figma: 16px fw=400 #43474d */}
                            <p className="text-[16px] font-normal text-[#43474d] leading-relaxed max-w-xl">
                                Explore our portfolio of architectural excellence, from luxury residences to premier commercial spaces.
                            </p>
                        </div>

                        {/* Reset / All link */}
                        {(appliedFilters.location || appliedFilters.type || appliedFilters.status) ? (
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-2 text-[14px] font-bold text-[#a14000] hover:text-[#5e2200] transition-colors flex-shrink-0 cursor-pointer"
                            >
                                <RotateCcw size={14} />
                                Reset Filters ({filteredProjects.length} found)
                            </button>
                        ) : (
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-2 text-[14px] font-bold text-[#a14000] hover:text-[#5e2200] transition-colors flex-shrink-0 cursor-pointer"
                            >
                                View All Projects ({PROJECTS.length})
                                <ArrowRight size={14} />
                            </button>
                        )}
                    </div>

                    {/* Project Grid OR Empty State */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white border border-[#c4c6ce] flex flex-col hover:shadow-lg transition-shadow duration-200"
                                >
                                    {/* Card image area — Figma: 256px tall, with status pill overlay */}
                                    <div className="relative h-[200px] lg:h-[256px] overflow-hidden flex-shrink-0">
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {/* Status pill */}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className="text-[12px] font-bold text-white px-3 py-1 uppercase tracking-wider rounded-[2px]"
                                                style={{ backgroundColor: project.statusBg }}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="flex flex-col flex-1 p-6 gap-3">
                                        <h3 className="text-[24px] font-semibold text-[#000f22] leading-tight">
                                            {project.name}
                                        </h3>

                                        {/* Meta row */}
                                        <div className="flex items-center gap-4 text-[12px] text-[#74777e]">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {project.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Wrench size={12} />
                                                {project.type}
                                            </span>
                                        </div>

                                        <p className="text-[16px] font-normal text-[#43474d] leading-relaxed flex-1">
                                            {project.description}
                                        </p>

                                        {/* Project Details Link/Btn */}
                                        <Link
                                            to={`/project-details/${project.id}`}
                                            className="w-full flex items-center justify-center gap-2 py-3 border border-[#000f22] text-[#000f22] text-[14px] font-bold hover:bg-[#000f22] hover:text-white transition-colors duration-200 cursor-pointer min-h-[44px]"
                                        >
                                            Project Details
                                        </Link>

                                        {/* View Map Link/Btn */}
                                        <Link
                                            to="/gismap"
                                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#c4c6ce] text-[#43474d] text-[14px] font-bold hover:border-[#0a2540] hover:text-[#0a2540] transition-colors duration-200 cursor-pointer min-h-[44px]"
                                        >
                                            <MapPin size={14} />
                                            View Map
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Styled Empty State when search returns no projects */
                        <div className="bg-[#f8f9fa] border border-[#c4c6ce] p-10 sm:p-14 text-center rounded-[8px] flex flex-col items-center justify-center gap-4 my-4">
                            <div className="w-16 h-16 bg-[#fe762a]/10 text-[#a14000] rounded-full flex items-center justify-center">
                                <Search size={30} />
                            </div>
                            <h3 className="text-[22px] font-bold text-[#000f22]">
                                No projects match your search
                            </h3>
                            <p className="text-[15px] font-normal text-[#43474d] max-w-md leading-relaxed">
                                We couldn't find any developments matching your selected location, type, or status criteria. Try different filters or reset your search.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#000f22] hover:bg-[#0a2540] text-white text-[14px] font-bold rounded-[4px] transition-colors cursor-pointer"
                            >
                                <RotateCcw size={16} />
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 3. GIS MAP MODULE
             * Figma: 'Section - GIS Map Module' 1310×160 fill=#edeeef
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#edeeef] h-[120px] lg:h-[160px] flex items-center justify-center px-6">
                <Link
                    to="/gismap"
                    className="text-[14px] font-semibold text-[#74777e] hover:text-[#000f22] uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    <MapPin size={16} className="text-[#a14000]" />
                    GIS Map Integration — Click to Launch Interactive Map
                </Link>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 4. SERVICES & REMODELING SECTION
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#000f22] py-16 lg:py-20 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-12">

                    {/* Left column */}
                    <div className="flex-1 flex flex-col gap-4 max-w-[488px]">
                        <h2 className="text-[28px] lg:text-[32px] font-semibold text-white leading-tight">
                            Professional Services &amp; Remodeling
                        </h2>
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#768dad] leading-relaxed">
                            Beyond construction, we offer comprehensive project operations, remodeling, and site visit scheduling for existing and new property owners.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 py-4">
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 bg-[#a14000] flex items-center justify-center flex-shrink-0">
                                    <Wrench size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[14px] font-bold text-white">Remodeling</h4>
                                    <p className="text-[12px] text-[#768dad] leading-snug">Full-scope interior &amp; structural renovation services.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 bg-[#a14000] flex items-center justify-center flex-shrink-0">
                                    <CalendarCheck size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[14px] font-bold text-white">Site Visits</h4>
                                    <p className="text-[12px] text-[#768dad] leading-snug">Scheduled on-site assessments with expert consultants.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white text-[14px] font-bold transition-colors duration-200 min-h-[52px]"
                            >
                                Inquire for Service
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right column — services image */}
                    <div className="flex-1 max-w-[488px] mx-auto lg:mx-0">
                        <div className="w-full aspect-square max-h-[488px] rounded-[4px] overflow-hidden">
                            <img
                                src={IMG_SERVICES}
                                alt="Professional Services & Remodeling"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 5. ABOUT US SECTION
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Left */}
                    <div className="flex-1 flex flex-col gap-6 max-w-[552px]">
                        <h2 className="text-[28px] lg:text-[32px] font-semibold text-[#000f22] leading-tight">
                            Decades of Trust in Narayanganj.
                        </h2>
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#43474d] leading-relaxed">
                            Since our founding at Shamabay New Market, Reliance Housing Ltd. has been synonymous with stability and innovation in the local infrastructure landscape.
                        </p>
                        <p className="text-[16px] font-normal text-[#43474d] leading-relaxed">
                            We don't just build apartments; we architect communities. From the bustling corridors of BB Road to the quiet luxury of riverfront estates, our commitment remains the same: uncompromising quality and absolute transparency.
                        </p>

                        <div className="flex items-start gap-8 pt-4 border-t border-[#e1e3e4]">
                            {[
                                { value: "12+", label: "Years Active" },
                                { value: "150+", label: "Projects Delivered" },
                                { value: "12k+", label: "Families Housed" },
                            ].map(({ value, label }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <span className="text-[32px] font-bold text-[#000f22] leading-none">{value}</span>
                                    <span className="text-[12px] font-medium text-[#43474d] uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex-1 relative max-w-[552px] w-full">
                        <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-[#a14000] rounded-[12px] z-0" />
                        <div className="relative z-10 w-full aspect-[4/3] overflow-hidden border-[8px] border-white shadow-[0px_20px_25px_#0000001a]">
                            <img
                                src={IMG_ABOUT}
                                alt="Decades of Trust in Narayanganj"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50 group">
                <Link
                    to="/contact"
                    className="w-14 h-14 bg-[#a14000] rounded-[12px] shadow-[0px_10px_15px_#0000001a] flex items-center justify-center text-white hover:bg-[#5e2200] transition-colors duration-200"
                    aria-label="Help Desk"
                >
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                        <path d="M10 0C4.48 0 0 3.58 0 8c0 1.85.75 3.55 2 4.85V18l4-2c1.29.33 2.61.5 4 .5 5.52 0 10-3.58 10-8S15.52 0 10 0z" fill="white" />
                    </svg>
                </Link>
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-[#000f22] text-white text-[12px] font-medium px-3 py-1 rounded-[2px] whitespace-nowrap">
                        Help Desk
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Projects;