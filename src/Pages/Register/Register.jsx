import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import register_image from '../../assets/pics/register_pic.svg';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Header/Navbar';

// ─── Register ────────────────────────────────────────────────────────────────
// Figma frame: 1280×1450, node-id=1:451
// Layout: Horizontal split — 768px visual column (left) / 512px form column (right)
// Left:  Hero image + gradient overlay, pill badge, 48px heading, 18px body, stats grid
// Right: #f8f9fa bg, 80px all-around padding, 352px form container, 48px gap sections
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared input field wrapper — defined at MODULE SCOPE so it is stable across
// renders. Defining sub-components inside a parent function causes React to
// treat them as new types on every render, which unmounts and remounts the DOM
// node (losing focus). Module-level = single, stable reference.
const Field = ({ label, hint, children }) => (
    <div className="flex flex-col gap-2">
        {/* Figma: label 14px fw=600 #000f22 uppercase */}
        <label className="text-[14px] font-semibold text-[#000f22] uppercase tracking-[0.06em]">
            {label}
        </label>
        {children}
        {hint && (
            <p className="text-[12px] font-medium text-[#43474d] leading-snug">{hint}</p>
        )}
    </div>
);

const IconWrap = ({ children }) => (
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none flex items-center">
        {children}
    </span>
);

