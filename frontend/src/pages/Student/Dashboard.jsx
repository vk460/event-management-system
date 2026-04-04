import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Calendar, Activity, 
    Star, Database, Zap, Bell,
    Search, Clock, ArrowUpRight, Lock,
    Settings, LayoutGrid, Terminal,
    MapPin, Smartphone, GraduationCap,
    Heart, CheckCircle, Flame, ChevronRight,
    Trophy, ZapOff, Cpu
} from 'lucide-react';

const StudentDashboard = () => {
    const activeEvents = [
        { id: 'QT-229', name: 'Global Tech Summit', status: 'In Progress', type: 'Technical', xp: '+150XP' },
        { id: 'QT-230', name: 'Alumni Nexus Dinner', status: 'Awaiting', type: 'Formals', xp: '+80XP' },
        { id: 'QT-231', name: 'Quantum Code Sprint', status: 'Registered', type: 'Competitive', xp: '+200XP' },
    ];

    const upcomingMissions = [
        { title: 'Security Protocol Briefing', time: '14:00', type: 'Mandatory', urgent: true },
        { title: 'Asset Retrieval: Node 7', time: '16:30', type: 'Logistics', urgent: false },
        { title: 'Neural Audit Sync', time: 'Tomorrow', type: 'Status', urgent: false },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Tactical Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'var(--quantum-texture)' }} />
            </div>

            {/* Sidebar (Tactical Quantum) */}
            <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-10 z-50 border-r border-white/5 bg-[#030712]/80 backdrop-blur-2xl">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] mb-16 shadow-lg shadow-cyan-500/10"
                >
                    <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                        <Zap size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                </motion.div>
                
                <nav className="flex flex-col gap-10">
                    {[LayoutGrid, Star, Calendar, Terminal, MapPin].map((Icon, i) => (
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
                        </button>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col gap-8 pb-4">
                    <button className="relative p-3 text-slate-500 hover:text-cyan-400 transition-all">
                        <Bell size={22} strokeWidth={1.5} />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                    </button>
                    <div className="p-0.5 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer hover:border-cyan-500/30 transition-all overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student" alt="Student" className="w-10 h-10 rounded-xl" />
                    </div>
                </div>
            </aside>

            {/* Main Application Surface */}
            <main className="pl-24 min-h-screen relative z-10 flex flex-col">
                {/* Tactical Header */}
                <header className="px-14 py-12 flex justify-between items-end border-b border-white/5 bg-[#020617]/40 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-cyan-500/5 border border-cyan-500/10 rounded-full text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase">Quantum_Link: Verified</div>
                        </div>
                        <h1 className="headline-quantum text-5xl">The Event<span className="text-white font-light italic">Grid</span></h1>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex flex-col text-right">
                            <span className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase mb-1">Session_Credits</span>
                            <span className="text-3xl font-black text-white flex items-center gap-3 justify-end">
                                2,480 <span className="text-cyan-500 text-xs tracking-widest uppercase">XP</span>
                            </span>
                        </div>
                        <div className="h-12 w-[1px] bg-white/5" />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-quantum py-4 px-8 border-cyan-400/20 shadow-lg shadow-cyan-500/10"
                        >
                            <Smartphone size={18} /> IDENTITY_CORE
                        </motion.button>
                    </div>
                </header>

                <div className="p-14 grid grid-cols-12 gap-10 flex-1">
                    {/* Mission Control (Medium Bento) */}
                    <div className="col-span-8 space-y-10">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="glass-card p-10 flex flex-col">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 mb-8 flex items-center justify-between">
                                    <span className="flex items-center gap-3"><Clock size={18} /> Mission_Timeline</span>
                                    <ChevronRight size={16} className="text-slate-600" />
                                </h3>
                                <div className="space-y-6 flex-1">
                                    {upcomingMissions.map((task, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ x: 5 }}
                                            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-cyan-500/20 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-3 h-3 rounded-full ${task.urgent ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse' : 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]'}`} />
                                                <div>
                                                    <h4 className="text-base font-bold text-white mb-0.5">{task.title}</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{task.type}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-slate-500 font-mono">{task.time}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 relative overflow-hidden flex flex-col justify-center items-center text-center">
                                <Flame size={32} className="text-orange-400 mb-6 drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">Network Rank</h3>
                                <div className="text-6xl font-black text-white tracking-tighter">#04</div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-4 font-bold">Tier: Master Operative</p>
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -right-10 -bottom-10 opacity-5"
                                >
                                    <Trophy size={200} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Active Node Trace (Large Bento) */}
                        <div className="glass-card p-10 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-5">
                                    <Database size={32} className="text-cyan-400" /> Active Node Trace
                                </h3>
                                <div className="flex gap-4">
                                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">Live Feed</button>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {activeEvents.map((event, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.01 }}
                                        className="group flex items-center gap-10 p-6 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer"
                                    >
                                        <div className="text-[11px] font-mono text-slate-600 font-bold uppercase">{event.id}</div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{event.name}</h4>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{event.type}</span>
                                                <span className="h-3 w-[1px] bg-slate-800" />
                                                <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">{event.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-xs font-black text-white bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/10">{event.xp}</span>
                                            <div className="w-10 h-10 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                                                <CheckCircle size={20} className="text-cyan-400 group-hover:text-[#020617] transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Personal Telemetry (Small Side Bento) */}
                    <div className="col-span-4 space-y-10">
                        <div className="glass-card p-12 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-3xl border-4 border-white/5 p-2 mb-10 relative">
                                <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-10 animate-pulse" />
                                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 relative z-10 shadow-2xl shadow-cyan-500/20">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student" alt="User" className="w-full h-full rounded-[14px] bg-[#020617]" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Student Operative</h2>
                            <p className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.4em] mb-12">Access_Node: 01-ALPHA</p>
                            
                            <div className="w-full space-y-8">
                                {[
                                    { label: 'Neural Sync', value: '98%', color: '#22d3ee' },
                                    { label: 'Network Flow', value: '72%', color: '#3b82f6' },
                                    { label: 'Security Res', value: '100%', color: '#22d3ee' },
                                ].map((bar, i) => (
                                    <div key={i} className="text-left">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                            <span className="text-slate-500">{bar.label}</span>
                                            <span className="text-white">{bar.value}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: bar.value }}
                                                transition={{ duration: 1.5, delay: i * 0.2 }}
                                                className="h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                                                style={{ backgroundColor: bar.color }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-10 bg-[#030712] border border-white/5 flex flex-col items-center text-center overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                            <Activity size={32} className="text-cyan-400 mb-6 animate-pulse" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-6">Sector_Vital_Sync</h3>
                            <div className="flex items-end gap-3 h-16 w-full mb-8">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${20 + Math.random() * 80}%` }}
                                        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                                        className="flex-1 bg-cyan-500/20 rounded-full border border-cyan-500/10" 
                                    />
                                ))}
                            </div>
                            <button className="btn-quantum-ghost w-full py-4 text-[10px] font-black uppercase tracking-widest">
                                Expand Telemetry
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
