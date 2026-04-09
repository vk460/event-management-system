import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCcw, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.png';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const username = location.state?.username;

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await verifyOTP(username, otpValue);
      if (user && user.role) {
        navigate(`/${user.role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or Expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        <div className="glass-card rounded-[40px] p-10 flex flex-col items-center border border-white/40 shadow-2xl">
          <button 
            onClick={() => navigate('/login')}
            className="self-start flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-primary" size={32} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Identity</h1>
          <p className="text-gray-500 font-medium mb-10 text-center">
            Enter the 6-digit code sent to <br/>
            <span className="text-gray-900 font-bold">{username}</span>
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-10">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-16 text-center text-2xl font-black bg-gray-50 border-none rounded-xl text-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="mt-10 w-full pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-widest">
              Didn't receive the code?
            </p>
            <button className="flex items-center gap-2 mx-auto text-primary text-sm font-black hover:opacity-80 transition-all uppercase tracking-tighter">
              <RefreshCcw size={14} />
              Resend Code
            </button>
          </div>
          
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
            For Demo, use <span className="text-primary italic">123456</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
