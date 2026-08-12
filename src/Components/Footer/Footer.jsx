import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

// ─── Footer ───────────────────────────────────────────────────────────────────
// Figma spec (consistent across all frames):
//   bg: #000f22, border-top: #0a2540 1px
//   4-column grid (48px padding all sides)
//   Col 1: NexusBuild 24px fw=700 white + tagline 12px fw=500 white + social circles (r=12 stroke white)
//   Col 2: (Figma doesn't show quick links — kept for usability)
//   Col 3: "Contact Us" 16px fw=700 #ffb694 + address/phone/email items 12px fw=500 white
//   Col 4: "Newsletter" 16px fw=700 #ffb694 + input (white bg, r=2, white stroke) + Subscribe btn (#a14000)
//   Bottom bar: #ffffff border-top, 24px V pad, 12px fw=500 white
//     Left: "© 2026 Reliance Housing Ltd. All rights reserved."
//     Right: Security | Sitemap | Cookie Policy
// ─────────────────────────────────────────────────────────────────────────────

import { useDatabase } from "../../Context/DatabaseContext";

const Footer = () => {
    const [email, setEmail] = useState("");
    const { systemSettings } = useDatabase();

    const currentSettings = systemSettings || {
        companyName: 'Reliance Housing Ltd.',
        headOfficeAddress: 'Shamabay New Market, 259 B B Road, Narayanganj',
        supportEmail: 'info@reliancehousing.com',
        supportPhone: '+880 1234 567890'
    };

    return (
        <footer className="bg-[#000f22] text-white border-t border-[#0a2540]">

            {/* ── Main Grid — Figma: 4 columns, 48px all-around padding ── */}
            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Column 1: Brand */}
                <div className="flex flex-col gap-6">
                    {/* Figma: "NexusBuild" 24px fw=700 white */}
                    <h3 className="text-[24px] font-bold text-white tracking-tight">NexusBuild</h3>
                    {/* Figma: 12px fw=500 white */}
                    <p className="text-[12px] font-medium text-white leading-relaxed">
                        Building the future of Bangladesh with transparency, integrity, and innovative GIS technology.
                    </p>
                    {/* Figma: social circles — 40×40, r=12, stroke white 1px */}
                    <div className="flex items-center gap-4">
                        {/* Facebook */}
                        <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-[12px] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#000f22] transition-colors duration-200">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        {/* Twitter / X */}
                        <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-[12px] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#000f22] transition-colors duration-200">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-[12px] border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#000f22] transition-colors duration-200">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links (navigation convenience, not in Figma but kept for UX) */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[16px] font-bold text-[#ffb694] tracking-tight">Quick Links</h4>
                    <ul className="flex flex-col gap-3">
                        {[
                            { to: "/projects", label: "Projects"       },
                            { to: "/gismap",   label: "GIS Map"        },
                            { to: "/about",    label: "About Us"       },
                            { to: "/contact",  label: "Contact"        },
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-[12px] font-medium text-white hover:text-[#ffb694] transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Contact Us — Figma: heading #ffb694 16px fw=700, items 12px fw=500 white */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[16px] font-bold text-[#ffb694] tracking-tight">Contact Us</h4>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-start gap-2">
                            <MapPin size={12} className="text-white mt-0.5 flex-shrink-0" />
                            <span className="text-[12px] font-medium text-white leading-snug">
                                Office: {currentSettings.headOfficeAddress}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={12} className="text-white flex-shrink-0" />
                            <span className="text-[12px] font-medium text-white">Contact: {currentSettings.supportPhone}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={12} className="text-white flex-shrink-0" />
                            <span className="text-[12px] font-medium text-white">{currentSettings.supportEmail}</span>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Newsletter — Figma: heading #ffb694, input white bg r=2, Subscribe btn #a14000 */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[16px] font-bold text-[#ffb694] tracking-tight">Newsletter</h4>
                    <p className="text-[12px] font-medium text-white leading-relaxed">
                        Get the latest project updates and investment opportunities.
                    </p>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col gap-2"
                    >
                        {/* Figma: white bg, r=2, white stroke 1px, 9px V / 16px H pad */}
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                w-full px-4 py-[9px]
                                bg-white border border-white rounded-[2px]
                                text-[14px] font-semibold text-[#191c1d] placeholder-[#6b7280]
                                focus:outline-none focus:ring-1 focus:ring-[#a14000]
                                transition-all
                            "
                            required
                        />
                        {/* Figma: Subscribe btn — #a14000 fill, white text 14px fw=700 */}
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#a14000] hover:bg-[#5e2200] text-white text-[14px] font-bold transition-colors duration-200 cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Bottom bar — Figma: border-top white, 24px V pad, 12px fw=500 white ── */}
            <div className="border-t border-white max-w-[1280px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Figma: "© 2026 Reliance Housing Ltd. All rights reserved." */}
                <span className="text-[12px] font-medium text-white">
                    © 2026 {currentSettings.companyName}. All rights reserved.
                </span>
                {/* Figma: right links — Security | Sitemap | Cookie Policy */}
                <div className="flex items-center gap-6">
                    {["Security", "Sitemap", "Cookie Policy"].map((label) => (
                        <a
                            key={label}
                            href="#"
                            className="text-[12px] font-medium text-white hover:text-[#ffb694] transition-colors duration-200"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;