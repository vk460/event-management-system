import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  GraduationCap, 
  LogOut, 
  UserCircle 
} from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Left: Branding */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/${user?.role || 'admin'}/dashboard`)}>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <GraduationCap size={28} />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">SKN Sinhgad College</h1>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Korti, Pandharpur</p>
                    </div>
                </div>

                {/* Right: User Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded-full hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <UserCircle size={24} />
                        </div>
                        <div className="text-left hidden lg:block pr-2">
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1 capitalize truncate max-w-[120px]">
                                {user?.first_name || user?.username || 'User'}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-orange-500 leading-none">
                                {user?.role || 'Guest'}
                            </p>
                        </div>
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15)] overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-400 capitalize">{user?.department_name || 'Administration'}</p>
                                </div>
                                <div className="p-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-colors text-sm"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
