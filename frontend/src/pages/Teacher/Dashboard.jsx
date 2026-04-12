import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  Users, 
  CalendarPlus,
  CalendarHeart,
  CalendarDays,
  FileText,
  FileUp,
  Trash2,
  Settings,
  CheckCircle2,
  XCircle,
  Eye,
  User
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TeacherDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'manage_students';
  
  const [stats, setStats] = useState({});

  // Tabs array removed as sidebar handles it

  const renderContent = () => {
    switch(activeTab) {
      case 'manage_students': return <ManageStudentsSection />;
      case 'my_events': return <MyEventsSection />;
      case 'dept_events': return <DeptEventsSection />;
      case 'create_event': return <CreateEventSection />;
      case 'reports': return <ReportGenerationSection />;
      case 'analytics': return <AnalyticsSection />;
      default: return <ManageStudentsSection />;
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

const ManageStudentsSection = () => {
  const [existingStudents, setExistingStudents] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('users/students/');
      setExistingStudents(res.data);
    } catch (err) { }
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
      const res = await api.post('users/bulk-student-upload/', { data: previewData });
      toast.success(res.data.message);
      setPreviewData([]);
      fetchStudents();
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all Students in your department?")) return;
    try {
      await api.delete('users/bulk-student-delete/');
      toast.success("All Students deleted.");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete Students.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`users/students/${id}/`);
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleSaveEdit = async (id, data) => {
    try {
      await api.patch(`users/students/${id}/`, data);
      toast.success("Student updated successfully!");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to update Student.");
    }
  };

  return (
    <div className="space-y-8">
      {previewData.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <label className="group relative block p-16 border-4 border-dashed border-gray-200 rounded-[40px] cursor-pointer hover:border-orange-500 transition-all text-center bg-white/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <FileUp size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase">Upload Student Excel</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Initialize Department Roster</p>
          </label>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase">Preview Students</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{previewData.length} records ready</p>
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
                    <td className="px-8 py-4 font-black text-gray-900 uppercase">{row.department || row.Department || '-'}</td>
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
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Student Roster</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Management of enrolled participants</p>
          </div>
          <button onClick={handleDeleteAll} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors">
            <Trash2 size={18} /> Delete All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Name', 'Email', 'Phone', 'Password', 'Department', 'Actions'].map((h, i) => (
                  <th key={i} className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {existingStudents.map((s) => (
                <tr key={s.id} className="hover:bg-orange-50/20">
                  <td className="px-8 py-6 font-black uppercase text-gray-900">{s.name || s.first_name || s.username}</td>
                  <td className="px-8 py-6 text-gray-500 font-medium">{s.email}</td>
                  <td className="px-8 py-6 font-mono text-gray-600">{s.phone_number}</td>
                  <td className="px-8 py-6 text-gray-400 font-mono italic">******</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 italic">
                      {s.department_name || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-8 py-6 flex gap-2">
                    <button onClick={() => setEditingUser(s)} className="p-3 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-2xl transition-all"><Settings size={18} /></button>
                    <button onClick={() => handleDeleteUser(s.id)} className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal 
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)} 
        user={editingUser} 
        onSave={handleSaveEdit}
      />
    </div>
  );
};


const MyEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [eventTab, setEventTab] = useState('upcoming'); // 'upcoming' or 'completed'
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('events/'); // Typically filtered by creator
      setEvents(res.data);
    } catch (err) { }
  };

  const now = new Date();
  const upcomingEvents = events.filter(ev => new Date(ev.end_time || ev.start_time) >= now);
  const completedEvents = events.filter(ev => new Date(ev.end_time || ev.start_time) < now);

  const displayedEvents = eventTab === 'upcoming' ? upcomingEvents : completedEvents;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">My Events Data</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setEventTab('upcoming')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${eventTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setEventTab('completed')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${eventTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Completed
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Event Name', 'Date & Time', 'Status', 'Actions'].map((h, i) => (
                <th key={i} className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedEvents.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">No {eventTab} events</td></tr>
            ) : (
                displayedEvents.map(ev => (
                    <tr key={ev.id} className="hover:bg-orange-50/20">
                        <td className="px-8 py-6 font-black uppercase text-gray-900">{ev.title}</td>
                        <td className="px-8 py-6 text-gray-500 font-medium">{new Date(ev.start_time).toLocaleString()}</td>
                        <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ev.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'}`}>{ev.status}</span></td>
                        <td className="px-8 py-6 flex gap-2">
                           <button className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg"><Eye size={16}/></button>
                           {eventTab === 'upcoming' && (
                             <>
                               <button className="p-2 bg-gray-50 text-gray-400 hover:text-orange-500 transition-colors rounded-lg"><Settings size={16}/></button>
                               <button className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                             </>
                           )}
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
    </div>
  );
};

const DeptEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [eventTab, setEventTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

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
  const myEvents = events.filter(ev => ev.created_by_email === user?.email);

  const getDisplayedData = () => {
    if (eventTab === 'upcoming') return upcomingEvents;
    if (eventTab === 'completed') return completedEvents;
    return myEvents;
  };

  const StatusBadge = ({ status }) => {
    if (status === 'approved') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-600 border border-green-400">Approved</span>;
    if (status === 'rejected') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-red-500 border border-red-400">Rejected</span>;
    if (status === 'hod_approved') return <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-500 border border-amber-400">HOD Approved</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-500 border border-amber-400">Pending</span>;
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Event' },
    { id: 'completed', label: 'Completed Event' },
    { id: 'my', label: 'My Event' },
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
                  {eventTab === 'my' && ev.status === 'rejected' && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400 text-amber-600 text-xs font-semibold hover:bg-amber-50 transition-colors">
                      <Settings size={13} /> Re-submit
                    </button>
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
        api.get('dashboard/analytics/department/').then(res => {
            setStats(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading || !stats) return <div className="h-[400px] flex items-center justify-center bg-white/50 rounded-[40px] animate-pulse font-bold text-gray-400 font-bold">Syncing Personal Analytics...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10 mt-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Event Timeline</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Your event distribution by month</p>
                    </div>
                    <CalendarDays size={20} className="text-orange-500" />
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.monthly_event_count}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff5722" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ff5722" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Area type="monotone" dataKey="total" stroke="#ff5722" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10 mt-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Success Rate</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Participants per event</p>
                    </div>
                    <BarChart2 size={20} className="text-orange-500" />
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.participation_per_event}>
                      <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="count" fill="#ff5722" radius={[10, 10, 0, 0]} barSize={30}>
                        {stats.participation_per_event.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff5722' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const CreateEventSection = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', date: '', time: '', description: '', flyer: null
    });

    const handleFile = (e) => setFormData({...formData, flyer: e.target.files[0]});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.date && formData.time) {
            // Combine date and time to ISO string
            const combined = new Date(`${formData.date}T${formData.time}`).toISOString();
            data.append('start_time', combined);
        }
        if (formData.flyer) {
            data.append('file', formData.flyer);
            data.append('image', formData.flyer);
        }

        try {
            await api.post('events/create/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Event proposed successfully!");
            setFormData({title: '', date: '', time: '', description: '', flyer: null});
        } catch (err) {
            toast.error("Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Propose New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Event Name</label>
                   <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-medium" placeholder="Annual Tech Symposium" />
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                       <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-medium text-gray-600" />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time</label>
                       <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-medium text-gray-600" />
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Event Flyer / Poster</label>
                   <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-orange-400 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileUp className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{formData.flyer ? formData.flyer.name : "Click to upload image"}</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                      </label>
                  </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                   <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-medium" placeholder="Event details..."></textarea>
               </div>

               <button disabled={loading} type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 disabled:opacity-50">
                   {loading ? "Submitting..." : "Submit Event for Approval"}
               </button>
            </form>
        </div>
    );
};

const ReportGenerationSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        event_id: '', participants_count: '', objective: '', description: '', outcome: '',
        poster: null, participant_list: null, certificates: null
    });

    useEffect(() => {
        api.get('events/').then(res => {
            // Include only APPROVED events
            setEvents(res.data.filter(ev => ev.status === 'approved'));
        }).catch(err => console.log(err));
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleFile = (e) => setFormData({...formData, [e.target.name]: e.target.files[0]});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if(formData[key]) data.append(key, formData[key]);
        });
        
        try {
            await api.post('events/reports/create/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Comprehensive Report Generated!");
            e.target.reset();
            setFormData({
                event_id: '', participants_count: '', objective: '', description: '', outcome: '',
                poster: null, participant_list: null, certificates: null
            });
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Generate Post-Event Report</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Event</label>
                   <select required name="event_id" onChange={handleChange} value={formData.event_id} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-medium">
                       <option value="">Select an approved & completed event...</option>
                       {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                   </select>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Participants Count</label>
                       <input required type="number" name="participants_count" onChange={handleChange} value={formData.participants_count} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 font-medium" />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Objective</label>
                   <textarea required rows="2" name="objective" onChange={handleChange} value={formData.objective} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 font-medium"></textarea>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                   <textarea required rows="2" name="description" onChange={handleChange} value={formData.description} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 font-medium"></textarea>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Outcome</label>
                   <textarea required rows="2" name="outcome" onChange={handleChange} value={formData.outcome} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 font-medium"></textarea>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <label className="border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:border-orange-500 bg-white">
                        <FileUp className="mx-auto mb-2 text-gray-400"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{formData.poster ? formData.poster.name : 'Upload Photos'}</span>
                        <input type="file" name="poster" className="hidden" onChange={handleFile}/>
                    </label>
                    <label className="border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:border-orange-500 bg-white">
                        <FileUp className="mx-auto mb-2 text-gray-400"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{formData.participant_list ? formData.participant_list.name : 'Participant List'}</span>
                        <input type="file" name="participant_list" className="hidden" onChange={handleFile}/>
                    </label>
                    <label className="border border-gray-200 p-4 rounded-xl text-center cursor-pointer hover:border-orange-500 bg-white">
                        <FileUp className="mx-auto mb-2 text-gray-400"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{formData.certificates ? formData.certificates.name : 'Certificates'}</span>
                        <input type="file" name="certificates" className="hidden" onChange={handleFile}/>
                    </label>
                </div>

                <button disabled={loading} type="submit" className="w-full mt-8 py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01] disabled:opacity-50">
                   {loading ? "Generating..." : "Generate Comprehensive Report"}
               </button>
            </form>
        </div>
    );
};

export default TeacherDashboard;

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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          event.status === 'approved' ? 'text-green-600 border-green-400' :
          event.status === 'rejected' ? 'text-red-500 border-red-400' :
          'text-amber-500 border-amber-400'}`}>{event.status.replace('_', ' ')}</span>
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
