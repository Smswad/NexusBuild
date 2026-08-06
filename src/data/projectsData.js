// ─── Centralized Projects Dataset ──────────────────────────────────────────────
// Shared project data for Projects catalog, ProjectDetails, and GIS Map views
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
    {
        id: "1",
        slug: "reliance-zenith-towers",
        name: "Reliance Zenith Towers",
        status: "AVAILABLE",
        statusBg: "#a14000",
        location: "Narayanganj",
        fullAddress: "Plot 14-18, Riverside Avenue, Narayanganj",
        type: "Residential",
        image: "/Frontend/Projects/Reliance_Zenith_Towers.svg",
        gallery: [
            "/Frontend/Projects/Reliance_Zenith_Towers.svg",
            "/Frontend/Projects/Hero_Section.svg",
            "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg"
        ],
        description: "A masterpiece of urban living featuring panoramic river views, sky lounges, and smart-home integration across 32 premium floors.",
        fullDescription: "Reliance Zenith Towers represents the pinnacle of luxury residential architecture in Narayanganj. Rising 32 stories above the waterfront, this landmark development merges precision structural engineering with eco-friendly design. Residents enjoy private elevators, intelligent climate control, high-speed fiber connectivity, and dedicated multi-level subterranean parking. Every residence offers unobstructed panoramic views of the river and surrounding skyline.",
        priceRange: "৳ 1.25 Cr – ৳ 3.50 Cr",
        specs: [
            { label: "Total Floors", value: "32 Floors" },
            { label: "Unit Types", value: "3 & 4 BHK Luxury Apartments" },
            { label: "Land Area", value: "45,000 sq. ft" },
            { label: "Completion Year", value: "2024" },
            { label: "Architect", value: "Nexus Studio & Partners" },
            { label: "Structural Rating", value: "Grade A Seismic Standard" }
        ],
        features: [
            "32 Premium Floors with Panoramic River Views",
            "Smart Home Automation & Keyless Entry",
            "Rooftop Infinity Lounge & Sky Garden",
            "3-Level Underground Automated Parking",
            "Dedicated High-Speed Passenger & Service Lifts",
            "24/7 Multi-Tiered Security & CCTV Surveillance",
            "Backup Power Generator & Solar Integration",
            "Fitness Center & Indoor Swimming Pool"
        ],
        coordinates: { lat: 23.6238, lng: 90.4993 }
    },
    {
        id: "2",
        slug: "nexus-business-hub",
        name: "Nexus Business Hub",
        status: "SOLD OUT",
        statusBg: "#000f22",
        location: "BB Road",
        fullAddress: "259 B B Road, Commercial District, Narayanganj",
        type: "Commercial",
        image: "/Frontend/Projects/Nexus_Business_Hub.svg",
        gallery: [
            "/Frontend/Projects/Nexus_Business_Hub.svg",
            "/Frontend/Projects/Hero_Section.svg",
            "/Frontend/Projects/Professional_Services_Remodeling.svg"
        ],
        description: "Premium commercial units designed for headquarters, featuring column-free open floors, fibre-optic connectivity, and a rooftop conference suite.",
        fullDescription: "Nexus Business Hub is Narayanganj's flagship commercial headquarters tower. Engineered specifically for corporate offices, financial institutions, and tech enterprises, the building features column-free floor plates that allow maximum flexibility for custom office layouts. Complete with central VRF air-conditioning, triple-redundant power backup, and executive conference suites.",
        priceRange: "৳ 2.80 Cr – ৳ 6.00 Cr",
        specs: [
            { label: "Total Floors", value: "24 Floors" },
            { label: "Unit Types", value: "Corporate Office Suites" },
            { label: "Land Area", value: "38,000 sq. ft" },
            { label: "Completion Year", value: "2023" },
            { label: "Architect", value: "Urban Grid Design Group" },
            { label: "Structural Rating", value: "Commercial Grade AAA" }
        ],
        features: [
            "Column-Free Open Floor Plates",
            "High-Speed Fiber-Optic Backbone Infrastructure",
            "Rooftop Executive Conference & Seminar Center",
            "Centralized VRF Climate Control",
            "Double-Height Grand Lobby & Reception",
            "Advanced Access Control & Visitor Management",
            "Dedicated Executive Parking Levels",
            "Integrated Retail & Coffee Lounge"
        ],
        coordinates: { lat: 23.6158, lng: 90.5010 }
    },
    {
        id: "3",
        slug: "the-heritage-plaza",
        name: "The Heritage Plaza",
        status: "READY TO MOVE",
        statusBg: "#0a3d2e",
        location: "Shamabay",
        fullAddress: "Shamabay New Market Corridor, B B Road, Narayanganj",
        type: "Mixed Use",
        image: "/Frontend/Projects/The_Heritage_Plaza.svg",
        gallery: [
            "/Frontend/Projects/The_Heritage_Plaza.svg",
            "/Frontend/Projects/Decades_of_Trust_in_Narayanganj.svg",
            "/Frontend/Projects/Hero_Section.svg"
        ],
        description: "Exquisite residency located in the heart of Narayanganj's commercial district, blending heritage-inspired facades with modern interiors.",
        fullDescription: "The Heritage Plaza seamlessly bridges classic architectural elegance with modern urban convenience. Situated in the vibrant Shamabay market area, the lower levels host premium retail boutiques and dining establishments, while the upper levels feature serene, sound-insulated residential suites. Designed for families and professionals seeking prime connectivity.",
        priceRange: "৳ 95 Lac – ৳ 2.20 Cr",
        specs: [
            { label: "Total Floors", value: "18 Floors" },
            { label: "Unit Types", value: "Retail & Residential Units" },
            { label: "Land Area", value: "32,000 sq. ft" },
            { label: "Completion Year", value: "2023" },
            { label: "Architect", value: "Heritage & Associates" },
            { label: "Structural Rating", value: "Grade A Residential Standard" }
        ],
        features: [
            "Heritage-Inspired Exterior Facade with Modern Interiors",
            "Mixed-Use Integration: Ground Retail + Upper Suites",
            "Sound-Insulated Double Glazed Windows",
            "Underground Secure Resident & Guest Parking",
            "Landscaped Courtyard & Children's Play Area",
            "24/7 Security Patrol & Intercom System",
            "Full Generator Backup for All Essential Services",
            "Walking Distance to Central Transit & Schools"
        ],
        coordinates: { lat: 23.6300, lng: 90.4940 }
    }
];

export const getProjectById = (id) => {
    if (!id) return null;
    const strId = String(id).toLowerCase();
    return PROJECTS.find(p => p.id === strId || p.slug === strId) || null;
};
