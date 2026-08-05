import { Link } from 'react-router';
import { Home, Compass, Construction } from 'lucide-react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

// ─── Error Page (404) ─────────────────────────────────────────────────────────
// Figma frame: node-id=27:2 (1280px desktop reference)
// Aesthetics: Blueprint OS design system (#000f22 Cast Iron, #fe762a Amber, #f8f9fa paper)
// ─────────────────────────────────────────────────────────────────────────────

const Error = () => {
    return (
        <div className="flex flex-col min-h-screen font-[Inter,sans-serif] bg-[#f8f9fa]">
            {/* <Navbar /> */}

            {/* Main Error Content Area */}
            <main className="flex-grow flex items-center justify-center relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-8">
                {/* Blueprint grid background effect */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                        backgroundImage: [
                            'linear-gradient(rgba(0, 15, 34, 0.04) 1px, transparent 1px)',
                            'linear-gradient(90deg, rgba(0, 15, 34, 0.04) 1px, transparent 1px)',
                        ].join(','),
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Subtle blueprint accent watermark in background */}
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#fe762a]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#000f22]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-[1280px] w-full mx-auto flex flex-col items-center text-center z-10">
                    <div className="max-w-[540px] w-full flex flex-col items-center">
                        
                        {/* Eyebrow Pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fe762a]/10 border border-[#fe762a]/30 rounded-full mb-6">
                            <Construction size={14} className="text-[#a14000]" />
                            <span className="text-[12px] font-semibold text-[#a14000] uppercase tracking-[0.12em]">
                                Site Blueprint Notice
                            </span>
                        </div>

                        {/* Figma: "404" large text */}
                        <h1 className="text-[80px] sm:text-[100px] lg:text-[120px] font-extrabold text-[#000f22] leading-none tracking-tight select-none mb-2 drop-shadow-sm">
                            404
                        </h1>

                        {/* Accent divider line */}
                        <div className="w-16 h-[3px] bg-[#fe762a] rounded-full mb-6" />

                        {/* Figma: "Lost in the Blueprint?" Heading 1 */}
                        <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold text-[#000f22] leading-tight tracking-tight mb-4">
                            Lost in the Blueprint?
                        </h2>

                        {/* Figma: Subtitle text */}
                        <p className="text-[15px] sm:text-[16px] lg:text-[18px] font-normal text-[#43474d] leading-relaxed mb-8 max-w-[512px]">
                            The page you are looking for might have been moved, renamed or is unavailable. Let us help you find your way back to our signature developments.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            {/* Figma: Primary Button "Return to Homepage" */}
                            <Link
                                to="/"
                                className="
                                    w-full sm:w-auto
                                    inline-flex items-center justify-center gap-2.5
                                    bg-[#000f22] hover:bg-[#0a2540]
                                    text-white text-[14px] sm:text-[15px] font-semibold
                                    px-7 py-4 rounded-[4px] min-h-[48px]
                                    shadow-md hover:shadow-lg
                                    transition-all duration-200
                                    cursor-pointer
                                "
                            >
                                <Home size={18} />
                                Return to Homepage
                            </Link>

                            {/* Secondary Link: GIS Map */}
                            {/* <Link
                                to="/gismap"
                                className="
                                    w-full sm:w-auto
                                    inline-flex items-center justify-center gap-2.5
                                    bg-white hover:bg-[#f3f4f5]
                                    border border-[#c4c6ce] hover:border-[#000f22]/40
                                    text-[#000f22] text-[14px] sm:text-[15px] font-semibold
                                    px-7 py-4 rounded-[4px] min-h-[48px]
                                    transition-all duration-200
                                    cursor-pointer
                                "
                            >
                                <Compass size={18} className="text-[#a14000]" />
                                Explore GIS Map
                            </Link> */}
                        </div>

                    </div>
                </div>
            </main>

            {/* <Footer /> */}
        </div>
    );
};

export default Error;