import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardHeader, StatCard, DataTable } from '../../components/DashboardUI';
import { Calendar, Users, Zap, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/api';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    total_events: 3,
    active_events: 1,
    total_students: 107
  });
  const [events, setEvents] = useState([
    { id: 1, name: 'Workshop on AI', date: 'Apr 10, 2025', status: 'Active', students: 45 },
    { id: 2, name: 'Coding Contest', date: 'Apr 18, 2025', status: 'Draft', students: 0 },
    { id: 3, name: 'Guest Lecture on ML', date: 'Mar 28, 2025', status: 'Completed', students: 62 },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats({
        total_events: res.data.my_events || 3,
        active_events: res.data.active_approvals || 1,
        total_students: res.data.total_registrations || 107
      });
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'name', label: 'Event Name' },
    { key: 'date', label: 'Date' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          val === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
          val === 'Draft' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'students', label: 'Students' },
  ];

  return (
    <Layout>
      <DashboardHeader 
        title="TeacherPortal" 
        subtitle="Manage & Create Events" 
        actions={
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Events" value={stats.total_events} icon={Calendar} gradient="gradient-card-orange" />
        <StatCard title="Active Events" value={stats.active_events} icon={Zap} gradient="gradient-card-green" />
        <StatCard title="Total Students" value={stats.total_students} icon={Users} gradient="gradient-card-purple" />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight italic">My Events</h2>
        </div>
        <DataTable 
          columns={columns} 
          data={events} 
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
    </Layout>
  );
};

export default TeacherDashboard;
