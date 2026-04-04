import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve phone number from login navigation state
    const phone = location.state?.phone;

    useEffect(() => {
        if (!phone) {
            navigate('/login');
        }
    }, [phone, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const user = await verifyOTP(phone, otpValue);
            if (user && user.role) {
                navigate(`/${user.role}/dashboard`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or Expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#0f172a] font-sans flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-500/[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-cyan-500/[0.05] blur-[150px] rounded-full" />
            </div>

            <main className="w-full flex items-center justify-center p-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[460px] bg-white rounded-[32px] shadow-[0_30px_100px_rgba(31,38,135,0.06)] border border-gray-100/30 p-10 md:p-12"
                >
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors mb-10 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="text-indigo-600" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-3">
                            Verification Code
                        </h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            We've sent a 6-digit code to <br/>
                            <span className="text-[#0f172a] font-bold">{phone}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="flex justify-between gap-3">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-[#fcfcff] border border-gray-100 rounded-xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all shadow-sm"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#0d6b82] text-white font-bold text-base shadow-[0_15px_40px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.35)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-70 flex items-center justify-center group"
                        >
                            {loading ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                        <p className="text-slate-400 text-xs font-medium mb-4">
                            Didn't receive the code?
                        </p>
                        <button className="flex items-center gap-2 mx-auto text-indigo-500 text-xs font-bold hover:text-indigo-600 transition-colors">
                            <RefreshCcw size={14} />
                            Resend Code
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default OTPVerification;
