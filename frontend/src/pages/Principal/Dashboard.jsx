import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  Building, 
  Search,
  FileUp,
  BarChart2,
  Settings,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Eye,
  User,
  Trash2,
  FileText
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Overview Stat Card
const StatCard = ({ label, value, icon: Icon, gradientClass }) => (
  <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
    <div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">{label}</p>
      <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h3>
    </div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${gradientClass}`}>
      <Icon size={28} />
    </div>
  </div>
);

const PrincipalDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const [stats, setStats] = useState({
    total_events: 0,
    student_count: 0,
    teacher_count: 0,
    hod_count: 0,
    pending_approvals: 0
  });

  // Tabs array removed as sidebar handles it

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats({
          total_events: res.data.total_events || 0,
          student_count: res.data.student_count || 0,
          teacher_count: res.data.teacher_count || 0,
          department_count: res.data.department_count || 0,
          hod_count: res.data.hod_count || 0,
          pending_approvals: res.data.pending_approvals || 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewSection stats={stats} />;
      case 'manage_hods': return <ManageHODsSection />;
      case 'event_approval': return <EventApprovalSection />;
      case 'analytics': return <AnalyticsSection />;
      default: return <OverviewSection stats={stats} />;
    }
  };

  return (
    <Layout>
      <div className="max-w-[1400px] animate-in fade-in duration-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
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

// --- SUB-SECTIONS --- //

const OverviewSection = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      <StatCard label="Departments" value={stats.department_count} icon={Building} gradientClass="bg-gradient-to-br from-indigo-500 to-purple-600" />
      <StatCard label="HODs" value={stats.hod_count} icon={Users} gradientClass="bg-gradient-to-br from-orange-500 to-red-500" />
      <StatCard label="Teachers" value={stats.teacher_count} icon={GraduationCap} gradientClass="bg-gradient-to-br from-emerald-400 to-teal-500" />
      <StatCard label="Students" value={stats.student_count} icon={Users} gradientClass="bg-gradient-to-br from-pink-500 to-rose-500" />
      <StatCard label="Total Events" value={stats.total_events} icon={Calendar} gradientClass="bg-gradient-to-br from-blue-500 to-cyan-500" />
      <StatCard label="Pending Action" value={stats.pending_approvals} icon={CheckCircle2} gradientClass="bg-gradient-to-br from-amber-500 to-orange-600" />
    </div>
  </div>
);

const ManageHODsSection = () => {
  const [existingHODs, setExistingHODs] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHods();
  }, []);

  const fetchHods = async () => {
    try {
      const res = await api.get('users/hods/');
      setExistingHODs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
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
    };
    reader.readAsBinaryString(file);
  };

  const handleCommit = async () => {
    setLoading(true);
    try {
      const res = await api.post('users/bulk-hod-upload/', { data: previewData });
      toast.success(res.data.message);
      setPreviewData([]);
      fetchHods();
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all HODs?")) return;
    try {
      await api.delete('users/bulk-hod-delete/');
      toast.success("All HODs deleted.");
      fetchHods();
    } catch (err) {
      toast.error("Failed to delete HODs.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hod?")) return;
    try {
      await api.delete(`users/hods/${id}/`);
      toast.success("Hod deleted successfully!");
      fetchHods();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleSaveEdit = async (id, data) => {
    try {
      await api.patch(`users/hods/${id}/`, data);
      toast.success("HOD updated successfully!");
      fetchHods();
    } catch (err) {
      toast.error("Failed to update HOD.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      {previewData.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <label className="group relative block p-16 border-4 border-dashed border-gray-200 rounded-[40px] cursor-pointer hover:border-orange-500 transition-all text-center bg-white/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <FileUp size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Upload Excel</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Initialize Department Heads</p>
          </label>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase">Preview Data</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{previewData.length} records detected</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setPreviewData([])} className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100">Cancel</button>
              <button disabled={loading} onClick={handleCommit} className="px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all">
                {loading ? "Committing..." : "Commit Data"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  {['Name', 'Email', 'Phone', 'Password', 'Department'].map((h, i) => (
                    <th key={i} className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {previewData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/30">
                    <td className="px-8 py-4 font-black text-gray-900 uppercase">{row.name || row.first_name || row.Name || row.First_Name || '-'}</td>
                    <td className="px-8 py-4 text-gray-500 font-medium">{row.email || row.Email || '-'}</td>
                    <td className="px-8 py-4 font-mono text-gray-600">{row.phone_number || row.phone || row.Phone || '-'}</td>
                    <td className="px-8 py-4 text-gray-500 font-medium">{row.password || row.Password || '******'}</td>
                    <td className="px-8 py-4 font-bold text-orange-500 uppercase">{row.department || row.Department || row.department_code || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden mt-12">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Department Heads</h2>
          <button onClick={handleDeleteAll} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors">
            <Trash2 size={18} /> Delete All HODs
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              {['Name', 'Email', 'Phone', 'Password', 'Department', 'Actions'].map((h, i) => (
                <th key={i} className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {existingHODs.map((hod) => (
              <tr key={hod.id} className="hover:bg-orange-50/20">
                <td className="px-8 py-6 font-black uppercase text-gray-900">{hod.name || hod.first_name || hod.username}</td>
                <td className="px-8 py-6 text-gray-500 font-medium">{hod.email}</td>
                <td className="px-8 py-6 font-mono text-gray-600">{hod.phone_number || '---'}</td>
                <td className="px-8 py-6 text-gray-400 font-medium tracking-widest">******</td>
                <td className="px-8 py-6 font-bold text-orange-500 uppercase">{hod.department_name}</td>
                <td className="px-8 py-6 flex gap-3">
                  {/* Edits/Deletes would hook to individual endpoints */}
                  <button onClick={() => setEditingUser(hod)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Settings size={18} /></button>
                  <button onClick={() => handleDeleteUser(hod.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {existingHODs.length === 0 && (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">No HODs active</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <EditModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} onSave={handleSaveEdit} />
    </div>
  );
};

// Event Section
const StatusBadge = ({ status }) => {
  if (status === 'approved') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-600 border border-green-400">Approved</span>;
  if (status === 'rejected') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-red-500 border border-red-400">Rejected</span>;
  if (status === 'hod_approved') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-orange-500 border border-orange-400">Awaiting Principal</span>;
  if (status === 'pending') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-500 border border-amber-400">Awaiting HOD</span>;
  return <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-400 border border-gray-300">Unknown</span>;
};

const EventDetailModal = ({ event, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
      <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 text-xl">✕</button>
      <div className="w-full h-40 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
        {event.image
          ? <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-xl" />
          : <CalendarDays size={48} className="text-orange-400" />}
      </div>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
        <StatusBadge status={event.status} />
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex gap-2"><CalendarDays size={14} className="text-gray-400 mt-0.5" /><span>{new Date(event.start_time).toLocaleString()}</span></div>
        <div className="flex gap-2"><User size={14} className="text-gray-400 mt-0.5" /><span>{event.created_by_name}</span></div>
        {event.venue && <div className="flex gap-2"><span className="text-gray-400">📍</span><span>{event.venue}</span></div>}
        {event.department_name && <div className="flex gap-2"><span className="text-gray-400">🏫</span><span>{event.department_name}</span></div>}
      </div>
      {event.description && (
        <p className="mt-4 text-sm text-gray-500 border-t pt-4 leading-relaxed">{event.description}</p>
      )}
    </div>
  </div>
);

const EventApprovalSection = () => {
  const [events, setEvents] = useState([]);
  const [eventTab, setEventTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('events/');
      setEvents(res.data);
    } catch (err) {}
  };

  const handleViewReport = async (reportId) => {
    try {
      const res = await api.get(`events/reports/${reportId}/download/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Report not available yet.');
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(ev => ev.status === 'approved' && new Date(ev.end_time || ev.start_time) >= now);
  const completedEvents = events.filter(ev => ev.status === 'approved' && new Date(ev.end_time || ev.start_time) < now);
  const pendingApprovals = events.filter(ev => ev.status === 'hod_approved');

  const getDisplayedData = () => {
    if (eventTab === 'upcoming') return upcomingEvents;
    if (eventTab === 'completed') return completedEvents;
    return pendingApprovals;
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`events/approve/${id}/`, { action });
      toast.success(`Event ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed.');
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Event' },
    { id: 'completed', label: 'Completed Event' },
    { id: 'approve', label: 'Approve Event' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setEventTab(tab.id)}
            className={`flex-1 py-4 text-sm font-semibold transition-all ${
              eventTab === tab.id
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="p-6">
        {getDisplayedData().length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <CalendarDays size={48} className="mx-auto text-orange-200 mb-4" />
            <p className="font-semibold text-sm">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {getDisplayedData().map(ev => (
              <div key={ev.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{ev.title}</h3>
                  <StatusBadge status={ev.status} />
                </div>
                {/* Image placeholder */}
                <div className="w-full h-36 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                  {ev.image
                    ? <img src={ev.image} alt={ev.title} className="w-full h-full object-cover rounded-xl" />
                    : <CalendarDays size={40} className="text-orange-400" />}
                </div>
                {/* Meta */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={14} className="text-gray-400" />
                    <span>{new Date(ev.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} className="text-gray-400" />
                    <span>{ev.created_by_name || ev.department_name || 'Faculty'}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setSelectedEvent(ev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
                    <Eye size={13} /> View Details
                  </button>
                  {eventTab === 'completed' && ev.has_report && (
                    <button onClick={() => handleViewReport(ev.report_id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
                      <FileText size={13} /> View Report
                    </button>
                  )}
                  {eventTab === 'approve' && (
                    <>
                      <button onClick={() => handleAction(ev.id, 'approve')} className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleAction(ev.id, 'reject')} className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

const AnalyticsSection = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('dashboard/analytics/principal/').then(res => {
            setStats(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading || !stats) return <div className="h-[400px] flex items-center justify-center bg-white/50 rounded-[40px] animate-pulse font-bold text-gray-400">Syncing Analytics...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Row 1: Monthly Trends */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Institutional Event Trends</h2>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Monthly distribution of approved events</p>
                    </div>
                    <CalendarDays size={20} className="text-orange-500" />
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.monthly_stats}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff5722" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ff5722" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                            <Area type="monotone" dataKey="total" stroke="#ff5722" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Department Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Events by Dept</h2>
                        <BarChart2 size={20} className="text-orange-500" />
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.department_stats} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'rgba(255,87,34,0.05)'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="event_count" fill="#ff5722" radius={[0, 10, 10, 0]} barSize={20}>
                                    {stats.department_stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff5722' : '#f97316'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Avg. Participation</h2>
                        <Users size={20} className="text-orange-500" />
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.department_stats}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="participation_count" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincipalDashboard;

const EditModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: '', email: '', phone_number: '', password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || user.username || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                password: '' // empty by default
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToPatch = {
                first_name: formData.first_name,
                email: formData.email,
                phone_number: formData.phone_number
            };
            if (formData.password) {
                dataToPatch.password = formData.password;
            }
            await onSave(user.id, dataToPatch);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 transition-colors">
                    ✕
                </button>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Edit User</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                        <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                        <input type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password (Leave blank to keep)</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" placeholder="******" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 mt-4 disabled:opacity-50">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};
