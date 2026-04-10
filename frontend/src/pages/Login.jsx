import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/festival-bg.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.identifier, formData.password);
      
      if (result.success) {
        if (result.bypass) {
          const role = (result.user?.role || 'admin').toLowerCase();
          navigate(`/${role}/dashboard`);
        } else {
          navigate('/verify-otp', { state: { username: result.username } });
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Connection Error: Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      {/* Clear Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Subtle overlay for contrast without heavy blur */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[400px] px-6"
      >
        {/* Floating Transparent Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 flex flex-col items-center border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
            <Mail className="text-white" size={32} />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/60 text-sm font-medium mb-8 text-center uppercase tracking-widest">Sign in to your portal</p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Email or Username"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-medium"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex gap-3 items-center"
              >
                <ShieldAlert className="text-red-400 shrink-0" size={16} />
                <p className="text-red-200 text-[11px] font-bold uppercase tracking-tight">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl"
            >
              <span className="text-base">{loading ? 'Verifying...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 flex justify-center">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Secure Access Portal</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
