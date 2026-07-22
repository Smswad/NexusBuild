import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import login_image from '../../assets/pics/login_pic.png';
import Footer from '../../Components/Footer/Footer';
import { resetPassword } from '../../Backend/Auth/auth';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    // Retrieve the email that was verified via OTP
    useEffect(() => {
        const stored = sessionStorage.getItem('nexus_reset_email');
        if (!stored) {
            // No verified email — send back to login
            navigate('/login', { replace: true });
        } else {
            setEmail(stored);
        }
    }, [navigate]);

    // ── Password rules ────────────────────────────────────────────────────────
    const getStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score; // 0–4
    };

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    const strength = getStrength(newPassword);

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await resetPassword(email, newPassword);
        setLoading(false);

        if (!result.success) {
            setError(result.error || 'Failed to update password. Please try again.');
            return;
        }

        // Clear the stored email
        sessionStorage.removeItem('nexus_reset_email');
        setDone(true);

        // Redirect to login after 2.5 seconds
        setTimeout(() => navigate('/login', { replace: true }), 2500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f4f7fa]">
            <div className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="relative flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100/80 min-h-[600px]">

                    {/* Back to login */}
                    <div className="absolute top-4 right-4 z-20">
                        <Link
                            to="/login"
                            className="text-xs font-semibold text-slate-400 hover:text-[#0c326f] transition-colors duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>

                    {/* ── Left Panel ─────────────────────────────────────── */}
                    <div className="relative md:w-1/2 hidden md:flex flex-col justify-between overflow-hidden">
                        <img
                            src={login_image}
                            alt="NexusBuild Building"
                            className="absolute inset-0 w-full h-full object-cover select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#051c38]/95 via-[#051c38]/40 to-transparent" />

                        {/* Logo */}
                        <div className="relative z-10 p-8 flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl flex items-center justify-center w-10 h-10 shadow-md">
                                <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 80C35 50 65 50 80 20" stroke="#0ea5e9" strokeWidth="12" strokeLinecap="round" />
                                    <path d="M20 50C35 30 65 30 80 10" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">NexusBuild</span>
                        </div>

                        <div className="flex-grow" />

                        {/* Overlay text */}
                        <div className="relative z-10 w-full">
                            <div className="p-8 pb-5 text-white">
                                <h3 className="text-xl font-bold tracking-tight text-white mb-3 max-w-sm leading-snug">
                                    Secure Access, Every Time.
                                </h3>
                                <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                                    Your account security is our priority. Choose a strong password to protect your NexusBuild portal and all associated assets.
                                </p>
                            </div>
                            <div className="bg-[#051c38]/90 px-8 py-5 border-t border-white/10 flex items-center gap-10">
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400 tracking-tight">256-bit</div>
                                    <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Encryption</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400 tracking-tight">OTP</div>
                                    <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">Verified</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel ────────────────────────────────────── */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                        <div className="max-w-sm mx-auto w-full">

                            {/* ── SUCCESS STATE ── */}
                            {done ? (
                                <div className="flex flex-col items-center text-center space-y-4 py-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 size={36} className="text-emerald-500" />
                                    </div>
                                    <h2 className="text-lg font-bold text-[#0c326f] tracking-tight">Password Updated!</h2>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Your password has been changed successfully. Redirecting you to the login page…
                                    </p>
                                    <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ animation: 'progress-shrink 2.5s linear forwards' }}
                                        />
                                    </div>
                                    <style>{`
                                        @keyframes progress-shrink {
                                            from { width: 100%; }
                                            to   { width: 0%; }
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                /* ── FORM STATE ── */
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#0c326f] tracking-tight">Set New Password</h2>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Resetting for{' '}
                                            <span className="font-semibold text-slate-700">{email}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-1">

                                        {/* New Password */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                New Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                                    <Lock size={16} />
                                                </span>
                                                <input
                                                    type={showNew ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                                                    placeholder="••••••••"
                                                    required
                                                    minLength={8}
                                                    className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNew(!showNew)}
                                                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center"
                                                >
                                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>

                                            {/* Strength bar */}
                                            {newPassword.length > 0 && (
                                                <div className="pt-1 space-y-1">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div
                                                                key={i}
                                                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                                                style={{ background: i <= strength ? strengthColor[strength] : '#e2e8f0' }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-semibold" style={{ color: strengthColor[strength] }}>
                                                        {strengthLabel[strength]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Confirm New Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                                    <Lock size={16} />
                                                </span>
                                                <input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                                    placeholder="••••••••"
                                                    required
                                                    className={`w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                                                        ${confirmPassword.length > 0
                                                            ? confirmPassword === newPassword
                                                                ? 'border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20'
                                                                : 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                                                            : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center"
                                                >
                                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">Passwords do not match.</p>
                                            )}
                                            {confirmPassword.length > 0 && confirmPassword === newPassword && (
                                                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Passwords match ✓</p>
                                            )}
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-rose-500 text-xs font-medium bg-rose-50 border border-rose-100 rounded-md px-3 py-2">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                    >
                                        {loading ? 'Updating...' : (<>Update Password <ArrowRight size={14} /></>)}
                                    </button>

                                    <div className="border-t border-slate-100 my-4" />

                                    <p className="text-xs text-center text-slate-600">
                                        Remembered it?{' '}
                                        <Link to="/login" className="text-[#0c326f] font-bold hover:underline">
                                            Back to Login
                                        </Link>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;

