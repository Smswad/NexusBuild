import { Link } from "react-router";
import { Search, MapPin, ArrowRight, Wrench, CalendarCheck } from "lucide-react";
import Navbar from "../../Components/Header/Navbar";
import Footer from "../../Components/Footer/Footer";

// ── Public image paths (files in /public/frontend/projects/) ──────────────────
const IMG_HERO = "/Frontend/Projects/Hero_Section.svg";
const IMG_ZENITH = "/Frontend/Projects/Reliance_Zenith_Towers.svg";
const IMG_HUB = "/Frontend/Projects/Nexus_Business_Hub.svg";
const IMG_HERITAGE = "/Frontend/Projects/The_Heritage_Plaza.svg";
const IMG_SERVICES = "/Frontend/Projects/Professional_Services_Remodeling.svg";
const IMG_ABOUT = "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg";

// ─── Projects ─────────────────────────────────────────────────────────────────
// Figma frame: 1310×3783, node-id=1:753
// Sections:
//   1. Hero Section (1310×870): dark overlay, search/filter bar
//   2. All Projects Section (1280×898): 3-card grid
//   3. GIS Map Module (placeholder)
//   4. Services & Remodeling Section (#000f22)
//   5. About Us Section
// ─────────────────────────────────────────────────────────────────────────────

// ── Figma project card data ────────────────────────────────────────────────
const PROJECTS = [
    {
        id: 1,
        name: "Reliance Zenith Towers",
        status: "AVAILABLE",
        statusBg: "#a14000",
        location: "Narayanganj",
        type: "Residential",
        image: IMG_ZENITH,
        description: "A masterpiece of urban living featuring panoramic river views, sky lounges, and smart-home integration across 32 premium floors.",
    },
    {
        id: 2,
        name: "Nexus Business Hub",
        status: "SOLD OUT",
        statusBg: "#000f22",
        location: "BB Road",
        type: "Commercial",
        image: IMG_HUB,
        description: "Premium commercial units designed for headquarters, featuring column-free open floors, fibre-optic connectivity, and a rooftop conference suite.",
    },
    {
        id: 3,
        name: "The Heritage Plaza",
        status: "READY TO MOVE",
        statusBg: "#a14000",
        location: "Shamabay",
        type: "Mixed Use",
        image: IMG_HERITAGE,
        description: "Exquisite residency located in the heart of Narayanganj's commercial district, blending heritage-inspired facades with modern interiors.",
    },
];

