import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Users, Database, Activity, 
    Calendar, Zap, Bell, Search, 
    Plus, ArrowUpRight, Lock, Settings, 
    LayoutGrid, BarChart3, Globe, Smartphone,
    FileText, Layers, MousePointer2,
    ChevronRight, Info, Cpu
} from 'lucide-react';

const HODDashboard = () => {
    const departmentMetrics = [
        { label: 'Active Faculty Nodes', value: '28/30', icon: Users, color: '#22d3ee' },
        { label: 'Resource Allocation', value: '74%', icon: Database, color: '#3b82f6' },
        { label: 'Academic Integrity', value: '96.2%', icon: Activity, color: '#22d3ee' },
        { label: 'Innovation Output', value: '142', icon: Zap, color: '#3b82f6' },
    ];

    const departmentalEvents = [
        { title: 'Curriculum Audit Loop', time: '10:00', status: 'In Review', level: 'Critical' },
        { title: 'Budget Synthesis Hub', time: '14:30', status: 'Scheduled', level: 'High' },
        { title: 'Global Quantum Alliance', time: 'Tomorrow', status: 'Priority', level: 'Admin' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Departmental Control Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'var(--quantum-texture)' }} />
            </div>

            {/* Tactical Sidebar (Quantum Department) */}
            <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-10 z-50 border-r border-white/5 bg-[#030712]/80 backdrop-blur-2xl">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: -45 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] mb-16 shadow-lg shadow-cyan-500/10"
                >
                    <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                        <Layers size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                </motion.div>
                
                <nav className="flex flex-col gap-10">
                    {[LayoutGrid, BarChart3, Database, Globe, Settings].map((Icon, i) => (
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
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5 group cursor-pointer overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=HOD" alt="HOD" className="w-full h-full rounded-[14px]" />
                    </div>
                </div>
            </aside>

            {/* Main Application Surface */}
            <main className="pl-24 min-h-screen relative z-10 flex flex-col">
                {/* Departmental Header */}
                <header className="px-14 py-12 flex justify-between items-center border-b border-white/5 bg-[#020617]/40 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-cyan-400 uppercase">Sector_Control_Active_v10</span>
                        </div>
                        <h1 className="headline-quantum text-5xl">Department<span className="text-white font-light">Authority</span></h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col text-right">
                            <span className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase mb-1">Academic Cycle</span>
                            <span className="text-2xl font-black text-white flex items-center gap-3 justify-end italic font-mono">
                                FY-2024 <span className="text-cyan-500 text-xs tracking-widest uppercase">Active</span>
                            </span>
                        </div>
                        <div className="h-12 w-[1px] bg-white/5" />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-quantum py-4 px-8 border-cyan-400/20 shadow-lg shadow-cyan-500/10"
                        >
                            <Plus size={18} /> INITIALIZE_ALLOCATION
                        </motion.button>
                    </div>
                </header>

                <div className="p-14 space-y-12 flex-1">
                    {/* Performance Indicators grid */}
                    <div className="grid grid-cols-4 gap-8">
                        {departmentMetrics.map((metric, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <metric.icon size={80} strokeWidth={1} />
                                </div>
                                <metric.icon size={26} className="text-cyan-400 mb-6" strokeWidth={1.5} />
                                <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-2">{metric.label}</h3>
                                <p className="text-3xl font-black text-white tracking-tight">{metric.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Operational Core (Bento Layout) */}
                    <div className="grid grid-cols-12 gap-10">
                        {/* Sector Allocation (Large Bento) */}
                        <div className="col-span-7 glass-card p-12 min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-5 text-white">
                                    <Globe className="text-cyan-400" size={32} /> Infrastructure Allocation
                                </h2>
                                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                                    {['Operational', 'Research', 'Tactical'].map((tag, i) => (
                                        <button key={i} className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-5 h-64">
                                {[...Array(16)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.1 + Math.random() * 0.6 }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                                        className="h-full rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-blue-600/20 border border-white/5 flex items-center justify-center relative group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Cpu className="opacity-10 group-hover:opacity-50 transition-opacity text-cyan-400" size={20} />
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center">
                                <div className="flex gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Infrastructure_Load</span>
                                        <span className="text-2xl font-black text-cyan-400 italic font-mono">84.2%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Personnel_Sync</span>
                                        <span className="text-2xl font-black text-white italic font-mono">98.1%</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-16 h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_#22d3ee]" />
                                    <div className="w-16 h-1 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Operational Focus (Small Bento Side) */}
                        <div className="col-span-5 space-y-10 flex flex-col">
                            <div className="glass-card p-10 flex-1 flex flex-col">
                                <h3 className="text-xs font-black tracking-[0.4em] uppercase text-cyan-400 mb-10 flex items-center justify-between">
                                    Mission_Priorities <Activity size={18} />
                                </h3>
                                <div className="space-y-6 flex-1">
                                    {departmentalEvents.map((event, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ x: 5 }}
                                            className="group relative p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${event.status === 'Priority' ? 'text-red-500' : 'text-cyan-400'}`}>{event.status}</span>
                                                <span className="text-[10px] text-slate-500 font-bold font-mono">{event.time}</span>
                                            </div>
                                            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{event.title}</h4>
                                            <div className="absolute right-6 bottom-6 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{event.level}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-10 bg-gradient-to-br from-cyan-500/[0.05] to-blue-600/[0.05] h-48 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                <Database size={32} className="text-cyan-400/40 mb-3" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">Departmental_Archive</h3>
                                <div className="text-4xl font-black text-white italic font-mono">4.2 <span className="text-xl">PB</span></div>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2 font-bold">Total_Synthetic_Data</p>
                                <motion.div 
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-cyan-400/5" 
                                />
                            </div>
                        </div>

                        {/* Archive Feed (Full Width Bottom Bento) */}
                        <div className="col-span-12 glass-card p-12 overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-5 text-white">
                                    <FileText className="text-cyan-400" size={32} /> Administrative Access Logs
                                </h3>
                                <button className="btn-quantum-ghost py-4 px-10 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl">
                                    <Smartphone size={16} /> EXPORT_LOG_CORE
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-8">
                                            <span className="text-[11px] font-mono text-slate-600 font-bold">LN-892{i}</span>
                                            <div className="h-6 w-[1px] bg-slate-800" />
                                            <span className="text-base font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">Quantum_Audit_Protocol_Phase_{i + 1}</span>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest font-mono">Oct 0{i + 1}_2024</span>
                                            <ArrowUpRight size={20} className="text-slate-700 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HODDashboard;
