import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  Building, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  PlusCircle,
  LayoutDashboard,
  Search,
  ShieldAlert,
  Filter,
  CheckCircle2,
  Clock3,
  SearchCode,
  ArrowRight,
  MapPin,
  Tag,
  FileText,
  Edit3,
  Database,
  Trash2,
  HardHat,
  Monitor,
  Radio,
  Settings,
  Zap,
  Brain,
  Check,
  X,
  Plus
} from 'lucide-react';
import api from '../../api/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const PrincipalDashboard = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState({
    total_events: 35,
    student_count: 12,
    teacher_count: 58,
    department_count: 5
  });
  const [loading, setLoading] = useState(true);
  const path = location.pathname;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch principal stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (path.includes('/departments')) return <DepartmentsSection />;
    if (path.includes('/events')) return <EventsSection />;
    if (path.includes('/upload')) return <UploadSection />;
    return <OverviewSection stats={stats} />;
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-gray-400" />
            <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Institution Overview</p>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">PrincipalPortal</h1>
        </header>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
};

/* --- Sub-Sections --- */

const OverviewSection = ({ stats }) => {
  const chartData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 6 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 12 },
    { name: 'May', value: 10 },
  ];

  const barData = [
    { name: 'CS', value: 12, fill: '#F97316' },
    { name: 'ECE', value: 8, fill: '#F97316' },
    { name: 'Arts', value: 6, fill: '#F97316' },
    { name: 'Civil', value: 5, fill: '#F97316' },
    { name: 'EEE', value: 3, fill: '#F97316' },
  ];

  const pieData = [
    { name: 'Present', value: 70, fill: '#10B981' },
    { name: 'Absent', value: 15, fill: '#F97316' },
    { name: 'On Leave', value: 15, fill: '#A855F7' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Events" 
          value={stats.total_events} 
          icon={Calendar} 
          variant="orange" 
        />
        <StatCard 
          label="Students" 
          value={stats.student_count} 
          icon={Users} 
          variant="green" 
        />
        <StatCard 
          label="Teachers" 
          value={stats.teacher_count} 
          icon={GraduationCap} 
          variant="purple" 
        />
        <StatCard 
          label="Departments" 
          value={stats.department_count} 
          icon={Building} 
          variant="indigo" 
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Dept Bar Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 text-gray-900 italic">Events per Department</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 text-gray-900 italic">Monthly Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#EC4899" strokeWidth={4} fill="none" dot={{ r: 6, fill: '#EC4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Attendance */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black mb-10 text-gray-900 italic">Overall Attendance</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const DepartmentsSection = () => {
  const defaultDepts = [
    { id: 1, name: 'Computer', code: 'CS' },
    { id: 2, name: 'Civil', code: 'CIVIL' },
    { id: 3, name: 'ENTC', code: 'ENTC' },
    { id: 4, name: 'Mechanical', code: 'MECH' },
    { id: 5, name: 'Electrical', code: 'ELEC' },
    { id: 6, name: 'AI/DS', code: 'AI/DS' },
  ];
  const [departments, setDepartments] = useState(defaultDepts);
  const [selectedDept, setSelectedDept] = useState(null);
  const defaultEvents = [
    { id: 101, title: 'Hackathon 2026', description: 'Annual coding competition', event_date: '2026-05-15', status: 'upcoming' },
    { id: 102, title: 'Tech Fest', description: 'Technology exhibition and demos', event_date: '2026-04-20', status: 'upcoming' },
    { id: 103, title: 'Bridge Design', description: 'Bridge model competition', event_date: '2026-05-20', status: 'upcoming' },
    { id: 104, title: 'Code Sprint', description: '24-hour coding sprint', event_date: '2026-03-10', status: 'completed', attendance_count: 120 },
    { id: 105, title: 'Site Visit', description: 'Industrial site visit', event_date: '2026-02-15', status: 'completed', attendance_count: 45 },
  ];
  const [events, setEvents] = useState(defaultEvents);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('events/');
      if (res.data && res.data.length > 0) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error("Using default events due to API error:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('events/departments/');
      if (res.data && res.data.length > 0) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error("Using default departments due to API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeptEvents = async (dept) => {
    setSelectedDept(dept);
    try {
      const res = await api.get(`events/?department_id=${dept.id}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDeptStyles = (code) => {
    const styles = {
      'CS': { bg: 'bg-[#F97316]', icon: Monitor },
      'CIVIL': { bg: 'bg-[#22C55E]', icon: HardHat },
      'ENTC': { bg: 'bg-[#7C3AED]', icon: Radio },
      'MECH': { bg: 'bg-[#0EA5E9]', icon: Settings },
      'ELEC': { bg: 'bg-[#F59E0B]', icon: Zap },
      'AI/DS': { bg: 'bg-[#D946EF]', icon: Brain },
    };
    return styles[code] || { bg: 'bg-gray-500', icon: Building };
  };

  const filteredEvents = events.filter(event => {
    const isCompleted = event.status === 'completed' || new Date(event.event_date) < new Date();
    return activeTab === 'upcoming' ? !isCompleted : isCompleted;
  });

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {departments.map((dept) => {
            const { bg, icon: Icon } = getDeptStyles(dept.code);
            const isActive = selectedDept?.id === dept.id;
            
            return (
              <div 
                key={dept.id} 
                onClick={() => fetchDeptEvents(dept)}
                className={`group cursor-pointer p-5 rounded-2xl transition-all duration-300 relative ${bg} ${
                  isActive ? 'ring-2 ring-offset-2 ring-gray-900 scale-105 z-10 shadow-2xl' : 'hover:scale-105 shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-3 text-center text-white relative z-10">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest">{dept.name}</h3>
                </div>
                <div className="absolute right-2 bottom-2 opacity-10 text-white -rotate-12 group-hover:rotate-0 transition-transform">
                    <Icon size={60} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
           <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">All Events</h2>
           <div className="flex gap-10 border-b-2 border-gray-100">
              {['upcoming', 'completed'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-black transition-all relative ${
                        activeTab === tab ? 'text-gray-900 border-b-4 border-orange-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
                  </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100 shadow-inner">
                  <Calendar size={48} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-gray-300 font-black uppercase tracking-[5px] text-[10px]">Registry Empty</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
    return <DepartmentsSection />;
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const isCompleted = event.status === 'completed' || new Date(event.event_date) < new Date();
  
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase leading-tight">{event.title}</h4>
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
              isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'
          }`}>
              {isCompleted ? 'completed' : 'upcoming'}
          </span>
        </div>
        
        <p className="text-gray-400 text-[11px] font-bold line-clamp-2 leading-relaxed h-8">{event.description}</p>
        
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <Calendar size={12} className="text-orange-500" /> {new Date(event.event_date).toLocaleDateString()}
            </div>
            {isCompleted && (
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <Users size={12} className="text-emerald-500" /> 120
                </div>
            )}
        </div>

        <div className="pt-2">
            {isCompleted ? (
                <button className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#16A34A] transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
                    <FileText size={14} /> Download Report
                </button>
            ) : (
                <button 
                  onClick={() => navigate(`/principal/events/${event.id}`)}
                  className="w-full bg-[#F97316] text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#EA580C] transition-all shadow-lg shadow-orange-500/10 active:scale-95"
                >
                    <Search size={14} /> View Details
                </button>
            )}
        </div>
      </div>
    </div>
  );
};


const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [existingHods, setExistingHods] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHODId, setEditingHODId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchHods();
    fetchDepartments();
  }, []);

  const fetchHods = async () => {
    try {
      const res = await api.get('users/hods/');
      setExistingHods(res.data);
    } catch (err) {
      console.error("Failed to fetch HODs", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('events/departments/');
      setAllDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          
          const normalized = data.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
              const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
              newRow[cleanKey] = row[key];
            });
            return newRow;
          });
          setPreviewData(normalized);
        } catch (err) {
          setError("Failed to parse file. Please upload a valid Excel or CSV.");
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleCellEdit = (index, field, value) => {
    const updated = [...previewData];
    updated[index][field] = value;
    setPreviewData(updated);
  };

  const removeRow = (index) => {
      setPreviewData(previewData.filter((_, i) => i !== index));
  };

  const handleCommit = async () => {
    if (previewData.length === 0) {
      setError("No data to upload.");
      return;
    }

    setUploading(true);
    setResult(null);
    setError(null);

    try {
      const res = await api.post('users/bulk-hod-upload/', { data: previewData });
      setResult(res.data);
      if (res.data.skipped && res.data.skipped.length === 0) {
          setPreviewData([]);
          setFile(null);
          // Auto refresh the inventory
          fetchHods();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to commit data to database.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteHOD = async (id) => {
      if (window.confirm("Are you sure you want to delete this HOD?")) {
          try {
              await api.delete(`users/hods/${id}/`);
              fetchHods();
          } catch (err) {
              console.error(err);
              alert("Failed to delete HOD");
          }
      }
  };

  const startEditingHOD = (hod) => {
      setEditingHODId(hod.id);
      setEditFormData({ 
          first_name: hod.first_name, 
          email: hod.email, 
          phone_number: hod.phone_number,
          department: hod.department 
      });
  };

  const handleSaveHOD = async (id) => {
      try {
          await api.patch(`users/hods/${id}/`, editFormData);
          setEditingHODId(null);
          fetchHods();
      } catch (err) {
          console.error(err);
          alert("Failed to update HOD");
      }
  };

  return (
    <div className="space-y-12">
      {/* Upload Section */}
      <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
        {previewData.length === 0 ? (
            <div className="max-w-md mx-auto space-y-8 py-8 text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                <PlusCircle className="text-orange-500" size={48} />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Bulk Initialize HODs</h2>
                    <p className="text-gray-500 font-medium">Upload institutional directory to preview faculty credentials.</p>
                </div>

                <label className="cursor-pointer block border-2 border-dashed border-gray-100 rounded-[24px] p-12 hover:border-orange-500/50 transition-all group">
                    <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl text-gray-400 group-hover:text-orange-500 transition-colors">
                            <SearchCode size={32} />
                        </div>
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Select Institutional File</span>
                    </div>
                </label>
                {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}
            </div>
        ) : (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase">Data Preview</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase">{previewData.length} records detected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                                isEditing ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <Edit3 size={16} /> {isEditing ? 'Lock' : 'Edit'}
                        </button>
                        <button 
                            onClick={handleCommit}
                            disabled={uploading}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-orange-600 transition-all"
                        >
                            {uploading ? 'Processing...' : 'Commit to Database'}
                        </button>
                    </div>
                </div>

                <div className="border border-gray-200 overflow-hidden shadow-sm rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900">
                                    {['Name', 'Email', 'Phone Number', 'Dept Code', 'Actions'].map((head, i) => (
                                        <th key={i} className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest border-r border-gray-800">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {previewData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 border-r border-gray-100 italic font-black text-gray-900">
                                            {isEditing ? <input className="border-b border-orange-200 focus:border-orange-500 outline-none w-full bg-orange-50/10 px-1" value={row.name} onChange={(e)=>handleCellEdit(idx,'name',e.target.value)} /> : row.name}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-100 text-sm font-bold text-gray-500">
                                            {isEditing ? <input className="border-b border-orange-200 focus:border-orange-500 outline-none w-full bg-orange-50/10 px-1" value={row.email} onChange={(e)=>handleCellEdit(idx,'email',e.target.value)} /> : row.email}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-100 text-sm font-bold text-gray-900">
                                            {isEditing ? <input className="border-b border-orange-200 focus:border-orange-500 outline-none w-full bg-orange-50/10 px-1" value={row.phone_number} onChange={(e)=>handleCellEdit(idx,'phone_number',e.target.value)} /> : row.phone_number}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-100 text-center">
                                            {isEditing ? (
                                                <input 
                                                    className="border-b border-orange-500 text-[10px] font-black uppercase text-gray-900 bg-orange-50 px-2 py-1 rounded w-20 text-center outline-none" 
                                                    value={row.department_code} 
                                                    onChange={(e)=>handleCellEdit(idx,'department_code',e.target.value)} 
                                                />
                                            ) : (
                                                <span className="text-[10px] font-black uppercase text-gray-900 bg-gray-100 px-3 py-1 rounded">{row.department_code}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => removeRow(idx)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Verified Inventory Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Institutional Inventory</h2>
            <div className="h-[2px] flex-grow bg-gray-100"></div>
            <span className="px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">{existingHods.length} Verified HODs</span>
        </div>

        <div className="bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-900">
                            {['Name', 'Email/Identifier', 'Phone Number', 'Department', 'Access Control'].map((head, i) => (
                                <th key={i} className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-widest border-r border-white/10">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-900">
                        {existingHods.map((hod) => (
                            <tr key={hod.id} className="hover:bg-orange-50/50 transition-colors">
                                <td className="px-6 py-5 border-r-2 border-gray-900">
                                    {editingHODId === hod.id ? (
                                        <input 
                                            className="border-2 border-orange-500 px-3 py-1 text-sm font-black italic outline-none w-full"
                                            value={editFormData.first_name}
                                            onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                                        />
                                    ) : (
                                        <span className="text-sm font-black text-gray-900 italic uppercase">{hod.username}</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 border-r-2 border-gray-900 text-sm font-bold text-gray-500">
                                    {editingHODId === hod.id ? (
                                        <input 
                                            className="border-2 border-orange-500 px-3 py-1 text-sm font-bold outline-none w-full"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                        />
                                    ) : (
                                        hod.email
                                    )}
                                </td>
                                <td className="px-6 py-5 border-r-2 border-gray-900 text-sm font-black text-gray-900">
                                    {editingHODId === hod.id ? (
                                        <input 
                                            className="border-2 border-orange-500 px-3 py-1 text-sm font-black outline-none w-full"
                                            value={editFormData.phone_number}
                                            onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})}
                                        />
                                    ) : (
                                        hod.phone_number
                                    )}
                                </td>
                                <td className="px-6 py-5 border-r-2 border-gray-900 text-center">
                                    {editingHODId === hod.id ? (
                                        <select 
                                            className="border-2 border-orange-500 px-2 py-1 text-[10px] font-black uppercase outline-none w-full bg-orange-50"
                                            value={editFormData.department || ''}
                                            onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                                        >
                                            <option value="">Select Dept</option>
                                            {allDepartments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.code}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase text-white bg-gray-900 px-4 py-1.5 skew-x-[-12deg] inline-block">{hod.department_code || 'N/A'}</span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4 justify-center">
                                        {editingHODId === hod.id ? (
                                           <div className="flex gap-2">
                                                <button onClick={() => handleSaveHOD(hod.id)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 shadow-sm"><Check size={16} /></button>
                                                <button onClick={() => setEditingHODId(null)} className="bg-gray-100 text-gray-500 p-2 rounded-lg hover:bg-gray-200"><X size={16} /></button>
                                           </div>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditingHOD(hod)} className="text-gray-400 hover:text-orange-500 transition-colors"><Edit3 size={18} /></button>
                                                <button onClick={() => handleDeleteHOD(hod.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

/* --- Stat Card Component --- */

const StatCard = ({ label, value, icon: Icon, variant }) => {
  const variants = {
    orange: 'bg-orange-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
  };

  return (
    <div className={`${variants[variant]} p-8 rounded-2xl text-white shadow-lg relative overflow-hidden group`}>
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
            <p className="text-5xl font-black tracking-tighter">{value}</p>
            <h3 className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{label}</h3>
        </div>
        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
           <Icon size={24} className="text-white" />
        </div>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Icon size={120} className="text-white" />
    </div>
    </div>
  );
};

export default PrincipalDashboard;
