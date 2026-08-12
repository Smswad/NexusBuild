// ─── Centralized Projects Dataset ──────────────────────────────────────────────
// Shared project data for Projects catalog, ProjectDetails, and GIS Map views
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
    {
        id: "p1",
        slug: "sardar-tower-block-a",
        name: "Sardar Tower – Block A",
        status: "AVAILABLE",
        statusBg: "#a14000",
        location: "Narayanganj",
        fullAddress: "Plot 12-15, Sardar Tower Corridor, Narayanganj",
        type: "Mixed Use",
        image: "/Frontend/Projects/Reliance_Zenith_Towers.svg",
        gallery: [
            "/Frontend/Projects/Reliance_Zenith_Towers.svg",
            "/Frontend/Projects/Hero_Section.svg",
            "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg"
        ],
        description: "A flagship mixed-use high-rise featuring luxury apartments, modern commercial office suites, and state-of-the-art structural foundation.",
        fullDescription: "Sardar Tower – Block A represents the premier flagship development of Nexus Build in Narayanganj. Designed for both residential luxury and high-demand commercial utility, this multi-story complex combines seismic-rated piling with modern architectural finishes.",
        priceRange: "৳ 1.50 Cr – ৳ 3.80 Cr",
        totalUnits: 32,
        specs: [
            { label: "Total Floors", value: "28 Floors" },
            { label: "Unit Types", value: "3 & 4 BHK Apartments + Commercial" },
            { label: "Land Area", value: "42,000 sq. ft" },
            { label: "Completion Year", value: "2025" },
            { label: "Architect", value: "Nexus Architectural Studio" },
            { label: "Structural Rating", value: "Grade A Seismic Standard" }
        ],
        features: [
            "28 Premium Floors with City Skyline Views",
            "Smart Access Control & 24/7 CCTV Surveillance",
            "Multi-Level Underground Secure Parking",
            "Full Backup Generator & Water Treatment",
            "High-Speed Passenger & Service Lifts"
        ],
        coordinates: { lat: 23.6238, lng: 90.4993 }
    },
    {
        id: "p2",
        slug: "green-valley-residency",
        name: "Green Valley Residency",
        status: "READY TO MOVE",
        statusBg: "#0a3d2e",
        location: "BB Road, Narayanganj",
        fullAddress: "Green Valley Lane, Off BB Road, Narayanganj",
        type: "Residential",
        image: "/Frontend/Projects/The_Heritage_Plaza.svg",
        gallery: [
            "/Frontend/Projects/The_Heritage_Plaza.svg",
            "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg",
            "/Frontend/Projects/Hero_Section.svg"
        ],
        description: "Eco-friendly luxury residential gated community featuring lush green balconies, solar power integration, and riverfront peaceful surroundings.",
        fullDescription: "Green Valley Residency is Narayanganj's premier eco-inspired luxury residential sanctuary. Nestled in a quiet green corridor near BB Road, it provides serene environment with rooftop gardens, children's play areas, and energy-efficient building systems.",
        priceRange: "৳ 1.10 Cr – ৳ 2.60 Cr",
        totalUnits: 24,
        specs: [
            { label: "Total Floors", value: "16 Floors" },
            { label: "Unit Types", value: "2, 3 & 4 BHK Eco Apartments" },
            { label: "Land Area", value: "36,000 sq. ft" },
            { label: "Completion Year", value: "2024" },
            { label: "Architect", value: "Green Grid Design Partners" },
            { label: "Structural Rating", value: "Eco Grade A Standard" }
        ],
        features: [
            "Eco-Friendly Green Balconies & Rooftop Solar",
            "Gated Community with 24/7 Security Patrol",
            "Sound-Insulated Double Glazed Windows",
            "Landscaped Courtyard & Children's Play Zone",
            "Full Generator Backup for All Essential Units"
        ],
        coordinates: { lat: 23.6158, lng: 90.5010 }
    }
];

export const getProjectById = (id) => {
    if (!id) return null;
    const strId = String(id).toLowerCase();
    return PROJECTS.find(p => String(p.id).toLowerCase() === strId || (p.slug && p.slug.toLowerCase() === strId)) || null;
};
