import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';
import { Lock, Eye, EyeOff, ArrowRight, AtSign } from 'lucide-react';
import login_image from '../../assets/pics/login_pic.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess(`Welcome back, ${data.user.email}!`);
        }
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
                        src={login_image} 
                        alt="NexusBuild Building" 
                        className="absolute inset-0 w-full h-full object-cover select-none"
                    />
                    {/* Linear overlay gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051c38]/95 via-[#051c38]/40 to-transparent"></div>
                    
                    {/* Top Logo Container */}
                    <div className="relative z-10 p-8 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl flex items-center justify-center w-10 h-10 shadow-md">
                            {/* Stylized SVG logo representing Reliance / NexusBuild */}
                            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 80C35 50 65 50 80 20" stroke="#0ea5e9" strokeWidth="12" strokeLinecap="round" />
                                <path d="M20 50C35 30 65 30 80 10" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">NexusBuild</span>
                    </div>

                    <div className="flex-grow"></div>
                    
                    {/* Overlay Text & Stats */}
                    <div className="relative z-10 w-full">
                        <div className="p-8 pb-5 text-white">
                            <h3 className="text-xl font-bold tracking-tight text-white mb-3 max-w-sm leading-snug">
                                Redefining Urban Infrastructure with Architectural Precision.
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                                Access the industry's most advanced GIS-mapped property management ecosystem. Securely manage assets, track financials, and explore new development opportunities.
                            </p>
                        </div>
                        
                        {/* Stats Row with Green text color as in mockup */}
                        <div className="bg-[#051c38]/90 px-8 py-5 border-t border-white/10 flex items-center gap-10">
                            <div>
                                <div className="text-2xl font-bold text-emerald-400 tracking-tight">4.8k+</div>
                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Managed Assets</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-400 tracking-tight">98%</div>
                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Client Precision</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white">
                    <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <h2 className="text-xl font-bold text-[#0c326f] tracking-tight">Welcome Back</h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Please enter your credentials to access your portal.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                {/* Email Address */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                            <AtSign size={16} />
                                        </span>
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
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
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remember Me and Forgot Password */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center gap-2 text-slate-500 select-none cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                                    />
                                    Remember Me
                                </label>
                                <a href="#" className="text-[#0c326f] font-semibold hover:underline">
                                    Forgot Password?
                                </a>
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
                                className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : (
                                    <>
                                        Sign In <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="border-t border-slate-100 my-6"></div>

                        <p className="text-xs text-center text-slate-600">
                            New to Reliance Housing?{' '}
                            <Link to="/register" className="text-[#0c326f] font-bold hover:underline">
                                Register for an Account
                            </Link>
                        </p>
                    </div>

                    {/* Footer Policy Links */}
                    <div className="flex justify-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4 mt-auto">
                        <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;