import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import register_image from '../../assets/pics/register_pic.svg';

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

        // Step 2: Insert profile row into Registration table
        if (data.user) {
            const { error: profileError } = await supabase
                .from('Registration')
                .insert({
                    id: data.user.id,
                    full_name: fullName,
                    email: email,
                    phone_number: phoneNumber || null,
                });

            if (profileError) {
                // Auth user created but profile insert failed — show warning
                console.warn('Profile insert error:', profileError.message);
            }
        }

        setLoading(false);
        setSuccess('Registration successful! Please check your email to confirm your account.');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f4f7fa] p-4 md:p-8">
            <div className="relative flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100/80 min-h-[600px]">
                
                {/* Back Button */}
                <div className="absolute top-4 right-4 z-20">
                    <Link 
                        to="/" 
                        className="text-xs font-semibold text-slate-400 hover:text-[#0c326f] transition-colors duration-200"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Left Panel - Image & Stats (Hidden on mobile) */}
                <div className="relative md:w-1/2 hidden md:flex flex-col justify-between overflow-hidden">
                    <img 
                        src={register_image} 
                        alt="Empowering Infrastructure" 
                        className="absolute inset-0 w-full h-full object-cover select-none"
                    />
                    {/* Linear overlay gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051c38]/90 via-[#051c38]/40 to-transparent"></div>
                    
                    <div className="flex-grow"></div>
                    
                    {/* Overlay Text & Stats */}
                    <div className="relative z-10 w-full">
                        <div className="p-8 pb-5 text-white">
                            <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
                                Empowering Infrastructure
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                                Join NexusBuild to access professional-grade GIS mapping, property financials, and streamlined asset management tools for Reliance Housing Ltd.
                            </p>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="bg-[#051c38]/90 px-8 py-5 border-t border-white/10 flex items-center gap-10">
                            <div>
                                <div className="text-2xl font-bold text-white tracking-tight">500+</div>
                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Projects</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white tracking-tight">12k</div>
                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Properties</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Register Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <h2 className="text-lg font-semibold text-[#0c326f] tracking-tight">Create Account</h2>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Fill in your details to start your professional journey with NexusBuild.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                        <User size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                        <Mail size={16} />
                                    </span>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                        <Phone size={16} />
                                    </span>
                                    <input
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        placeholder="+1 (555) 00000-0000"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 italic font-normal mt-1 leading-normal">
                                    Must be at least 8 characters with a mix of letters and numbers.
                                </p>
                            </div>
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-start gap-2.5 pt-1">
                            <input 
                                type="checkbox" 
                                id="terms"
                                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                                required
                            />
                            <label htmlFor="terms" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
                                I agree to the <a href="#" className="text-[#0c326f] font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#0c326f] font-semibold hover:underline">Privacy Policy</a> of Reliance Housing Ltd.
                            </label>
                        </div>

                        {error && (
                            <p className="text-rose-500 text-xs mt-2 font-medium bg-rose-50 border border-rose-100 rounded-md px-3 py-2">{error}</p>
                        )}
                        {success && (
                            <p className="text-emerald-600 text-xs mt-2 font-medium bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">{success}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : (
                                <>
                                    Register <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;