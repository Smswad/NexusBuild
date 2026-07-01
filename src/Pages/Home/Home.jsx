import { useState } from "react";
import { Link } from "react-router";
import { 
    MapPin, Home as HomeIcon, Activity, Search, ArrowRight, CheckCircle2, 
    TrendingUp, FileText, Globe, LifeBuoy 
} from "lucide-react";

// Asset imports
import hero_pic from "../../assets/pics/hero_pic.png";
import services_pic from "../../assets/pics/services_pic.png";
import trust_pic from "../../assets/pics/trust_pic.png";
import map_mockup from "../../assets/pics/map_mockup.png";

const Home = () => {
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("Chashiara");
    const [searchLocation, setSearchLocation] = useState("Narayanganj City");
    const [searchType, setSearchType] = useState("Real Estate");
    const [searchStatus, setSearchStatus] = useState("Active Portfolio");

    const neighborhoods = [
        { name: "Chashiara", stats: "45 Projects • 12 Active", desc: "The commercial heart of Narayanganj with premium retail and high-rise apartments." },
        { name: "Deobhog", stats: "28 Projects • 8 Active", desc: "A rapidly growing residential area with modern schools, parks, and family-friendly complexes." },
        { name: "Masdair", stats: "19 Projects • 5 Active", desc: "Peaceful residential neighborhood known for its green spaces and premium housing developments." },
        { name: "Heritage Plaza", stats: "8 Projects • 3 Active", desc: "High-end luxury shopping and residential zone offering elite architectural designs." }
    ];

    const developments = [
        {
            title: "Reliance Zenith Towers",
            tag: "APARTMENT",
            image: hero_pic,
            desc: "A premium residential project featuring state-of-the-art amenities and prime location in Narayanganj.",
            tagBg: "bg-orange-500 text-white"
        },
        {
            title: "Nexus Business Hub",
            tag: "COMMERCIAL",
            image: services_pic,
            desc: "Modern commercial spaces designed for high productivity, corporate branding, and business success.",
            tagBg: "bg-[#0c326f] text-white"
        },
        {
            title: "The Heritage Plaza",
            tag: "RESIDENTIAL",
            image: trust_pic,
            desc: "Elegant homes designed with structural integrity, offering comfortable and premium family living.",
            tagBg: "bg-rose-500 text-white"
        }
    ];

    return (
        <div className="bg-slate-50 font-sans min-h-screen">
            
            {/* 1. Hero Section */}
            <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
                <img 
                    src={hero_pic} 
                    alt="Modern Real Estate Background" 
                    className="absolute inset-0 w-full h-full object-cover select-none"
                />
                {/* Dark masking overlay */}
                <div className="absolute inset-0 bg-[#000f22]/55"></div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-6">
                    <span className="inline-block bg-[#ea580c] text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest">
                        Reliance Housing Ltd.
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
                        Modern Real Estate & Infrastructure Management.
                    </h1>
                    <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
                        Access the industry's most advanced property management ecosystem. Securely manage assets, track financials, and explore new development opportunities with NexusBuild.
                    </p>

                    {/* Filter Pill Bar */}
                    <div className="max-w-4xl mx-auto bg-white p-3 rounded-xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center justify-between border border-slate-100/50 gap-4 mt-8">
                        <div className="flex flex-wrap items-center justify-center gap-6 px-4 text-left w-full sm:w-auto">
                            
                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-orange-50 rounded-full text-orange-500">
                                    <MapPin size={16} />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                                    <select 
                                        value={searchLocation} 
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        className="text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                                    >
                                        <option value="Narayanganj City">Narayanganj City</option>
                                        <option value="Dhaka Center">Dhaka Center</option>
                                    </select>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] h-8 bg-slate-100"></div>

                            {/* Property Type */}
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-blue-50 rounded-full text-blue-500">
                                    <HomeIcon size={16} />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                                    <select 
                                        value={searchType} 
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                                    >
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Commercial Land">Commercial Land</option>
                                        <option value="Apartments">Apartments</option>
                                    </select>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] h-8 bg-slate-100"></div>

                            {/* Portfolio Status */}
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-emerald-50 rounded-full text-emerald-500">
                                    <Activity size={16} />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                    <select 
                                        value={searchStatus} 
                                        onChange={(e) => setSearchStatus(e.target.value)}
                                        className="text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                                    >
                                        <option value="Active Portfolio">Active Portfolio</option>
                                        <option value="Pending Build">Pending Build</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* Search CTA */}
                        <button className="w-full sm:w-auto bg-[#0c326f] hover:bg-[#082554] text-white px-6 py-3 rounded-lg sm:rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap">
                            Search Properties <ArrowRight size={14} />
                        </button>
                    </div>

                </div>
            </section>

            {/* 2. Signature Developments Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0c326f] tracking-tight">Signature Developments</h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                            Explore our collection of hand-picked premium residential and commercial spaces constructed with structural integrity and excellence.
                        </p>
                    </div>
                    <Link to="/projects" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                        View All Projects <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {developments.map((dev, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                            <div className="relative h-48">
                                <img src={dev.image} alt={dev.title} className="w-full h-full object-cover" />
                                <span className={`absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1.5 rounded uppercase tracking-wider ${dev.tagBg}`}>
                                    {dev.tag}
                                </span>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-slate-800">{dev.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{dev.desc}</p>
                                </div>
                                <button className="w-full border border-slate-200 hover:border-[#0c326f] hover:text-[#0c326f] text-slate-600 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer">
                                    Project Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Explore Neighborhoods Section */}
            <section className="bg-[#f8fafc] border-y border-slate-100 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-10 text-left">
                        <h2 className="text-2xl font-bold text-[#0c326f] tracking-tight">Explore Neighborhoods</h2>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Discover active properties and ongoing constructions categorized by prime locations in Narayanganj.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                        
                        {/* List Column */}
                        <div className="md:col-span-4 flex flex-col gap-3 justify-center">
                            {neighborhoods.map((nb, idx) => {
                                const isActive = selectedNeighborhood === nb.name;
                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedNeighborhood(nb.name)}
                                        className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                                            isActive 
                                                ? "bg-white border-orange-500 shadow-md translate-x-1" 
                                                : "bg-white/40 border-slate-200 hover:border-slate-300 hover:bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isActive && <div className="w-1 h-4 bg-orange-500 rounded"></div>}
                                            <h4 className="text-xs font-bold text-slate-800">{nb.name}</h4>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{nb.stats}</p>
                                        {isActive && (
                                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                                                {nb.desc}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Map Column */}
                        <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-white p-2 min-h-[350px]">
                            <img src={map_mockup} alt="Narayanganj Neighborhood Map" className="w-full h-full object-cover rounded-xl" />
                            {/* Overlay details */}
                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow border border-slate-100 space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Sector</p>
                                <p className="text-xs font-bold text-[#0c326f]">{selectedNeighborhood} Region</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. Professional Services & Remodeling Section (Dark Navy Block) */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-[#000f22] rounded-3xl overflow-hidden text-white flex flex-col md:flex-row items-stretch">
                    
                    {/* Left text column */}
                    <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold tracking-tight">Professional Services & Remodeling</h2>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Beyond building housing projects, we provide complete, professional consulting, architectural design, construction operations, and remodeling services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Service 1 */}
                            <div className="flex gap-3">
                                <span className="text-orange-500 mt-0.5">
                                    <CheckCircle2 size={18} />
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Interior Design</h4>
                                    <p className="text-[11px] text-white/60 mt-0.5">Transforming residential and office layouts with premium planning templates.</p>
                                </div>
                            </div>
                            
                            {/* Service 2 */}
                            <div className="flex gap-3">
                                <span className="text-orange-500 mt-0.5">
                                    <CheckCircle2 size={18} />
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Construction Operations</h4>
                                    <p className="text-[11px] text-white/60 mt-0.5">High-quality structural construction supervised by senior engineers.</p>
                                </div>
                            </div>
                        </div>

                        <button className="inline-block bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition-colors cursor-pointer w-fit uppercase tracking-wider">
                            Request Service
                        </button>
                    </div>

                    {/* Right image column */}
                    <div className="w-full md:w-1/2 relative min-h-[300px]">
                        <img 
                            src={services_pic} 
                            alt="Engineers reviewing prints" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#000f22] via-transparent to-transparent hidden md:block"></div>
                    </div>

                </div>
            </section>

            {/* 5. Empowering Our Clients Section */}
            <section className="bg-slate-50 py-16 md:py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    
                    <div className="max-w-xl mx-auto mb-16 space-y-2">
                        <h2 className="text-2xl font-bold text-[#0c326f] tracking-tight">Empowering Our Clients</h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            We equip you with advanced property management capabilities, financial reporting systems, and mapping visualizers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch text-left">
                        
                        {/* Timeline Tracking Card */}
                        <div className="md:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-8">
                            <div className="space-y-3">
                                <span className="p-3 bg-orange-50 text-orange-500 rounded-xl inline-block">
                                    <TrendingUp size={20} />
                                </span>
                                <h3 className="text-sm font-bold text-slate-800">Project Timeline Tracking</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Follow construction milestones and property transfer schedules transparently. Get automated notifications at each construction milestone.
                                </p>
                            </div>
                            {/* Simulated tracker bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>Milestone 3: Structural Framework</span>
                                    <span>72% Completed</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full w-[72%] transition-all"></div>
                                </div>
                            </div>
                        </div>

                        {/* Side column items */}
                        <div className="md:col-span-5 grid grid-rows-2 gap-8">
                            
                            {/* Financial Stats */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                                <span className="p-3 bg-blue-50 text-blue-500 rounded-xl flex-shrink-0">
                                    <FileText size={18} />
                                </span>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-800">Financial Reports & Statistics</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">Track invoices, ledger statements, and payments safely in your client dashboard portal.</p>
                                </div>
                            </div>

                            {/* GIS Maps & Support combo layout */}
                            <div className="grid grid-cols-2 gap-8">
                                
                                {/* GIS Map Card */}
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                                    <span className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit">
                                        <Globe size={16} />
                                    </span>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-800 mt-3">GIS-Mapped View</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Verify site plots and boundaries in 3D GIS.</p>
                                    </div>
                                </div>

                                {/* Support Card */}
                                <div className="bg-[#000f22] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
                                    <span className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-fit">
                                        <LifeBuoy size={16} />
                                    </span>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-white mt-3">24/7 Client Care</h4>
                                        <p className="text-[10px] text-white/60 mt-1 leading-relaxed">Dedicated support line for asset issues.</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* 6. Decades of Trust Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    
                    {/* Left text details */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-[#0c326f] tracking-tight">Decades of Trust in Narayanganj</h2>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Since our initial housing operations, Reliance Housing has maintained a reputable presence in Narayanganj. We have built reliable housing communities that offer safety, premium amenities, and architectural excellence.
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Our projects strictly follow local construction regulations and integrate eco-friendly building protocols. With more than two decades in operation, we are your trusted partner in infrastructure developments.
                            </p>
                        </div>

                        {/* Stats block */}
                        <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <h3 className="text-2xl font-extrabold text-orange-500 tracking-tight">20+</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Years of Trust</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-orange-500 tracking-tight">150+</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Projects Built</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-orange-500 tracking-tight">12k</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Happy Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right image section */}
                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2">
                        <img src={trust_pic} alt="Reliance Housing Vintage Project Mockup" className="w-full h-auto rounded-xl" />
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Home;