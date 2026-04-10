import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, ArrowLeft, Cpu } from 'lucide-react';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import HODDashboard from './pages/HOD/Dashboard';
import PrincipalDashboard from './pages/Principal/Dashboard';
import PrincipalEventDetail from './pages/Principal/EventDetail';
import TeacherDashboard from './pages/Teacher/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return (
        <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1], 
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.5, 1, 0.5] 
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-primary rounded-2xl shadow-xl flex items-center justify-center"
            >
                <div className="w-4 h-4 bg-white rounded-full"></div>
            </motion.div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
    
    return children;
};

const Unauthorized = () => (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6 font-sans">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 max-w-lg w-full text-center border border-gray-100 rounded-[40px] shadow-2xl"
        >
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-100">
                <ShieldAlert className="text-red-500 w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-black mb-4 text-gray-900 tracking-tight italic uppercase">Access Denied</h1>
            <p className="text-gray-500 mb-10 font-medium leading-relaxed">
                Your credentials do not hold the required clearance level for this sector. 
                This attempt and your current telemetry have been logged.
            </p>
            
            <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg"
            >
                <ArrowLeft size={18} /> BACK_TO_SAFETY
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
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    
                    {/* HOD Routes */}
                    <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    <Route path="/hod/teachers" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    <Route path="/hod/approve" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    <Route path="/hod/analytics" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    <Route path="/hod/upload" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
                    
                    {/* Principal Routes */}
                    <Route path="/principal/dashboard" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
                    <Route path="/principal/departments" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
                    <Route path="/principal/events" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
                    <Route path="/principal/events/:id" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalEventDetail /></ProtectedRoute>} />
                    <Route path="/principal/upload" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
                    
                    {/* Teacher Routes */}
                    <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                    <Route path="/teacher/create" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                    <Route path="/teacher/events" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                    <Route path="/teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
                    
                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
