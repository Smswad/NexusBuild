import { useState } from 'react';
import { Link } from 'react-router';
import {
    Mail, Phone, Clock, MapPin, Send, MessageSquare,
    TrendingUp, HeadphonesIcon, ChevronRight,
} from 'lucide-react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

// ─── Contact ──────────────────────────────────────────────────────────────────
// Figma frame: node-id=1:1038
// Sections: Hero | 3 Info Cards | Form + Map
// ─────────────────────────────────────────────────────────────────────────────

// ── Contact info cards ────────────────────────────────────────────────────────
const CARDS = [
    {
        id:       'general',
        icon:     Mail,
        iconBg:   '#0a2540',   // dark navy — Figma fills
        title:    'General Inquiries',
        lines: [
            { label: 'Email',  value: 'info@reliancehousing.com' },
            { label: 'Phone',  value: '+880 1234 567890' },
        ],
    },
    {
        id:       'sales',
        icon:     TrendingUp,
        iconBg:   '#fe762a',   // orange accent — Figma fills
        title:    'Sales & Investment',
        lines: [
            { label: 'Email',  value: 'sales@nexusbuild.com' },
            { label: 'Hours',  value: 'Mon – Fri: 9:00 AM – 6:00 PM' },
        ],
    },
    {
        id:       'support',
        icon:     HeadphonesIcon,
        iconBg:   '#000f22',   // darkest — Figma fills
        title:    'Customer Support',
        lines: [
            { label: 'Email',  value: 'support@reliancehousing.com' },
            { label: 'Hours',  value: 'Mon – Sat: 8:00 AM – 8:00 PM' },
        ],
    },
];

// ── Subject options ───────────────────────────────────────────────────────────
const SUBJECTS = [
    'General Inquiry',
    'Sales & Investment',
    'Customer Support',
    'Technical Issue',
    'Other',
];

