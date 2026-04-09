import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardHeader, StatCard, TabBar, DataTable } from '../../components/DashboardUI';
import { Users, Calendar, ShieldCheck, PieChart, Plus, Edit2, Trash2, ShieldAlert, Zap } from 'lucide-react';
import api from '../../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({
    total_users: 1304,
    active_events: 12,
    login_today: 156,
    failed_attempts: 3
  });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get('dashboard/stats/').catch(() => ({ data: stats })),
        api.get('dashboard/reports/').catch(() => ({ data: { activity_logs: [] } }))
      ]);
      
      // Merge real stats with placeholders for metrics not in backend yet
      setStats({
        ...stats,
        total_users: statsRes.data.total_users || 1304,
        active_events: statsRes.data.total_events || 12,
        failed_attempts: statsRes.data.security_logs || 3
      });

      setLogs(logsRes.data.activity_logs || []);

      // Fake user data for now if backend doesn't have a list endpoint
      setUsers([
        { id: 1, name: 'Rahul Sharma', role: 'Student', department: 'CS', status: 'Active' },
        { id: 2, name: 'Dr. Priya Singh', role: 'Teacher', department: 'CS', status: 'Active' },
        { id: 3, name: 'Prof. Anand Kumar', role: 'HOD', department: 'CS', status: 'Active' },
        { id: 4, name: 'Megha Gupta', role: 'Student', department: 'Arts', status: 'Inactive' },
        { id: 5, name: 'Vikram Singh', role: 'Teacher', department: 'Physics', status: 'Active' },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
  ];

  const userColumns = [
    { key: 'id', label: '#' },
    { 
      key: 'name', 
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <span>{val}</span>
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (val) => (
        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-500">
          {val}
        </span>
      )
    },
    { key: 'department', label: 'Department' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          val === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const logColumns = [
    { 
      key: 'timestamp', 
      label: 'Time', 
      render: (val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
    { 
      key: 'user__username', 
      label: 'User',
      render: (val) => <span className="font-bold text-gray-800">{val || 'Unknown'}</span>
    },
    { 
      key: 'action', 
      label: 'Action', 
      render: (val) => (
        <span className="text-gray-600 font-medium capitalize">{val.replace('_', ' ')}</span>
      )
    },
    { 
      key: 'ip_address', 
      label: 'IP Address',
      render: (val) => <span className="font-mono text-gray-500 text-xs">{val || '---'}</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          val === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <Layout>
      <DashboardHeader 
        title="AdminPortal" 
        subtitle="System Administration" 
        actions={
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>Add User</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.total_users} icon={Users} gradient="gradient-card-orange" />
        <StatCard title="Active Events" value={stats.active_events} icon={Calendar} gradient="gradient-card-green" />
        <StatCard title="Login Today" value={stats.login_today} icon={Zap} gradient="gradient-card-purple" />
        <StatCard title="Failed Attempts" value={stats.failed_attempts} icon={ShieldAlert} gradient="gradient-card-indigo" />
      </div>

      <TabBar 
        tabs={[
          { id: 'users', label: 'User Management' },
          { id: 'logs', label: 'Security Logs' },
          { id: 'analytics', label: 'Analytics' },
        ]} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight italic">All Users</h2>
          </div>
          <DataTable 
            columns={userColumns} 
            data={users} 
            actions={() => (
              <>
                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          />
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-primary shadow-sm border border-orange-200">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Security Logs</h2>
          </div>
          <DataTable columns={logColumns} data={logs} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 italic">Weekly User Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 italic">Failed Login Attempts</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#areaGradient)" />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
