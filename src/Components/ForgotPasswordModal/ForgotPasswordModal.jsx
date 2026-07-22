import { useState, useEffect } from 'react';
import { AtSign, X, ArrowRight, MailCheck } from 'lucide-react';
import { sendResetEmail } from '../../Backend/Auth/auth';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setError('');
            setLoading(false);
            setSent(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await sendResetEmail(email);
        setLoading(false);

        if (!result.success) {
            setError(result.error || 'Failed to send reset email. Please try again.');
            return;
        }

        setSent(true);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 28, 56, 0.72)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">

                {/* Gradient top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0c326f] via-sky-500 to-emerald-400" />

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                <div className="p-8">

                    {/* ────────── SEND EMAIL ────────── */}
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex justify-center mb-1">
                                <div className="w-14 h-14 rounded-full bg-[#eef3ff] flex items-center justify-center">
                                    <AtSign size={26} className="text-[#0c326f]" />
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-[#0c326f] tracking-tight">Reset Your Password</h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Enter your registered email and we'll send a password reset link.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400 pointer-events-none z-10 flex items-center">
                                        <AtSign size={15} />
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                        placeholder="name@company.com"
                                        required
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                    />
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
                                className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                            >
                                {loading ? 'Sending...' : (<>Send Reset Link <ArrowRight size={14} /></>)}
                            </button>

                            <p className="text-center text-[11px] text-slate-400">
                                Remembered it?{' '}
                                <button type="button" onClick={onClose} className="text-[#0c326f] font-semibold hover:underline">
                                    Back to Login
                                </button>
                            </p>
                        </form>
                    ) : (
                        /* ────────── SENT STATE ────────── */
                        <div className="space-y-5">
                            <div className="flex justify-center mb-1">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <MailCheck size={26} className="text-emerald-500" />
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-[#0c326f] tracking-tight">Check Your Email</h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    We've sent a password reset link to{' '}
                                    <span className="font-semibold text-slate-700">{email}</span>.
                                    Click the link in the email to reset your password.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm cursor-pointer"
                            >
                                Done
                            </button>

                            <p className="text-center text-[11px] text-slate-400">
                                Didn't receive it?{' '}
                                <button type="button" onClick={() => { setSent(false); setError(''); }} className="text-[#0c326f] font-semibold hover:underline">
                                    Send again
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;