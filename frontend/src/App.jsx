import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, ArrowLeft, Cpu } from 'lucide-react';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/Admin/Dashboard';
import PrincipalDashboard from './pages/Principal/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import TeacherDashboard from './pages/Teacher/Dashboard';
import HODDashboard from './pages/HOD/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    rotate: [0, 180, 360],
                    opacity: [0.3, 1, 0.3] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl border-2 border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)]"
            >
                <Cpu className="text-indigo-400 w-8 h-8" />
            </motion.div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
    return children;
};

const Unauthorized = () => (
    <div className="min-h-screen bg-white text-slate-800 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Ethereal Ambient Layer */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[150px] opacity-30" />
        
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-14 max-w-xl w-full text-center border border-red-100 rounded-[40px] shadow-2xl relative z-10"
        >
            <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-red-100 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
            >
                <ShieldAlert className="text-red-500 w-12 h-12" />
            </motion.div>
            
            <h1 className="text-5xl font-black mb-6 text-[#0f172a] tracking-tight">ACCESS_<span className="text-red-500 italic">DENIED</span></h1>
            
            <div className="flex items-center justify-center gap-3 mb-10 opacity-60">
                <Terminal size={16} className="text-red-400" />
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-red-500">Security Clearance Req. 7.4.0</p>
            </div>
            
            <p className="text-slate-500 mb-14 text-base leading-relaxed font-medium px-6">
                Your credentials do not hold the required clearance level for this sector. 
                This attempt and your current telemetry have been logged to the Security Mainframe.
            </p>
            
            <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 text-slate-400 hover:text-red-600 group w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> RETURN_TO_PREVIOUS_NODE
            </button>
        </motion.div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/principal/dashboard" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
                    <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                    <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
