import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [activeRole, setActiveRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoCredentials = {
    admin: { id: 'admin@school.com', pass: 'admin123' },
    hod: { id: '9876543210', pass: 'hod123' },
    principal: { id: '9123456789', pass: 'principal123' },
    teacher: { id: '9988776655', pass: 'teacher123' },
    student: { id: '9123456780', pass: 'student123' },
  };

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'hod', label: 'HOD' },
    { id: 'principal', label: 'Principal' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'student', label: 'Student' },
  ];

  useEffect(() => {
    const creds = demoCredentials[activeRole];
    setFormData({ identifier: creds.id, password: creds.pass });
    setError('');
  }, [activeRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.identifier, formData.password);
      
      if (result.success) {
        if (result.bypass) {
          const role = (result.user?.role || activeRole).toLowerCase();
          navigate(`/${role}/dashboard`);
        } else {
          navigate('/verify-otp', { state: { username: result.username } });
        }
      } else {
        // Show specific error from backend if available
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
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        <div className="glass-card rounded-[40px] p-10 flex flex-col items-center border border-white/40 shadow-2xl">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Sign In</h1>
          <p className="text-gray-500 font-medium mb-8 text-center">Enter details for {activeRole.toUpperCase()} portal</p>

          <div className="bg-gray-100/80 p-1.5 rounded-2xl flex gap-1 mb-10 w-full overflow-x-auto no-scrollbar">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                  activeRole === role.id 
                    ? 'bg-gradient-primary text-white shadow-lg' 
                    : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                {activeRole === 'admin' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {activeRole === 'admin' ? <Mail size={20} /> : <Phone size={20} />}
                </div>
                <input
                  type={activeRole === 'admin' ? 'email' : 'text'}
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-800 font-medium focus:ring-2 focus:ring-primary/20"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 text-gray-800 font-medium focus:ring-2 focus:ring-primary/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex gap-3 items-center"
              >
                <ShieldAlert className="text-red-500 shrink-0" size={20} />
                <p className="text-red-700 text-xs font-bold leading-tight uppercase tracking-tight">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              <span className="text-lg">{loading ? 'Verifying...' : 'Sign In Now'}</span>
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-300 text-center leading-loose">
            Demo: <span className="text-gray-600 underline">{demoCredentials[activeRole].id}</span> / <span className="text-gray-600 underline">{demoCredentials[activeRole].pass}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
