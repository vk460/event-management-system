import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, KeyRound, ArrowLeft, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP & New Password
    const [formData, setFormData] = useState({ phone: '', otp: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('auth/forgot-password/', { username: formData.phone });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Account not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('auth/reset-password/', {
                username: formData.phone,
                otp: formData.otp,
                new_password: formData.newPassword
            });
            setSuccess('Password updated successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP or session expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#0f172a] font-sans flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-500/[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-cyan-500/[0.05] blur-[150px] rounded-full" />
            </div>

            <main className="w-full flex items-center justify-center p-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_30px_100px_rgba(31,38,135,0.06)] border border-gray-100/30 p-10 md:p-12"
                >
                    <Link to="/login" className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-indigo-500 transition-colors mb-10 group w-fit">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    {step === 1 ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <KeyRound className="text-indigo-600" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-3">
                                Recovery
                            </h1>
                            <p className="text-slate-400 text-sm font-medium mb-10">
                                Enter your phone number to receive <br/> a recovery verification code.
                            </p>

                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="text-left group">
                                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 pl-1 group-focus-within:text-[#6366f1] transition-colors">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="w-full h-12 pl-14 pr-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#0d6b82] text-white font-bold text-base shadow-[0_15px_40px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.35)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-70 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        "Send OTP Code"
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-green-600" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-3">
                                Set New Password
                            </h1>
                            <p className="text-slate-400 text-sm font-medium mb-10">
                                Verify the code sent to your phone and <br/> choose a strong new password.
                            </p>

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="text-left group">
                                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 pl-1">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="6-digit OTP"
                                        className="w-full h-12 px-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-bold tracking-[1em] text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="text-left group">
                                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 pl-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className="w-full h-12 pl-14 pr-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="text-left group">
                                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 pl-1">
                                        Confirm Access Key
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className="w-full h-12 pl-14 pr-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#0d6b82] text-white font-bold text-base shadow-[0_15px_40px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.35)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-70 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        "Verify & Reset Password"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 text-xs font-bold text-center"
                        >
                            {success}
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default ForgotPassword;
