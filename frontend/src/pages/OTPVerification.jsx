import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCcw, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import loginBg from '../assets/login-bg.png';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { verifyOTP, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const identifier = location.state?.identifier;
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!identifier) {
      navigate('/login');
    }
  }, [identifier, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setLoading(true);
      await api.post('users/forgot-password/', { identifier }); // Direct call since we have the view
      setResendTimer(30);
      setCanResend(false);
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (err) {
      setError('FAILED TO RESEND OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    if (timer <= 0) {
      setError('OTP EXPIRED. PLEASE RESEND.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await verifyOTP(identifier, otpValue);
      if (user && user.role) {
        navigate(`/${user.role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      setError(err.message || 'Invalid or Expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background stays same */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-10 flex flex-col items-center border border-white/20 shadow-2xl">
          <button 
            onClick={() => navigate('/login')}
            className="self-start flex items-center gap-2 text-white/60 text-sm font-bold hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
            <Lock className="text-white" size={32} />
          </div>

          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Verify Identity</h1>
          <p className="text-white/60 font-medium mb-1 text-center">
            Enter the 6-digit code sent to <br/>
            <span className="text-white font-bold">{identifier}</span>
          </p>
          <div className="mb-8 font-mono text-orange-400 font-bold text-lg animate-pulse">
            {formatTime(timer)}
          </div>

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
                  className="w-12 h-16 text-center text-3xl font-black bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all font-mono"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl text-red-200 text-[11px] font-bold text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || timer <= 0}
              className="w-full bg-white text-gray-900 py-5 rounded-2xl flex items-center justify-center font-bold text-lg gap-2 group disabled:opacity-50 shadow-xl transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          <div className="mt-10 w-full pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">
              Didn't receive the code?
            </p>
            <button 
              onClick={handleResend}
              disabled={!canResend || loading}
              className={`flex items-center gap-2 mx-auto text-white text-sm font-black transition-all uppercase tracking-tight ${!canResend ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
            >
              <RefreshCcw size={14} className={!canResend ? '' : 'animate-spin-slow'} />
              {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
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
