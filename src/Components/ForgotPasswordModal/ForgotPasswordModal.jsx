import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { AtSign, X, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { checkEmailExists, sendOTPEmail, verifyOTP } from '../../Backend/Auth/auth';

// ─── Constants ────────────────────────────────────────────────────────────────
const OTP_TTL = 30; // seconds
const OTP_LENGTH = 6;

// ─── Countdown Ring SVG ───────────────────────────────────────────────────────
const CountdownRing = ({ seconds, total }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const progress = seconds / total;
    const dashOffset = circumference * (1 - progress);

    const color = seconds > 10
        ? '#10b981'
        : seconds > 5
            ? '#f59e0b'
            : '#ef4444';

    return (
        <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle
                    cx="28" cy="28" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
                />
            </svg>
            <span className="text-sm font-bold tabular-nums" style={{ color }}>{seconds}s</span>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Shared
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OTP
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [countdown, setCountdown] = useState(OTP_TTL);
    const [expired, setExpired] = useState(false);
    const inputRefs = useRef([]);
    const timerRef = useRef(null);

    // Reset when modal opens / closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail('');
            setError('');
            setOtp(Array(OTP_LENGTH).fill(''));
            setLoading(false);
            setCountdown(OTP_TTL);
            setExpired(false);
        } else {
            clearInterval(timerRef.current);
        }
    }, [isOpen]);

    // Countdown ticker
    const startCountdown = () => {
        clearInterval(timerRef.current);
        setCountdown(OTP_TTL);
        setExpired(false);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    // ── Step 1: check email then send OTP ────────────────────────────────────
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const checkResult = await checkEmailExists(email);

        if (!checkResult.exists) {
            setError('No account found with this email address.');
            setLoading(false);
            return;
        }

        const sendResult = await sendOTPEmail(email);
        setLoading(false);

        if (!sendResult.success) {
            setError(sendResult.error || 'Failed to send OTP. Please try again.');
            return;
        }

        setOtp(Array(OTP_LENGTH).fill(''));
        setStep(2);
        startCountdown();
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
    };

    // ── OTP box handlers ─────────────────────────────────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        const next = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((ch, i) => { next[i] = ch; });
        setOtp(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    // ── Step 2: verify OTP and navigate ──────────────────────────────────────
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (expired) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        const otpString = otp.join('');
        if (otpString.length < OTP_LENGTH) {
            setError('Please enter all 6 digits.');
            return;
        }

        setLoading(true);
        const result = await verifyOTP(email, otpString);
        setLoading(false);

        if (!result.valid) {
            setError(result.error || 'Incorrect OTP. Please try again.');
            return;
        }

        // TODO (Backend Dev): replace sessionStorage with a signed server token
        sessionStorage.setItem('nexus_reset_email', email);
        clearInterval(timerRef.current);
        onClose();
        navigate('/reset-password');
    };

    // ── Resend ────────────────────────────────────────────────────────────────
    const handleResend = async () => {
        setError('');
        setOtp(Array(OTP_LENGTH).fill(''));
        await sendOTPEmail(email);
        startCountdown();
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
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

                    {/* ────────── STEP 1 ────────── */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div className="flex justify-center mb-1">
                                <div className="w-14 h-14 rounded-full bg-[#eef3ff] flex items-center justify-center">
                                    <AtSign size={26} className="text-[#0c326f]" />
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-[#0c326f] tracking-tight">Reset Your Password</h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Enter your registered email and we'll send a one-time verification code.
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
                                {loading ? 'Checking...' : (<>Send OTP <ArrowRight size={14} /></>)}
                            </button>

                            <p className="text-center text-[11px] text-slate-400">
                                Remembered it?{' '}
                                <button type="button" onClick={onClose} className="text-[#0c326f] font-semibold hover:underline">
                                    Back to Login
                                </button>
                            </p>
                        </form>
                    )}

                    {/* ────────── STEP 2 ────────── */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div className="flex items-center justify-center gap-5 mb-1">
                                <div className="w-14 h-14 rounded-full bg-[#eef3ff] flex items-center justify-center">
                                    <ShieldCheck size={26} className="text-[#0c326f]" />
                                </div>
                                <CountdownRing seconds={countdown} total={OTP_TTL} />
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-[#0c326f] tracking-tight">Enter Verification Code</h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    A 6-digit code was sent to{' '}
                                    <span className="font-semibold text-slate-700">{email}</span>.{' '}
                                    {expired
                                        ? <span className="text-rose-500 font-semibold">Code expired.</span>
                                        : <span>Valid for <span className="font-semibold text-emerald-600">{countdown}s</span>.</span>
                                    }
                                </p>
                            </div>

                            {/* 6 OTP boxes */}
                            <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => (inputRefs.current[i] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        disabled={expired}
                                        className={`w-11 h-12 text-center text-lg font-bold rounded-lg border-2 bg-[#f8fafc] text-slate-800 focus:outline-none transition-all
                                            ${expired
                                                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                                : digit
                                                    ? 'border-[#0c326f] bg-[#eef3ff]'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                            }`}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-rose-500 text-xs font-medium bg-rose-50 border border-rose-100 rounded-md px-3 py-2 text-center">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || expired}
                                className="w-full bg-[#0c326f] hover:bg-[#092552] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                            >
                                {loading ? 'Verifying...' : (<>Verify Code <ArrowRight size={14} /></>)}
                            </button>

                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(''); clearInterval(timerRef.current); }}
                                    className="hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    ← Change Email
                                </button>

                                {expired ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="flex items-center gap-1 text-[#0c326f] font-semibold hover:underline cursor-pointer"
                                    >
                                        <RefreshCw size={11} /> Resend OTP
                                    </button>
                                ) : (
                                    <span>Code expires in {countdown}s</span>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;