// Figma: inputs — #f3f4f5 bg, r=4, #c4c6ce stroke 1px, pad=18px V / 80px L gutter
const inputCls = `
    w-full pl-12 pr-4 py-[18px]
    bg-[#f3f4f5] border border-[#c4c6ce] rounded-[4px]
    text-[14px] font-medium text-[#191c1d] placeholder-[#74777e]
    focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540]/20
    transition-all duration-200 min-h-[44px]
`;

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Step 1: Create the auth user
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Supabase returns a user with empty identities when email already exists
        if (data.user && data.user.identities?.length === 0) {
            setError('This email is already registered. Please log in instead.');
            setLoading(false);
            return;
        }

        // Step 2: The Postgres trigger (handle_new_user) automatically inserts
        // the profile row into public.Registration when the auth user is created.
        // No client-side insert needed — the trigger runs with SECURITY DEFINER
        // which bypasses RLS and works even before email confirmation.

        setLoading(false);
        setSuccess('Registration successful! Please check your email to confirm your account.');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f3f4f5]">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:py-12 lg:px-6">

                {/*
                 * ── Main Registration Section ───────────────────────────────
                 * Figma: 1280×1030 HORIZONTAL frame
                 * Left:  'Section - Visual Column' 768px wide
                 * Right: 'Section - Form Column'   512px wide, #f8f9fa bg, 80px all padding
                 *
                 * Desktop (lg+): exact 60/40 split, min-h of section matches Figma
                 * Tablet (sm-lg): left panel hidden, form centred
                 * Mobile (<sm):  full-width stacked, touch-friendly
                 */}
                <div className="
                    relative w-full bg-white overflow-hidden
                    flex flex-col
                    lg:flex-row lg:min-h-[700px] lg:max-w-[1280px] lg:shadow-[0px_25px_50px_#00000040]
                    sm:max-w-2xl sm:rounded-xl sm:shadow-[0px_10px_15px_#0000001a]
                    max-w-full rounded-lg shadow-[0px_4px_6px_#0000001a]
                    lg:rounded-2xl lg:mx-auto
                ">

                    {/* ══ LEFT PANEL — Visual Column (768px / 60%) ══════════════
                     * Figma: Image rect + gradient overlay + Content on Image (80px padding)
                     *   Content: pill badge + heading + body + stats grid
                     */}
                    <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">

                        {/* Hero image */}
                        <img
                            src={register_image}
                            alt="NexusBuild Empowering Infrastructure"
                            className="absolute inset-0 w-full h-full object-cover select-none"
                        />

                        {/* Figma: 'Overlay Gradient' — gradient fill over image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#000f22]/85 via-[#000f22]/60 to-[#0a2540]/40" />

                        {/* Figma: 'Content on Image' — 80px padding all sides, vertical layout, 24px gap */}
                        <div className="absolute inset-0 flex flex-col justify-center p-20 z-10">
                            <div className="flex flex-col gap-6 max-w-[576px]">

                                {/* Figma: 'Container' — 576px wide, vertical, 16px gap */}
                                <div className="flex flex-col gap-4">

                                    {/* Figma: 'Background' pill — #fe762a fill, r=2, pad=4,16,4,16
                                     *   Text: "PREMIUM INFRASTRUCTURE" 14px fw=600 #5e2200 */}
                                    <div className="inline-flex self-start">
                                        <span className="bg-[#fe762a] text-[#5e2200] text-[14px] font-semibold rounded-[2px] px-4 py-1 uppercase tracking-[0.04em]">
                                            Premium Infrastructure
                                        </span>
                                    </div>

                                    {/* Figma: 'Heading 1' — "Empowering Infrastructure" 48px fw=700 white */}
                                    <h1 className="text-[48px] font-bold text-white leading-tight tracking-tight">
                                        Empowering<br />Infrastructure
                                    </h1>

                                    {/* Figma: body text — 18px fw=400 white, 576×84 */}
                                    <p className="text-[18px] font-normal text-white leading-relaxed max-w-[576px]">
                                        Join the architectural vanguard. NexusBuild leverages advanced GIS mapping and sustainable engineering to create spaces that define the next generation of urban living.
                                    </p>
                                </div>

                                {/* Figma: 'Stats Grid' — 448×140, HORIZONTAL, 24px gap, 80px left padding
                                 *   Two 'VerticalBorder' stat cells, left-bordered with #a14000
                                 *   Number: 32px fw=600 #fe762a — Label: 14px fw=600 white */}
                                <div className="flex items-start gap-6 pt-10">

                                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-[#a14000]">
                                        <span className="text-[32px] font-semibold text-[#fe762a] leading-none">150+</span>
                                        <span className="text-[14px] font-semibold text-white">Completed Projects</span>
                                    </div>

                                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-[#a14000]">
                                        <span className="text-[32px] font-semibold text-[#fe762a] leading-none">12k+</span>
                                        <span className="text-[14px] font-semibold text-white">Happy Families</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT PANEL — Form Column (512px / 40%) ═══════════════
                     * Figma: #f8f9fa bg, 80px all-around padding
                     *   Inner container: 352px wide, 48px gap between sections
                     */}
                    <div className="
                        w-full bg-white flex items-center justify-center
                        lg:w-[40%] lg:flex-shrink-0
                        px-4 py-10
                        sm:px-12 sm:py-14
                        lg:px-20 lg:py-12
                    ">
                        {/* Inner container — Figma: 352px wide, 870px tall, 48px gap */}
                        <div className="w-full max-w-[352px] flex flex-col gap-12">

                            {/* Header block — Figma: 352×96, 8px gap
                             *   Heading: "Create Your Account" 32px fw=600 #000f22
                             *   Sub-text: 16px fw=400 #43474d */}
                            <div className="flex flex-col gap-2">
                                {/* Mobile back link */}
                                <Link
                                    to="/"
                                    className="text-[12px] text-[#74777e] hover:text-[#000f22] transition-colors mb-2 lg:hidden"
                                >
                                    &larr; Back to Home
                                </Link>
                                <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-semibold text-[#000f22] leading-tight tracking-tight">
                                    Create Your Account
                                </h2>
                                <p className="text-[16px] font-normal text-[#43474d] leading-snug">
                                    Enter the exclusive portal for infrastructure excellence.
                                </p>
                            </div>

                            {/* Form — Figma: 352×654, vertical, 24px gap, 32px top padding */}
                            <div className="flex flex-col gap-3">

                                {/* Success banner */}
                                {success && (
                                    <div className="flex items-start gap-3 px-4 py-4 bg-emerald-50 border border-emerald-200 rounded-[4px] mb-2">
                                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-[14px] font-medium text-emerald-700 leading-snug">{success}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                    {/* ── Full Name ── */}
                                    <Field label="Full Name">
                                        <div className="relative">
                                            <IconWrap><User size={16} /></IconWrap>
                                            <input
                                                type="text"
                                                className={inputCls}
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </Field>

                                    {/* ── Email Address ── */}
                                    <Field label="Email Address">
                                        <div className="relative">
                                            <IconWrap><Mail size={16} /></IconWrap>
                                            <input
                                                type="email"
                                                className={inputCls}
                                                placeholder="john@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </Field>

                                    {/* ── Phone Number ── */}
                                    <Field label="Phone Number">
                                        <div className="relative">
                                            <IconWrap><Phone size={16} /></IconWrap>
                                            <input
                                                type="tel"
                                                inputMode="tel"
                                                className={inputCls}
                                                placeholder="+880 1XXX-XXXXXX"
                                                value={phoneNumber}
                                                onKeyDown={(e) => {
                                                    // Allow: digits, +, -, space, (, ), Backspace,
                                                    // Delete, Tab, ArrowLeft/Right, Home, End
                                                    const allowed = /^[0-9+\-() ]$/;
                                                    const nav = [
                                                        'Backspace','Delete','Tab','ArrowLeft',
                                                        'ArrowRight','Home','End',
                                                    ];
                                                    if (!allowed.test(e.key) && !nav.includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    // Strip any non-phone characters that arrive
                                                    // through paste or autofill
                                                    const cleaned = e.target.value.replace(/[^0-9+\-() ]/g, '');
                                                    setPhoneNumber(cleaned);
                                                }}
                                            />
                                        </div>
                                    </Field>

                                    {/* ── Password ── Figma: hint "Minimum 8 characters..." 12px fw=500 #43474d */}
                                    <Field
                                        label="Password"
                                        hint="Minimum 8 characters with a mix of symbols."
                                    >
                                        <div className="relative">
                                            <IconWrap><Lock size={16} /></IconWrap>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`${inputCls} pr-12`}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777e] hover:text-[#43474d] focus:outline-none flex items-center min-h-[44px] min-w-[44px] justify-end"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </Field>

                                    {/* ── Terms — Figma: 'Terms' 352×54, HORIZONTAL, 16px gap, 8px top pad
                                     *   Checkbox: 20×20 r=2 #ffffff fill #c4c6ce stroke
                                     *   Label text: 14px fw=600 #43474d */}
                                    <div className="flex items-start gap-4 pt-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-[2px] border-[#c4c6ce] accent-[#0a2540] cursor-pointer"
                                            required
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-[14px] font-semibold text-[#43474d] leading-snug select-none cursor-pointer"
                                        >
                                            I agree to the{' '}
                                            <a href="#" className="text-[#0a2540] hover:text-[#fe762a] transition-colors">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="#" className="text-[#0a2540] hover:text-[#fe762a] transition-colors">Privacy Policy</a>
                                        </label>
                                    </div>

                                    {/* Error state */}
                                    {error && (
                                        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-[4px]">
                                            <p className="text-[12px] font-medium text-red-600 leading-snug">{error}</p>
                                        </div>
                                    )}

                                    {/* ── CTA Button — Figma: 352×68, #fe762a, r=4, 24px V pad, 16px gap
                                     *   Text: "REGISTER ACCOUNT" 14px fw=600 #5e2200 */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            w-full flex items-center justify-center gap-4
                                            bg-[#fe762a] hover:bg-[#a14000]
                                            text-[#5e2200] hover:text-white
                                            font-semibold text-[14px] uppercase tracking-[0.06em]
                                            py-6 rounded-[4px] min-h-[68px]
                                            transition-colors duration-200
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            shadow-[0px_4px_6px_#0000001a]
                                            cursor-pointer
                                        "
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="loading loading-dots loading-sm text-[#5e2200]"></span>
                                                Registering...
                                            </span>
                                        ) : (
                                            <>
                                                Register Account <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>

                                    {/* Sign-in link — Figma: 16px fw=400 #43474d */}
                                    <p className="text-[16px] font-normal text-[#43474d] text-center">
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-semibold text-[#0a2540] hover:text-[#fe762a] transition-colors duration-200"
                                        >
                                            Sign in here
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;