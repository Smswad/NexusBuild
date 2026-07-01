import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#000f22] text-white">
            
            {/* Top 4-Column Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10">
                
                {/* Column 1: Brand & Bio */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold tracking-tight">NexusBuild</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Empowering real estate development and property management with architectural precision and high-grade GIS integrations.
                    </p>
                    {/* Social outline circles */}
                    <div className="flex items-center gap-2.5 pt-2">
                        <a href="#" className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold tracking-wider text-white uppercase">Quick Links</h4>
                    <ul className="space-y-2.5 text-xs text-white/60">
                        <li>
                            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
                        </li>
                        <li>
                            <Link to="/" className="hover:text-white transition-colors">Support</Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact Us */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold tracking-wider text-white uppercase">Contact Us</h4>
                    <ul className="space-y-3 text-xs text-white/60">
                        <li className="flex items-center gap-2">
                            <Mail size={14} className="text-white/40" />
                            <span>contact@reliancehousing.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={14} className="text-white/40" />
                            <span>+880 1234-567890</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin size={14} className="text-white/40 mt-0.5" />
                            <span>Plot 12, Road 3, Narayanganj</span>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold tracking-wider text-white uppercase">Newsletter</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Subscribe to our newsletter for latest project updates.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                        <input 
                            type="email" 
                            placeholder="Email address..." 
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                            required
                        />
                        <button 
                            type="submit"
                            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 px-4 rounded-lg text-xs font-bold transition-all tracking-wider uppercase cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <span>© 2026 NexusBuild. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                    <Link to="/register" className="hover:text-white transition-colors">Register</Link>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                        className="hover:text-white transition-colors focus:outline-none cursor-pointer uppercase"
                    >
                        Back to Top
                    </button>
                </div>
            </div>

        </footer>
    );
};

export default Footer;