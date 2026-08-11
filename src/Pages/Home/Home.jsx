import { useState } from "react";
import { Link } from "react-router";
import {
    MapPin,
    Wrench,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    FileText,
    Globe,
    LifeBuoy,
    Building2,
    ShieldCheck,
    Award
} from "lucide-react";

import { PROJECTS } from "../../data/projectsData";
import map_mockup from "../../assets/pics/map_mockup.png";

// Public assets matching design system
const IMG_HERO = "/Frontend/Projects/Hero_Section.svg";
const IMG_SERVICES = "/Frontend/Projects/Professional_Services_Remodeling.svg";
const IMG_ABOUT = "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg";

const ImageWithSkeleton = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full overflow-hidden bg-[#edeeef]">
            {!loaded && <div className="skeleton absolute inset-0 w-full h-full bg-[#e1e3e4]" />}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

const MapFrameWithSkeleton = ({ src, title }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full">
            {!loaded && (
                <div className="absolute inset-0 bg-[#000f22] flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3 text-white">
                        <span className="loading loading-spinner loading-lg text-[#fe762a]"></span>
                        <span className="text-xs font-semibold text-[#768dad]">Loading Map Coordinates...</span>
                    </div>
                </div>
            )}
            <iframe
                title={title}
                src={src}
                className="w-full h-full border-0 relative z-0"
                loading="lazy"
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
};

const Home = () => {
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("Chashiara");

    const neighborhoods = [
        {
            name: "Chashiara",
            stats: "45 Projects • 12 Active",
            desc: "The commercial heart of Narayanganj with premium retail and high-rise residential towers.",
            lat: 23.6238,
            lng: 90.4993,
            bbox: "90.47,23.60,90.52,23.65"
        },
        {
            name: "Deobhog",
            stats: "28 Projects • 8 Active",
            desc: "A rapidly growing residential area with modern schools, parks, and family-friendly complexes.",
            lat: 23.6280,
            lng: 90.4850,
            bbox: "90.46,23.61,90.51,23.66"
        },
        {
            name: "Masdair",
            stats: "19 Projects • 5 Active",
            desc: "Peaceful residential neighborhood known for green spaces and premium housing developments.",
            lat: 23.6180,
            lng: 90.5100,
            bbox: "90.48,23.59,90.53,23.64"
        },
        {
            name: "BB Road",
            stats: "15 Projects • 4 Active",
            desc: "High-density commercial corridor offering corporate headquarters and mixed-use complexes.",
            lat: 23.6158,
            lng: 90.5010,
            bbox: "90.47,23.59,90.52,23.64"
        }
    ];

    const selectedNbData = neighborhoods.find(n => n.name === selectedNeighborhood) || neighborhoods[0];

    // Take top 3 projects for the featured preview
    const featuredProjects = PROJECTS.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen bg-white font-[Inter,sans-serif] text-[#191c1d]">

            {/* ══════════════════════════════════════════════════════════════
             * 1. HERO SECTION
             * High-impact hero with brand tagline and direct CTAs to /projects
             * ══════════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[550px] lg:min-h-[720px] overflow-hidden flex items-center">
                {/* Hero background image */}
                <img
                    src={IMG_HERO}
                    alt="NexusBuild Real Estate & Infrastructure"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                />
                {/* Dark overlay using design token #000f22 */}
                <div className="absolute inset-0 bg-[#000f22]/80" />

                <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                    <div className="max-w-[720px] flex flex-col gap-6">

                        {/* Reliance Housing Ltd pill badge */}
                        <div className="inline-flex self-start">
                            <span className="bg-[#a14000] text-white text-[12px] font-medium px-3.5 py-1.5 uppercase tracking-wider rounded-[2px]">
                                Reliance Housing Ltd.
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold text-white leading-[1.15] tracking-tight">
                            Building Narayanganj's Future Architecture.
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#e1e3e4] leading-relaxed max-w-[620px]">
                            Precision-engineered residential complexes, commercial hubs, and GIS-mapped land developments designed for the next generation.
                        </p>

                        {/* Action CTAs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                            <Link
                                to="/projects"
                                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white text-[14px] font-bold transition-colors duration-200 min-h-[48px] rounded-[4px]"
                            >
                                Explore All Projects
                                <ArrowRight size={16} />
                            </Link>

                            <Link
                                to="/gismap"
                                className="flex items-center justify-center gap-2.5 px-8 py-4 border border-[#c4c6ce]/40 text-white hover:bg-white/10 text-[14px] font-bold transition-colors duration-200 min-h-[48px] rounded-[4px]"
                            >
                                <Globe size={16} className="text-[#fe762a]" />
                                Interactive GIS Map
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * STATS HIGHLIGHT TICKER BAR
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#000f22] border-t border-white/10 py-6 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fe762a]/10 flex items-center justify-center text-[#fe762a] flex-shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <span className="text-[24px] font-bold text-white leading-none block">150+</span>
                            <span className="text-[12px] text-[#768dad] uppercase tracking-wider font-medium">Projects Delivered</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fe762a]/10 flex items-center justify-center text-[#fe762a] flex-shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <span className="text-[24px] font-bold text-white leading-none block">12+ Years</span>
                            <span className="text-[12px] text-[#768dad] uppercase tracking-wider font-medium">Proven Expertise</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fe762a]/10 flex items-center justify-center text-[#fe762a] flex-shrink-0">
                            <Award size={20} />
                        </div>
                        <div>
                            <span className="text-[24px] font-bold text-white leading-none block">12k+</span>
                            <span className="text-[12px] text-[#768dad] uppercase tracking-wider font-medium">Families Housed</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fe762a]/10 flex items-center justify-center text-[#fe762a] flex-shrink-0">
                            <Globe size={20} />
                        </div>
                        <div>
                            <span className="text-[24px] font-bold text-white leading-none block">100%</span>
                            <span className="text-[12px] text-[#768dad] uppercase tracking-wider font-medium">GIS Site Accuracy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 2. FEATURED DEVELOPMENTS SECTION (LIMITED PREVIEW OF 3 PROJECTS)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold text-[#a14000] uppercase tracking-wider">
                                Featured Portfolio
                            </span>
                            <h2 className="text-[28px] lg:text-[32px] font-bold text-[#000f22] leading-tight">
                                Signature Developments
                            </h2>
                            <p className="text-[16px] font-normal text-[#43474d] leading-relaxed max-w-xl">
                                Hand-picked showcase of our premier residential and commercial properties in Narayanganj.
                            </p>
                        </div>

                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#a14000] hover:text-[#5e2200] transition-colors flex-shrink-0"
                        >
                            View All Projects ({PROJECTS.length})
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border border-[#c4c6ce] flex flex-col hover:shadow-lg transition-shadow duration-200 rounded-[4px] overflow-hidden"
                            >
                                <div className="relative h-[200px] lg:h-[240px] overflow-hidden flex-shrink-0">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="text-[12px] font-bold text-white px-3 py-1 uppercase tracking-wider rounded-[2px]"
                                            style={{ backgroundColor: project.statusBg }}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 p-6 gap-3">
                                    <h3 className="text-[22px] font-bold text-[#000f22] leading-tight">
                                        {project.name}
                                    </h3>

                                    <div className="flex items-center gap-4 text-[12px] text-[#74777e]">
                                        <span className="flex items-center gap-1 font-medium">
                                            <MapPin size={13} />
                                            {project.location}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Wrench size={13} />
                                            {project.type}
                                        </span>
                                    </div>

                                    <p className="text-[15px] font-normal text-[#43474d] leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    <Link
                                        to={`/project-details/${project.id}`}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-[#000f22] text-[#000f22] text-[14px] font-bold hover:bg-[#000f22] hover:text-white transition-colors duration-200 min-h-[44px] mt-2 rounded-[4px]"
                                    >
                                        Project Details
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 3. EXPLORE NEIGHBORHOODS & GIS MAP
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#f8f9fa] border-y border-[#c4c6ce]/50 py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-10">

                    <div>
                        <span className="text-[12px] font-semibold text-[#a14000] uppercase tracking-wider">
                            Location Insights
                        </span>
                        <h2 className="text-[28px] lg:text-[32px] font-bold text-[#000f22] leading-tight mt-1">
                            Explore Narayanganj Neighborhoods
                        </h2>
                        <p className="text-[16px] font-normal text-[#43474d] leading-relaxed max-w-xl">
                            Discover active properties and ongoing infrastructure developments mapped across prime sectors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                        {/* Left: Interactive list */}
                        <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
                            {neighborhoods.map((nb) => {
                                const isActive = selectedNeighborhood === nb.name;
                                return (
                                    <div
                                        key={nb.name}
                                        onClick={() => setSelectedNeighborhood(nb.name)}
                                        className={`p-5 rounded-[6px] border cursor-pointer transition-all ${
                                            isActive
                                                ? "bg-white border-[#fe762a] shadow-md"
                                                : "bg-white/60 border-[#c4c6ce] hover:border-[#74777e] hover:bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[16px] font-bold text-[#000f22]">{nb.name}</h4>
                                            <span className="text-[12px] font-medium text-[#74777e]">{nb.stats}</span>
                                        </div>
                                        {isActive && (
                                            <p className="text-[14px] text-[#43474d] mt-2 leading-relaxed">
                                                {nb.desc}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            <Link
                                to="/gismap"
                                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#000f22] hover:bg-[#0a2540] text-white text-[14px] font-bold rounded-[4px] transition-colors"
                            >
                                <Globe size={16} className="text-[#fe762a]" />
                                Launch Interactive GIS Map
                            </Link>
                        </div>

                        {/* Right: Map graphics preview */}
                        <div className="lg:col-span-7 bg-white p-3 border border-[#c4c6ce] rounded-[8px] overflow-hidden shadow-sm flex flex-col justify-between min-h-[380px] relative">
                            <div className="relative w-full h-full min-h-[340px] rounded-[4px] overflow-hidden bg-[#000f22] flex items-center justify-center">
                                {/* Live OpenStreetMap interactive embed centered on selected neighborhood with loading spinner */}
                                <MapFrameWithSkeleton
                                    key={selectedNbData.name}
                                    title={`NexusBuild GIS Map Preview — ${selectedNbData.name}`}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedNbData.bbox}&layer=mapnik&marker=${selectedNbData.lat}%2C${selectedNbData.lng}`}
                                />
                                {/* Fallback image background in case iframe loads slowly */}
                                <img
                                    src={map_mockup}
                                    alt="Map Mockup Fallback"
                                    className="absolute inset-0 w-full h-full object-cover -z-10"
                                />
                                <div className="absolute inset-0 bg-[#000f22]/10 pointer-events-none" />

                                <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-[6px] shadow-lg border border-[#c4c6ce] max-w-xs pointer-events-none">
                                    <span className="text-[10px] font-bold text-[#74777e] uppercase tracking-wider block">
                                        Selected Region
                                    </span>
                                    <p className="text-[16px] font-bold text-[#000f22] mt-0.5">
                                        {selectedNbData.name} District
                                    </p>
                                    <p className="text-[12px] text-[#43474d] mt-1">
                                        Lat: {selectedNbData.lat}°N, Lng: {selectedNbData.lng}°E — Live GIS plot active.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 4. PROFESSIONAL SERVICES & REMODELING
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#000f22] py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 items-center">

                    {/* Left details */}
                    <div className="flex-1 flex flex-col gap-6 max-w-[540px]">
                        <span className="text-[12px] font-semibold text-[#fe762a] uppercase tracking-wider">
                            Comprehensive Care
                        </span>
                        <h2 className="text-[28px] lg:text-[36px] font-bold text-white leading-tight">
                            Professional Services &amp; Remodeling
                        </h2>
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#768dad] leading-relaxed">
                            Beyond construction, NexusBuild offers full-scale interior remodeling, architectural consulting, and on-site scheduling for home and business owners.
                        </p>

                        <div className="flex flex-col gap-4 py-2">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#a14000] flex items-center justify-center flex-shrink-0 rounded-[4px]">
                                    <Wrench size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[16px] font-bold text-white">Full-Scope Remodeling</h4>
                                    <p className="text-[14px] text-[#768dad]">Custom interior design, structural renovations, and modern fittings.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#a14000] flex items-center justify-center flex-shrink-0 rounded-[4px]">
                                    <CheckCircle2 size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[16px] font-bold text-white">Consultation &amp; Site Visits</h4>
                                    <p className="text-[14px] text-[#768dad]">Scheduled on-site inspections guided by senior structural engineers.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#fe762a] hover:bg-[#a14000] text-[#5e2200] hover:text-white text-[14px] font-bold transition-colors duration-200 min-h-[50px] rounded-[4px]"
                            >
                                Inquire for Service
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="flex-1 max-w-[540px] w-full">
                        <div className="w-full aspect-[4/3] rounded-[8px] overflow-hidden border border-white/10 shadow-2xl">
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
             * 5. CLIENT CAPABILITIES & DIGITAL TOOLKIT
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

                    <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                        <span className="text-[12px] font-semibold text-[#a14000] uppercase tracking-wider">
                            Digital Platform
                        </span>
                        <h2 className="text-[28px] lg:text-[34px] font-bold text-[#000f22] leading-tight">
                            Empowering Property Owners
                        </h2>
                        <p className="text-[16px] text-[#43474d] leading-relaxed">
                            We equip clients with real-time construction progress tracking, transparent financial ledgers, and 24/7 support portals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="bg-[#f8f9fa] border border-[#c4c6ce] p-8 rounded-[8px] flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-[6px] bg-[#fe762a]/10 text-[#a14000] flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-[20px] font-bold text-[#000f22]">Project Timeline Tracking</h3>
                            <p className="text-[14px] text-[#43474d] leading-relaxed">
                                Follow construction milestones and structural handovers with automated notifications.
                            </p>
                            <div className="mt-2 pt-4 border-t border-[#c4c6ce]">
                                <div className="flex justify-between text-[12px] font-bold text-[#74777e] mb-1">
                                    <span>Milestone: Structural Framework</span>
                                    <span className="text-[#a14000]">72%</span>
                                </div>
                                <div className="w-full bg-[#e1e3e4] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#fe762a] h-full w-[72%]" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#f8f9fa] border border-[#c4c6ce] p-8 rounded-[8px] flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-[6px] bg-[#000f22]/10 text-[#000f22] flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-[20px] font-bold text-[#000f22]">Financial Reporting</h3>
                            <p className="text-[14px] text-[#43474d] leading-relaxed">
                                Access payment schedules, digitized invoices, and complete financial ledger transparency.
                            </p>
                            <Link
                                to="/login"
                                className="mt-auto text-[14px] font-bold text-[#000f22] hover:text-[#a14000] flex items-center gap-1.5 pt-4"
                            >
                                Client Portal Login →
                            </Link>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#f8f9fa] border border-[#c4c6ce] p-8 rounded-[8px] flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-[6px] bg-[#a14000]/10 text-[#a14000] flex items-center justify-center">
                                <LifeBuoy size={24} />
                            </div>
                            <h3 className="text-[20px] font-bold text-[#000f22]">24/7 Client Care</h3>
                            <p className="text-[14px] text-[#43474d] leading-relaxed">
                                Dedicated support desk for resident inquiries, site visits, and property management needs.
                            </p>
                            <Link
                                to="/contact"
                                className="mt-auto text-[14px] font-bold text-[#a14000] hover:text-[#5e2200] flex items-center gap-1.5 pt-4"
                            >
                                Contact Support →
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 6. DECADES OF TRUST SECTION
             * ══════════════════════════════════════════════════════════════ */}
            {/* <section className="bg-[#f8f9fa] border-t border-[#c4c6ce]/50 py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 items-center">

                    
                    <div className="flex-1 flex flex-col gap-6 max-w-[552px]">
                        <span className="text-[12px] font-semibold text-[#a14000] uppercase tracking-wider">
                            Our Heritage
                        </span>
                        <h2 className="text-[28px] lg:text-[32px] font-bold text-[#000f22] leading-tight">
                            Decades of Trust in Narayanganj.
                        </h2>
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#43474d] leading-relaxed">
                            Since our founding at Shamabay New Market, Reliance Housing Ltd. has stood as a symbol of structural reliability and community growth.
                        </p>
                        <p className="text-[16px] font-normal text-[#43474d] leading-relaxed">
                            From high-rise residential towers on BB Road to commercial hubs, our pledge remains steadfast: uncompromising engineering quality, regulatory compliance, and total client transparency.
                        </p>

                        <div className="flex items-start gap-8 pt-4 border-t border-[#c4c6ce]">
                            {[
                                { value: "12+", label: "Years Active" },
                                { value: "150+", label: "Projects Built" },
                                { value: "12k+", label: "Families Housed" },
                            ].map(({ value, label }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <span className="text-[32px] font-bold text-[#000f22] leading-none">{value}</span>
                                    <span className="text-[12px] font-medium text-[#43474d] uppercase tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                    <div className="flex-1 relative max-w-[552px] w-full">
                        <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-[#a14000] rounded-[12px] z-0" />
                        <div className="relative z-10 w-full aspect-[4/3] overflow-hidden border-[8px] border-white shadow-[0px_20px_25px_#0000001a] rounded-[4px]">
                            <img
                                src={IMG_ABOUT}
                                alt="Decades of Trust in Narayanganj"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
            </section> */}

        </div>
    );
};

export default Home;