const Projects = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">

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

                        {/* Figma: red pill — #a14000 fill, 12px fw=500 white, r implicit */}
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

                        {/* Figma: Integrated Search/Filter — white bg r=8, shadow
                         *   3 VerticalBorder cells (location, type, status) + Search button #000f22
                         */}
                        <div className="mt-4 bg-white rounded-[8px] shadow-[0px_25px_50px_#00000040] flex flex-col sm:flex-row overflow-hidden">

                            {/* Filter cell 1: Location */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <MapPin size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Location</span>
                                    <select className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer">
                                        <option value="">All Areas</option>
                                        <option>Narayanganj</option>
                                        <option>BB Road</option>
                                        <option>Shamabay</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter cell 2: Type */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <Wrench size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Type</span>
                                    <select className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer">
                                        <option value="">All Types</option>
                                        <option>Residential</option>
                                        <option>Commercial</option>
                                        <option>Mixed Use</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter cell 3: Status */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#c4c6ce]">
                                <CalendarCheck size={16} className="text-[#74777e] flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Status</span>
                                    <select className="text-[14px] font-medium text-[#191c1d] bg-transparent focus:outline-none cursor-pointer">
                                        <option value="">Any Status</option>
                                        <option>Available</option>
                                        <option>Sold Out</option>
                                        <option>Ready to Move</option>
                                    </select>
                                </div>
                            </div>

                            {/* Figma: Search button — #000f22 fill, white text, 14px fw=700 */}
                            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-[#000f22] hover:bg-[#0a2540] text-white text-[14px] font-bold transition-colors duration-200 cursor-pointer min-h-[44px] flex-shrink-0">
                                <Search size={16} />
                                <span>Search<br className="hidden lg:block" /> Projects</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 2. ALL PROJECTS SECTION
             * Figma: 1280×898, vertical, 48px gap, 96px V / 48px H padding
             *   Header: "Signature Developments" 32px fw=600 #000f22
             *            + "View All Projects" link #a14000 14px fw=700
             *   Card grid: 3 × 379px cards, #ffffff bg, stroke #c4c6ce
             *     Card: image (256px tall) + status pill + card body
             *     Body: title 24px fw=600 #000f22, meta row, desc 16px #43474d
             *           "Project Details" outline btn #000f22 + "View Map" btn #c4c6ce
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

                    {/* Section header */}
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
                        {/* Figma: "View All Projects" — 14px fw=700 #a14000 with arrow icon */}
                        <a href="#" className="flex items-center gap-2 text-[14px] font-bold text-[#a14000] hover:text-[#5e2200] transition-colors flex-shrink-0">
                            View All Projects
                            <ArrowRight size={14} />
                        </a>
                    </div>

                    {/* Project cards grid — Figma: 3 cards, 24px gap, each 379px wide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PROJECTS.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border border-[#c4c6ce] flex flex-col"
                            >
                                {/* Card image area — Figma: 256px tall, with status pill overlay */}
                                <div className="relative h-[200px] lg:h-[256px] overflow-hidden flex-shrink-0">
                                    {/* Real project image */}
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Figma: status pill — bg varies per card, 12px fw=700 white, 4px V / 12px H pad */}
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="text-[12px] font-bold text-white px-3 py-1 uppercase tracking-wider"
                                            style={{ backgroundColor: project.statusBg }}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body — Figma: 300px tall, inner container 329px, padding 24px */}
                                <div className="flex flex-col flex-1 p-6 gap-3">
                                    {/* Figma: Heading 3 — 24px fw=600 #000f22 */}
                                    <h3 className="text-[24px] font-semibold text-[#000f22] leading-tight">
                                        {project.name}
                                    </h3>

                                    {/* Meta row — location + type, 16px gap */}
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

                                    {/* Figma: description — 16px fw=400 #43474d, 8px top / 16px bottom pad */}
                                    <p className="text-[16px] font-normal text-[#43474d] leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    {/* Figma: "Project Details" btn — stroke #000f22, 46px tall, 12px V pad */}
                                    <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#000f22] text-[#000f22] text-[14px] font-bold hover:bg-[#000f22] hover:text-white transition-colors duration-200 cursor-pointer min-h-[44px]">
                                        Project Details
                                    </button>

                                    {/* Figma: "View Map" btn — stroke #c4c6ce, 42px tall */}
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#c4c6ce] text-[#43474d] text-[14px] font-bold hover:border-[#0a2540] hover:text-[#0a2540] transition-colors duration-200 cursor-pointer min-h-[44px]">
                                        <MapPin size={14} />
                                        View Map
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 3. GIS MAP MODULE
             * Figma: 'Section - GIS Map Module' 1310×160 fill=#edeeef
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#edeeef] h-[120px] lg:h-[160px] flex items-center justify-center px-6">
                <p className="text-[14px] font-semibold text-[#74777e] uppercase tracking-widest">
                    GIS Map Integration — Interactive Map Coming Soon
                </p>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * 4. SERVICES & REMODELING SECTION
             * Figma: 1184×648, bg #000f22, HORIZONTAL, 48px gap, 80px all-around padding
             *   Left (488px): heading 32px fw=600 white
             *                 body 18px fw=400 #768dad (primary-muted token)
             *                 2 service items (icon #a14000 bg + title/desc)
             *                 "Inquire for Service" btn — #fe762a, #5e2200 text, 52px tall
             *   Right (488px, r=4): placeholder image
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-[#000f22] py-16 lg:py-20 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-12">

                    {/* Left column */}
                    <div className="flex-1 flex flex-col gap-4 max-w-[488px]">
                        {/* Figma: 32px fw=600 white */}
                        <h2 className="text-[28px] lg:text-[32px] font-semibold text-white leading-tight">
                            Professional Services &amp; Remodeling
                        </h2>
                        {/* Figma: 18px fw=400 #768dad */}
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#768dad] leading-relaxed">
                            Beyond construction, we offer comprehensive project operations, remodeling, and site visit scheduling for existing and new property owners.
                        </p>

                        {/* Service items — Figma: icon in #a14000 bg square (36×39), title + desc */}
                        <div className="flex flex-col sm:flex-row gap-6 py-4">
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 bg-[#a14000] flex items-center justify-center flex-shrink-0">
                                    <Wrench size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[14px] font-bold text-white">Remodeling</h4>
                                    <p className="text-[12px] text-[#768dad] leading-snug">Full-scope interior & structural renovation services.</p>
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

                        {/* Figma: "Inquire for Service" — #fe762a fill, #5e2200 text, 14px fw=700, 52px tall, 32px H pad */}
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
             * Figma: 1280×608, 96px V / 48px H pad, HORIZONTAL with 80px gap
             *   Left (552px): heading 32px fw=600 #000f22
             *                 body 18px fw=400 #43474d
             *                 secondary 16px fw=400 #43474d
             *                 stats row: 3 stats (32px bold #000f22 + 12px label #43474d)
             *   Right (552px): image with #a14000 decorative square (r=12)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Left */}
                    <div className="flex-1 flex flex-col gap-6 max-w-[552px]">
                        {/* Figma: 32px fw=600 #000f22 */}
                        <h2 className="text-[28px] lg:text-[32px] font-semibold text-[#000f22] leading-tight">
                            Decades of Trust in Narayanganj.
                        </h2>
                        {/* Figma: 18px fw=400 #43474d */}
                        <p className="text-[16px] lg:text-[18px] font-normal text-[#43474d] leading-relaxed">
                            Since our founding at Shamabay New Market, Reliance Housing Ltd. has been synonymous with stability and innovation in the local infrastructure landscape.
                        </p>
                        {/* Figma: 16px fw=400 #43474d */}
                        <p className="text-[16px] font-normal text-[#43474d] leading-relaxed">
                            We don't just build apartments; we architect communities. From the bustling corridors of BB Road to the quiet luxury of riverfront estates, our commitment remains the same: uncompromising quality and absolute transparency.
                        </p>

                        {/* Stats row — Figma: 552×72 HORIZONTAL 32px gap, 24px top pad */}
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

                    {/* Right — about image with decorative #a14000 block */}
                    <div className="flex-1 relative max-w-[552px] w-full">
                        {/* Figma: #a14000 rect behind image, r=12 */}
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

            {/* Floating Action Button — Figma: 'Button - FAB' 56×56 #a14000 r=12 with "Help Desk" tooltip */}
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
                {/* Figma: "Help Desk" tooltip — #000f22 bg, r=2, 12px fw=500 white */}
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