// ─────────────────────────────────────────────────────────────────────────────
const Contact = () => {
    const [form, setForm] = useState({
        fullName: '',
        email:    '',
        subject:  '',
        message:  '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
            setForm({ fullName: '', email: '', subject: '', message: '' });
        }, 400);
    };

    // OpenStreetMap embed — Shamabay New Market, Narayanganj
    const mapSrc = 'https://www.openstreetmap.org/export/embed.html?bbox=90.488%2C23.610%2C90.512%2C23.635&layer=mapnik&marker=23.622%2C90.500';

    return (
        <div className="flex flex-col min-h-screen font-[Inter,sans-serif] bg-[#f3f4f5]">
            <Navbar />

            {/* ══ 1. HERO ══════════════════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden bg-[#000f22] min-h-[400px] flex items-center"
                style={{
                    backgroundImage: [
                        'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(254,118,42,0.12) 0%, transparent 70%)',
                    ].join(','),
                }}
            >
                {/* Blueprint grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: [
                            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
                            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                        ].join(','),
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative max-w-[1184px] mx-auto px-6 sm:px-10 lg:px-12 py-20 w-full">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-[2px] bg-[#fe762a]" />
                        <span className="text-[11px] font-semibold text-[#fe762a] uppercase tracking-[0.22em]">
                            Contact Us
                        </span>
                    </div>

                    <h1 className="text-[48px] sm:text-[56px] font-bold text-white leading-[1.05] tracking-tight mb-5">
                        Get In Touch
                    </h1>

                    <p className="text-[18px] font-normal text-[#b0c8eb] leading-[28px] max-w-[580px]">
                        Whether you're enquiring about a project, exploring investment opportunities,
                        or need support — our team is ready to assist you.
                    </p>

                    {/* Quick contact link */}
                    <div className="flex items-center gap-4 mt-8">
                        <a
                            href="tel:+8801234567890"
                            className="inline-flex items-center gap-2 text-[14px] text-[#b0c8eb] hover:text-white transition-colors"
                        >
                            <Phone size={14} className="text-[#fe762a]" />
                            +880 1234 567890
                        </a>
                        <span className="text-white/20">|</span>
                        <a
                            href="mailto:info@reliancehousing.com"
                            className="inline-flex items-center gap-2 text-[14px] text-[#b0c8eb] hover:text-white transition-colors"
                        >
                            <Mail size={14} className="text-[#fe762a]" />
                            info@reliancehousing.com
                        </a>
                    </div>
                </div>
            </section>

            {/* ══ 2. CONTACT INFO CARDS ═══════════════════════════════════════ */}
            <section className="py-16 bg-[#f3f4f5]">
                <div className="max-w-[1184px] mx-auto px-6 sm:px-10 lg:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {CARDS.map(({ id, icon: Icon, iconBg, title, lines }) => (
                            <div
                                key={id}
                                className="bg-white border border-[#c4c6ce] p-6 flex flex-col gap-2"
                            >
                                {/* Icon badge — 48×48 */}
                                <div
                                    className="w-12 h-12 flex items-center justify-center mb-2 flex-shrink-0"
                                    style={{ background: iconBg }}
                                >
                                    <Icon size={20} className="text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-[20px] font-semibold text-[#191c1d] leading-[32px]">
                                    {title}
                                </h3>

                                {/* Lines */}
                                <div className="flex flex-col gap-1">
                                    {lines.map(({ label, value }) => (
                                        <p key={label} className="text-[16px] font-normal text-[#43474d] leading-[24px]">
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 3. FORM + MAP ════════════════════════════════════════════════ */}
            <section className="pb-20 bg-[#f3f4f5]">
                <div className="max-w-[1184px] mx-auto px-6 sm:px-10 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        {/* ── Left: Contact Form ───────────────────────────── */}
                        <div className="bg-white border border-[#c4c6ce]">
                            {/* Form header */}
                            <div className="px-8 py-6 border-b border-[#e1e3e4] flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#000f22] flex items-center justify-center flex-shrink-0">
                                    <MessageSquare size={14} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-semibold text-[#191c1d] leading-tight">
                                        Send Us a Message
                                    </h2>
                                    <p className="text-[13px] font-normal text-[#74777e] mt-0.5">
                                        We'll respond within 24 business hours
                                    </p>
                                </div>
                            </div>

                            {/* Success banner */}
                            {submitted && (
                                <div className="mx-8 mt-6 bg-[#0a3d2e]/10 border border-[#0a3d2e]/30 px-4 py-3 text-[14px] font-semibold text-[#0a3d2e] flex items-center gap-2">
                                    <Send size={14} />
                                    Message sent! We'll be in touch soon.
                                </div>
                            )}

                            {/* Form fields */}
                            <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

                                {/* Full Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="fullName"
                                        className="text-[13px] font-semibold text-[#43474d] uppercase tracking-[0.08em]"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        required
                                        className="
                                            w-full h-12 px-4
                                            border border-[#c4c6ce] bg-white
                                            text-[15px] font-normal text-[#191c1d]
                                            placeholder:text-[#9ea1a8]
                                            focus:outline-none focus:border-[#a14000]
                                            transition-colors duration-150
                                        "
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="email"
                                        className="text-[13px] font-semibold text-[#43474d] uppercase tracking-[0.08em]"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                        className="
                                            w-full h-12 px-4
                                            border border-[#c4c6ce] bg-white
                                            text-[15px] font-normal text-[#191c1d]
                                            placeholder:text-[#9ea1a8]
                                            focus:outline-none focus:border-[#a14000]
                                            transition-colors duration-150
                                        "
                                    />
                                </div>

                                {/* Subject */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="subject"
                                        className="text-[13px] font-semibold text-[#43474d] uppercase tracking-[0.08em]"
                                    >
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        className="
                                            w-full h-12 px-4
                                            border border-[#c4c6ce] bg-white
                                            text-[15px] font-normal text-[#191c1d]
                                            focus:outline-none focus:border-[#a14000]
                                            transition-colors duration-150
                                            appearance-none
                                            cursor-pointer
                                        "
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2343474d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 16px center',
                                        }}
                                    >
                                        <option value="" disabled>Select a subject…</option>
                                        {SUBJECTS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="message"
                                        className="text-[13px] font-semibold text-[#43474d] uppercase tracking-[0.08em]"
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Describe how we can help you…"
                                        required
                                        rows={5}
                                        className="
                                            w-full px-4 py-3
                                            border border-[#c4c6ce] bg-white
                                            text-[15px] font-normal text-[#191c1d]
                                            placeholder:text-[#9ea1a8]
                                            focus:outline-none focus:border-[#a14000]
                                            transition-colors duration-150
                                            resize-none
                                        "
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full h-14 flex items-center justify-center gap-2
                                        bg-[#000f22] hover:bg-[#0a2540]
                                        text-white text-[14px] font-bold uppercase tracking-[0.1em]
                                        transition-colors duration-200
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        mt-1
                                    "
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="loading loading-dots loading-sm text-white"></span>
                                            SENDING MESSAGE...
                                        </span>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            SEND MESSAGE
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ── Right: Map + Address info ─────────────────────── */}
                        <div className="flex flex-col gap-6">

                            {/* Map embed */}
                            <div className="overflow-hidden border border-[#c4c6ce] relative" style={{ height: '360px' }}>
                                <iframe
                                    title="NexusBuild Office Location — Narayanganj"
                                    src={mapSrc}
                                    className="absolute inset-0 w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Address card */}
                            <div className="bg-white border border-[#c4c6ce] p-6 flex flex-col gap-5">
                                <h3 className="text-[16px] font-semibold text-[#191c1d] flex items-center gap-2">
                                    <MapPin size={16} className="text-[#a14000] flex-shrink-0" />
                                    Our Office
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Address */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-[#74777e] uppercase tracking-[0.1em]">
                                            Address
                                        </span>
                                        <p className="text-[14px] font-normal text-[#43474d] leading-[22px]">
                                            Shamabay New Market<br />
                                            259 B B Road<br />
                                            Narayanganj, Bangladesh
                                        </p>
                                    </div>

                                    {/* Working hours */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-[#74777e] uppercase tracking-[0.1em]">
                                            Working Hours
                                        </span>
                                        <p className="text-[14px] font-normal text-[#43474d] leading-[22px]">
                                            Mon – Fri: 9:00 AM – 6:00 PM<br />
                                            Saturday: 9:00 AM – 2:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>

                                {/* Open in Maps link */}
                                <a
                                    href="https://www.openstreetmap.org/#map=16/23.622/90.500"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        inline-flex items-center gap-2 text-[13px] font-semibold
                                        text-[#a14000] hover:text-[#5e2200] border-t border-[#e1e3e4]
                                        pt-4 transition-colors duration-150
                                    "
                                >
                                    Open in Full Map
                                    <ChevronRight size={14} />
                                </a>
                            </div>

                            {/* Quick contact badges */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="tel:+8801234567890"
                                    className="
                                        flex-1 flex items-center gap-3 bg-[#000f22] px-4 py-4
                                        hover:bg-[#0a2540] transition-colors duration-200 group
                                    "
                                >
                                    <div className="w-8 h-8 bg-[#a14000] flex items-center justify-center flex-shrink-0">
                                        <Phone size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-[#768dad] uppercase tracking-wider">Call Us</p>
                                        <p className="text-[13px] font-semibold text-white">+880 1234 567890</p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:info@reliancehousing.com"
                                    className="
                                        flex-1 flex items-center gap-3 bg-white border border-[#c4c6ce] px-4 py-4
                                        hover:border-[#a14000] transition-colors duration-200
                                    "
                                >
                                    <div className="w-8 h-8 bg-[#f3f4f5] border border-[#c4c6ce] flex items-center justify-center flex-shrink-0">
                                        <Mail size={14} className="text-[#a14000]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-[#74777e] uppercase tracking-wider">Email</p>
                                        <p className="text-[13px] font-semibold text-[#191c1d]">info@reliancehousing.com</p>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;