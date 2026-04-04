import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Users, BookOpen, Activity, 
    Calendar, Database, Zap, Bell,
    Search, Plus, ArrowUpRight, Lock,
    Settings, LayoutGrid, Terminal,
    Clipboard, CheckCircle, AlertTriangle,
    ChevronRight, Info
} from 'lucide-react';

const TeacherDashboard = () => {
    const studentPerformance = [
        { name: 'Sector Alpha_9', completion: 92, status: 'Stable', nodes: 24 },
        { name: 'Sector Beta_4', completion: 78, status: 'Monitoring', nodes: 18 },
        { name: 'Sector Gamma_12', completion: 45, status: 'Critical', nodes: 32 },
    ];

    const academicProtocols = [
        { title: 'Project Submission Node', date: 'Sept 24', priority: 'High', type: 'Academic' },
        { title: 'Faculty Sync Protocol', date: 'Sept 28', priority: 'Medium', type: 'Protocol' },
        { title: 'Quantum Lab Audit', date: 'Oct 02', priority: 'Critical', type: 'Security' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Surveillance Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'var(--quantum-texture)' }} />
            </div>

            {/* Sidebar (Operational Quantum) */}
            <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-10 z-50 border-r border-white/5 bg-[#030712]/80 backdrop-blur-2xl transition-all">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-16 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                >
                    <BookOpen size={24} className="text-cyan-400" />
                </motion.div>
                
                <nav className="flex flex-col gap-10">
                    {[LayoutGrid, Clipboard, Calendar, Users, Settings].map((Icon, i) => (
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

                <div className="mt-auto flex flex-col gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5 group cursor-pointer overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" alt="Profile" className="w-full h-full rounded-[14px]" />
                    </div>
                </div>
            </aside>

            {/* Main Application Surface */}
            <main className="pl-24 min-h-screen relative z-10 flex flex-col">
                {/* Header (Surveillance Node) */}
                <header className="px-14 py-12 flex justify-between items-end border-b border-white/5 bg-[#020617]/40 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-cyan-400 uppercase">Sector_Surveillance_Active</span>
                        </div>
                        <h1 className="headline-quantum text-5xl">Professor<span className="text-white font-light">Node</span></h1>
                    </div>

                    <div className="flex gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-quantum py-4 px-8 border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                        >
                            <Plus size={18} /> BROADCAST_MESSAGE
                        </motion.button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card hover:border-cyan-400/20">
                            <Bell size={20} className="text-slate-400" />
                        </button>
                    </div>
                </header>

                <div className="p-14 space-y-10 flex-1">
                    {/* Operational Metrics grid */}
                    <div className="grid grid-cols-4 gap-8">
                        {[
                            { label: 'Networked Students', value: '428', icon: Users, color: '#22d3ee' },
                            { label: 'Evaluation Queue', value: '18', icon: Clipboard, color: '#3b82f6' },
                            { label: 'Sector Integrity', value: 'Optimal', icon: Shield, color: '#22d3ee' },
                            { label: 'Neural Bandwidth', value: 'Encrypted', icon: Zap, color: '#3b82f6' },
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <stat.icon size={80} strokeWidth={1} />
                                </div>
                                <stat.icon size={26} className="text-cyan-400 mb-6" strokeWidth={1.5} />
                                <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</h3>
                                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                                <div className="mt-8 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500/40" style={{ width: '70%' }} />
                                    </div>
                                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Active</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Operational Bento Layout */}
                    <div className="grid grid-cols-12 gap-10">
                        {/* Sector Analysis (Large Bento) */}
                        <div className="col-span-8 glass-card p-12 min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-5 text-white">
                                    <Activity className="text-cyan-400" size={32} /> Sector Completion Meta
                                </h2>
                                <div className="flex gap-4">
                                    <div className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                        <Info size={12} /> Aggregate: 84%
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-10 flex-1">
                                {studentPerformance.map((sector, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${sector.status === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`} />
                                                <span className="text-lg font-bold text-white font-mono">{sector.name}</span>
                                                <div className="h-5 w-[1px] bg-slate-800" />
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network_Nodes: {sector.nodes}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
                                                <span className="text-xl font-bold text-white font-mono">{sector.completion}%</span>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sector.completion}%` }}
                                                transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                                                className={`h-full rounded-full bg-gradient-to-r ${sector.status === 'Critical' ? 'from-red-600/60 to-red-400/80' : 'from-cyan-600/60 to-cyan-400/80'} shadow-lg`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-between pt-10 border-t border-white/5">
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Average_Latency</p>
                                        <p className="text-2xl font-black text-white font-mono italic">24ms <span className="text-xs text-cyan-500">Fast</span></p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Security_Risk</p>
                                        <p className="text-2xl font-black text-cyan-400 font-mono italic">Low <span className="text-xs text-slate-500">Stable</span></p>
                                    </div>
                                </div>
                                <button className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-3 group">
                                    SYNC_SECTOR_DATA <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Academic Protocols (Small Bento) */}
                        <div className="col-span-4 glass-card p-12 bg-[#030712]/80 border border-white/5">
                            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-cyan-400 mb-10 flex items-center justify-between">
                                Protocols <Terminal size={16} />
                            </h3>
                            <div className="space-y-8 flex-1">
                                {academicProtocols.map((protocol, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ x: 5 }}
                                        className="flex gap-5 group cursor-pointer"
                                    >
                                        <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 ${protocol.priority === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse' : protocol.priority === 'High' ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700'}`} />
                                        <div>
                                            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">{protocol.title}</h4>
                                            <div className="flex gap-3 mt-2">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{protocol.date}</span>
                                                <div className="h-3 w-[1px] bg-slate-800" />
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{protocol.type}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-6">
                                <button className="btn-quantum w-full py-5 text-[11px] uppercase tracking-widest font-black">
                                    INITIALIZE_SECTOR_AUDIT
                                </button>
                                <button className="w-full py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl border border-white/5 hover:border-white/10">
                                    CORE_ACCESS_LOGS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
