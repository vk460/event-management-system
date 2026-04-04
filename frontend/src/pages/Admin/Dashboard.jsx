import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Users, Calendar, Activity, 
    Database, Cpu, Zap, Bell, 
    Search, Plus, ArrowUpRight, Lock,
    Settings, LayoutGrid, Server, Terminal,
    Globe, Smartphone, Key, LogOut, ChevronRight, X,
    UserPlus, Mail, Phone as PhoneIcon, Fingerprint
} from 'lucide-react';
import api from '../../api/api';

const AdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student',
        first_name: '',
        last_name: ''
    });

    const stats = [
        { label: 'Network Throughput', value: '1.2 TB/s', icon: Zap, color: '#22d3ee', trend: '+18%' },
        { label: 'Active Quantum Nodes', value: '156', icon: Activity, color: '#3b82f6', trend: 'Optimal' },
        { label: 'Encrypted Assets', value: '4,892', icon: Database, color: '#22d3ee', trend: '+5%' },
        { label: 'Security Breaches', value: '0', icon: Shield, color: '#22d3ee', trend: 'Secure' },
    ];

    const recentTraces = [
        { id: 'QT-902', target: 'Mainframe_Alpha', status: 'Authorized', time: '12m ago', clearance: 'Level 5' },
        { id: 'QT-903', target: 'Neural_Bridge', status: 'Syncing', time: '45m ago', clearance: 'Level 3' },
        { id: 'QT-904', target: 'Data_Vault_7', status: 'Locked', time: '2h ago', clearance: 'Admin' },
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('auth/admin-create-user/', formData);
            setMessage({ type: 'success', text: 'User created successfully! Trace identified.' });
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'student',
                first_name: '',
                last_name: ''
            });
            setTimeout(() => setIsModalOpen(false), 2000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.username?.[0] || error.response?.data?.error || 'Failed to initialize user.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] opacity-50" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'var(--quantum-texture)' }} />
            </div>

            {/* Premium Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-10 z-50 border-r border-white/5 bg-[#030712]/80 backdrop-blur-2xl">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-16 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                >
                    <Cpu className="text-cyan-400 w-7 h-7" />
                </motion.div>
                
                <nav className="flex flex-col gap-10">
                    {[LayoutGrid, Shield, Server, Terminal, Settings].map((Icon, i) => (
                        <button key={i} className="group relative flex items-center justify-center">
                            <motion.div 
                                whileHover={{ scale: 1.2 }}
                                className="text-slate-500 group-hover:text-cyan-400 transition-colors"
                            >
                                <Icon size={24} strokeWidth={1.5} />
                            </motion.div>
                            <div className="absolute left-full ml-6 px-3 py-1.5 bg-cyan-500 text-black text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl">
                                {Icon.name}
                            </div>
                            {i === 0 && <div className="absolute -left-12 w-1 h-8 bg-cyan-400 rounded-r-full" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col gap-8 pb-4">
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                        className="p-3 rounded-2xl bg-red-500/5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={22} strokeWidth={1.5} />
                    </button>
                    <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                        <div className="w-12 h-12 rounded-[14px] bg-[#020617] flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="pl-24 min-h-screen relative z-10 flex flex-col">
                {/* Fluid Header */}
                <header className="px-14 py-10 flex justify-between items-center border-b border-white/5 bg-[#020617]/40 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-cyan-400 uppercase">Quantum_Control_Center</span>
                        </div>
                        <h1 className="headline-quantum text-4xl">System<span className="text-white font-light">Mainframe</span></h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="Execute Global Query..." 
                                className="quantum-input w-96 pl-12 bg-white/5 border-white/5 hover:border-white/10 text-sm font-medium tracking-wide"
                            />
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            className="w-14 h-14 flex items-center justify-center rounded-2xl glass-card hover:border-cyan-400/30 group"
                        >
                            <Bell size={22} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-[#020617]" />
                        </motion.button>
                    </div>
                </header>

                <div className="p-14 space-y-10">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="glass-card p-8 group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <stat.icon size={80} strokeWidth={1} />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-cyan-500/20 transition-colors" style={{ color: stat.color }}>
                                        <stat.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/10">{stat.trend}</span>
                                </div>
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                                <p className="text-4xl font-black tracking-tight text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Operational Core (Bento) */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Traffic Analysis (Large) */}
                        <div className="col-span-8 glass-card p-10 min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
                                    <Activity className="text-cyan-400" size={28} /> Network Saturation
                                </h2>
                                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                                    {['Real-time', 'History', 'Predictions'].map((tag, i) => (
                                        <button key={i} className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex items-end gap-5">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ duration: 0.8, delay: i * 0.05, ease: "circOut" }}
                                        style={{ height: `${20 + Math.random() * 80}%`, originY: 'bottom' }}
                                        className="flex-1 bg-gradient-to-t from-cyan-600/5 via-cyan-400/20 to-cyan-400/40 rounded-full group relative"
                                    >
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 bg-white text-black text-[9px] font-black px-2 py-1 rounded-lg">
                                            {Math.floor(20 + Math.random() * 80)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-8 pt-6 border-t border-white/5 text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase">
                                <span>UTC 00:00</span>
                                <span>UTC 08:00</span>
                                <span>UTC 16:00</span>
                                <span>UTC 24:00</span>
                            </div>
                        </div>

                        {/* Security Protocol (Small Stack) */}
                        <div className="col-span-4 flex flex-col gap-8">
                            <div className="glass-card p-8 flex-1">
                                <h3 className="text-sm font-black tracking-tight uppercase mb-8 flex items-center justify-between">
                                    <span className="flex items-center gap-3"><Key size={18} className="text-cyan-400" /> Clearance Logs</span>
                                    <ChevronRight size={18} className="text-slate-600" />
                                </h3>
                                <div className="space-y-5">
                                    {[
                                        { name: 'Root Override', role: 'Security', status: 'Active' },
                                        { name: 'Node Sync', role: 'Core', status: 'Pending' },
                                        { name: 'Audit Sweep', role: 'Admin', status: 'Success' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-cyan-500/20 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-cyan-500/5 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                                                    <Lock size={16} className="text-cyan-400 group-hover:text-black transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold tracking-tight text-white mb-0.5">{log.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{log.role}</p>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-8 bg-gradient-to-br from-cyan-500/[0.05] to-blue-600/[0.05] relative overflow-hidden h-40">
                                <div className="relative z-10">
                                    <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-3">Sync Progress</h3>
                                    <div className="text-3xl font-black text-white mb-6">94.8%</div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: '94.8%' }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                                <Activity className="absolute -bottom-6 -right-6 text-cyan-500/10 w-24 h-24" />
                            </div>
                        </div>

                        {/* Recent Traces Table (Full Width) */}
                        <div className="col-span-12 glass-card p-10 overflow-x-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
                                    <Globe size={28} className="text-cyan-400" /> Operational Trace Feed
                                </h2>
                                <button className="btn-quantum-ghost py-3 px-8 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                                    <Terminal size={16} /> Filter Core Logs
                                </button>
                            </div>
                            <table className="w-full">
                                <thead className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">
                                    <tr>
                                        <th className="text-left pb-6">Trace_ID</th>
                                        <th className="text-left pb-6">Registry_Target</th>
                                        <th className="text-left pb-6">Status</th>
                                        <th className="text-left pb-6">Interval</th>
                                        <th className="text-right pb-6">Elevation</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[13px]">
                                    {recentTraces.map((trace, i) => (
                                        <tr key={i} className="group border-b border-white/5 last:border-0">
                                            <td className="py-6 font-mono text-cyan-400 font-bold">{trace.id}</td>
                                            <td className="py-6 font-bold text-white tracking-tight">{trace.target}</td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${trace.status === 'Authorized' ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-600'}`} />
                                                    <span className={`font-bold uppercase text-[11px] tracking-widest ${trace.status === 'Authorized' ? 'text-cyan-400' : 'text-slate-500'}`}>{trace.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-slate-400 font-medium">{trace.time}</td>
                                            <td className="py-6 text-right">
                                                <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase text-cyan-400 border border-white/5 group-hover:border-cyan-500/20 transition-all">
                                                    {trace.clearance}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Floating Secure Action */}
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-12 right-12 w-20 h-20 rounded-3xl bg-cyan-500 text-[#020617] shadow-2xl shadow-cyan-500/40 flex items-center justify-center z-50 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <Plus size={40} strokeWidth={2.5} />
                </motion.button>

                {/* Add User Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="relative w-full max-w-2xl glass-card p-12 border-cyan-500/20 shadow-[0_0_100px_rgba(34,211,238,0.1)]"
                            >
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="mb-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-cyan-500 text-black">
                                            <UserPlus size={24} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">Initialize_New_User</h2>
                                    </div>
                                    <p className="text-slate-400 font-medium tracking-wide">Enter the user credentials to generate a new clearance profile in the registry.</p>
                                </div>

                                <form onSubmit={handleCreateUser} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">Phone_Number (User_ID)</label>
                                            <div className="relative">
                                                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input 
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    type="text" 
                                                    placeholder="e.g. 9876543210" 
                                                    className="quantum-input pl-12 w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">Access_Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    type="email" 
                                                    placeholder="user@network.com" 
                                                    className="quantum-input pl-12 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">First_Name</label>
                                            <input 
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                type="text" 
                                                placeholder="Legal First Name" 
                                                className="quantum-input w-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">Last_Name</label>
                                            <input 
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                type="text" 
                                                placeholder="Legal Last Name" 
                                                className="quantum-input w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">Security_Clearance (Role)</label>
                                            <select 
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                className="quantum-input w-full appearance-none cursor-pointer"
                                            >
                                                <option value="student">Student (Level 1)</option>
                                                <option value="teacher">Teacher (Level 2)</option>
                                                <option value="hod">HOD (Level 3)</option>
                                                <option value="principal">Principal (Level 4)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 pl-1">Initial_Access_Key (Password)</label>
                                            <div className="relative">
                                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input 
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    className="quantum-input pl-12 w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {message.text && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl text-[11px] font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                                        >
                                            {message.text}
                                        </motion.div>
                                    )}

                                    <div className="pt-6">
                                        <button 
                                            disabled={loading}
                                            className="w-full h-14 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {loading ? 'Executing_Registry_Sync...' : 'Authorize_User_Creation'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
