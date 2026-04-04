import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Users, TrendingUp, Award,
    Globe, Database, Zap, Bell,
    Search, Calendar, ArrowUpRight, Lock,
    Settings, LayoutGrid, FileText, PieChart,
    ChevronRight, Briefcase, GraduationCap,
    Cpu, Activity, Target
} from 'lucide-react';

const PrincipalDashboard = () => {
    const metrics = [
        { label: 'Institutional Enrollment', value: '2,840', icon: GraduationCap, color: '#22d3ee' },
        { label: 'Operational Security', value: '99.8%', icon: Shield, color: '#3b82f6' },
        { label: 'Strategic Initiatives', value: '42', icon: Target, color: '#22d3ee' },
        { label: 'Academic Standing', value: 'Global #12', icon: Award, color: '#3b82f6' },
    ];

    const upcomingEvents = [
        { title: 'Global Tech Summit', date: 'Oct 15', status: 'Priority', level: 'Critical' },
        { title: 'Nexus Protocol Audit', date: 'Oct 22', status: 'Required', level: 'High' },
        { title: 'International Symposium', date: 'Nov 05', status: 'Scheduled', level: 'Med' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Executive Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'var(--quantum-texture)' }} />
            </div>

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 h-24 border-b border-white/5 bg-[#030712]/60 backdrop-blur-3xl z-50 flex items-center justify-between px-16">
                <div className="flex items-center gap-6">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/10"
                    >
                        <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                            <Shield className="text-cyan-400 w-6 h-6" strokeWidth={1.5} />
                        </div>
                    </motion.div>
                    <h1 className="headline-quantum text-3xl tracking-tight">Quantum<span className="text-white font-light">Executive</span></h1>
                </div>

                <div className="flex items-center gap-10">
                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
                        {['Strategy', 'Personnel', 'Intelligence', 'Network'].map((item, i) => (
                            <button key={i} className="hover:text-cyan-400 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all" />
                            </button>
                        ))}
                    </div>
                    <div className="h-10 w-[1px] bg-white/5" />
                    <div className="flex items-center gap-5">
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all relative">
                            <Bell size={20} className="text-slate-400" />
                            <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                            <div className="text-right">
                                <p className="text-xs font-black text-white uppercase tracking-wider">Dr. Julian Carter</p>
                                <p className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-[0.2em]">Institutional_Head</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5 group cursor-pointer overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Principal" alt="Principal" className="w-full h-full rounded-[14px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Operational Dashboard */}
            <main className="pt-40 pb-20 px-16 relative z-10 max-w-screen-2xl mx-auto space-y-12">
                {/* Executive Header */}
                <div className="flex justify-between items-end">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-4">
                            <Activity size={14} className="text-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Institutional Health: 98.2%</span>
                        </div>
                        <h2 className="text-6xl font-black tracking-tight text-white">Command <span className="text-slate-500 font-light italic">Center</span></h2>
                    </motion.div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-quantum py-5 px-10 shadow-xl shadow-cyan-500/20"
                    >
                        <FileText size={18} /> GENERATE_STRATEGIC_AUDIT
                    </motion.button>
                </div>

                {/* Performance Matrices */}
                <div className="grid grid-cols-4 gap-8">
                    {metrics.map((metric, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                                    <metric.icon size={26} className="text-cyan-400" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-cyan-400 mb-1">+4.2%</span>
                                    <TrendingUp size={14} className="text-cyan-400" />
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-2">{metric.label}</h3>
                            <p className="text-4xl font-black text-white">{metric.value}</p>
                            <div className="mt-8 relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bento Grid Architecture */}
                <div className="grid grid-cols-12 gap-10">
                    {/* Intelligence Repository (Large) */}
                    <div className="col-span-8 glass-card p-12 min-h-[550px] flex flex-col">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-5">
                                <Database className="text-cyan-400" size={32} /> Intelligence Repository
                            </h3>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                                    <Search size={20} />
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                                    <TrendingUp size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/20 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 flex items-center justify-center border border-white/5 group-hover:bg-cyan-500 transition-colors">
                                                <FileText className="text-cyan-400 w-7 h-7 group-hover:text-black transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white mb-1">Strategic_Core_Framework_v{100 + i}.0</h4>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Modified: 2h ago</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Encrypted_Link</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="flex -space-x-3">
                                                {[...Array(3)].map((_, j) => (
                                                    <div key={j} className="w-9 h-9 rounded-full border-2 border-[#020617] bg-slate-800 overflow-hidden shadow-lg">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=exec${j + i}`} alt="Staff" />
                                                    </div>
                                                ))}
                                            </div>
                                            <ArrowUpRight size={22} className="text-slate-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Awareness (Small Stack) */}
                    <div className="col-span-4 space-y-10">
                        <div className="glass-card p-10 border-cyan-500/10 h-[60%] flex flex-col">
                            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-cyan-400 mb-10 flex items-center justify-between">
                                Priority Metrics <TrendingUp size={16} />
                            </h3>
                            <div className="space-y-8 flex-1">
                                {upcomingEvents.map((event, i) => (
                                    <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 transition-all group cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${event.status === 'Priority' ? 'text-red-500' : 'text-cyan-500'}`}>{event.status}</span>
                                            <span className="text-[10px] text-slate-500 font-bold">{event.date}</span>
                                        </div>
                                        <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/10" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2.5 py-1 rounded-lg uppercase border border-white/5">{event.level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-10 bg-gradient-to-br from-cyan-500/[0.07] to-blue-600/[0.07] relative overflow-hidden flex flex-col justify-center items-center text-center">
                            <PieChart size={40} className="text-cyan-400 mb-6 opacity-60" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">Institutional Pulse</h3>
                            <div className="text-5xl font-black text-white tracking-tighter">98.5<span className="text-2xl text-cyan-500/50">%</span></div>
                            <p className="text-[10px] text-slate-500 mt-3 uppercase font-bold tracking-[0.2em]">Aggregated Efficiency Core</p>
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <ChevronRight size={60} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrincipalDashboard;
