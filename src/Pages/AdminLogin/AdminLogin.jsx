import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (username === 'Admin' && password === 'Admin123') {
                window.location.href = '/admin-panel';
            } else {
                setError('Invalid admin credentials.');
            }
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0c326f] via-[#fe762a] to-emerald-400" />
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-[#eef3ff] flex items-center justify-center mx-auto mb-3">
                                <User size={26} className="text-[#0c326f]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#0c326f] tracking-tight">Admin Login</h2>
                            <p className="text-xs text-slate-500 mt-1">Authorized personnel only</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[#43474d] uppercase tracking-[0.14em]">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => { setUsername(e.target.value); setError(''); }}
                                placeholder="Admin"
                                required
                                className="w-full px-4 py-3.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-lg text-[14px] text-[#191c1d] placeholder-[#74777e] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540]/20 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[#43474d] uppercase tracking-[0.14em]">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-4 pr-12 py-3.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-lg text-[14px] text-[#191c1d] placeholder-[#74777e] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540]/20 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-[#74777e] hover:text-[#43474d] flex items-center">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-[12px] text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#0c326f] hover:bg-[#082554] text-white font-semibold text-[16px] py-3.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Signing in...' : (<>Sign In <ArrowRight size={16} /></>)}
                        </button>

                        <p className="text-[12px] text-center text-[#74777e]">
                            <Link to="/login" className="text-[#0a2540] font-semibold hover:text-[#fe762a] transition-colors">
                                Back to User Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
