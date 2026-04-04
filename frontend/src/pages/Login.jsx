import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, HelpCircle, ShieldCheck, Lock, Phone, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, setSession } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(credentials.phone, credentials.password);
            
            if (data.bypass_otp) {
                // Admin/Superuser bypass: Store token and redirect via role-switch
                const { access, refresh, user: userData, role } = data;
                setSession(userData, access, refresh);
                
                // Senior-Dev Implementation: Role-based Switch Redirection
                switch (role.toLowerCase()) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'principal':
                        navigate('/principal/dashboard');
                        break;
                    case 'hod':
                        navigate('/hod/dashboard');
                        break;
                    case 'teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    default:
                        navigate('/dashboard');
                }
            } else {
                // Regular user flow (Requires OTP)
                navigate('/verify-otp', { state: { phone: credentials.phone } });
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.error || 'Access Denied: Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#0f172a] font-sans selection:bg-indigo-100 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-500/[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-cyan-500/[0.05] blur-[150px] rounded-full" />
            </div>

            {/* Page Header */}
            <header className="absolute top-0 w-full z-10 px-8 py-6 flex justify-between items-center transition-all opacity-80">
                <h2 className="text-[#6366f1] font-bold text-base tracking-tight">
                    State-of-the-Art Event Manager
                </h2>
                <div className="flex items-center gap-6">
                    <ShieldCheck size={20} className="text-[#6366f1] cursor-pointer hover:opacity-70 transition-all" />
                    <HelpCircle size={20} className="text-[#6366f1] cursor-pointer hover:opacity-70 transition-all" />
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex items-center justify-center p-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[500px] bg-white rounded-[32px] shadow-[0_30px_100px_rgba(31,38,135,0.06)] overflow-hidden border border-gray-100/30"
                >
                    <div className="p-8 md:p-10">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-3">
                                Secure Access
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">
                                Step 1: Verify your identity credentials.
                            </p>
                            
                            <div className="mt-6">
                                <span className="inline-flex items-center px-6 py-2 rounded-full bg-[#f4f5ff] text-[#6366f1] text-[10px] font-bold tracking-[0.1em] uppercase border border-[#6366f1]/5 shadow-sm">
                                    Unified Identity Portal
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-6">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
                                    Email (Admin) / Phone (User)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={credentials.phone}
                                        onChange={handleChange}
                                        placeholder="Email or Phone Number"
                                        className="w-full h-12 pl-14 pr-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-medium placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full h-12 pl-14 pr-6 bg-[#fcfcff] border border-gray-100 rounded-2xl text-slate-700 font-medium tracking-widest placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2 py-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative w-5 h-5 rounded-md border border-gray-200 bg-white group-hover:border-indigo-300 transition-colors">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-all">
                                            <Check size={14} className="text-indigo-500" strokeWidth={3} />
                                        </div>
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">Remember me</span>
                                </label>
                                <Link to="/forgot-password" size={14} className="text-indigo-500 text-sm font-bold hover:text-indigo-600 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#0d6b82] text-white font-bold text-base shadow-[0_15px_40px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.35)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-70 disabled:translate-y-0 disabled:shadow-lg flex items-center justify-center group"
                            >
                                <span className="relative z-10 transition-transform group-hover:scale-105">
                                    {loading ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        "Login"
                                    )}
                                </span>
                            </button>
                        </form>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="mt-10 flex items-center justify-center gap-3 opacity-60">
                            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50/50 border border-gray-50 border-dashed">
                                <Shield size={14} className="text-[#0891b2]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d6b82]">
                                    Secure Authentication Active
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Page Footer */}
            <footer className="absolute bottom-0 w-full z-10 px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/50 backdrop-blur-sm opacity-80">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center md:text-left">
                    © 2024 State-of-the-Art Event Manager. Protected by the Ethereal Vault.
                </p>
                <div className="flex items-center gap-8 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                    <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-indigo-400 transition-colors">Security</a>
                </div>
            </footer>
        </div>
    );
};

export default Login;
