import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardHeader, StatCard, DataTable } from '../../components/DashboardUI';
import { Users, GraduationCap, Building2, Upload } from 'lucide-react';
import api from '../../api/api';

const HODDashboard = () => {
  const [stats, setStats] = useState({
    total_teachers: 3,
    active: 3,
    departments: 1
  });
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Priya Singh', mobile: '9876543210', events: 5, status: 'Active' },
    { id: 2, name: 'Prof. Ravi Patel', mobile: '9123456789', events: 3, status: 'Active' },
    { id: 3, name: 'Dr. Neha Gupta', mobile: '9988776655', events: 7, status: 'Active' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats({
        total_teachers: res.data.teacher_activity || 3,
        active: res.data.teacher_activity || 3,
        departments: 1
      });
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'id', label: '#' },
    { 
      key: 'name', 
      label: 'Name',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {val.split(' ').filter(n => n.length > 1).map(n => n[0]).join('')}
          </div>
          <span>{val}</span>
        </div>
      )
    },
    { key: 'mobile', label: 'Mobile' },
    { key: 'events', label: 'Events' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
          {val}
        </span>
      )
    },
  ];

  return (
    <Layout>
      <DashboardHeader 
        title="HOD Portal" 
        subtitle="Department Management" 
        actions={
          <div className="flex gap-4">
            <select className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20">
              <option>Computer Science</option>
              <option>Information Tech</option>
            </select>
            <button className="btn-primary flex items-center gap-2">
              <Upload size={18} />
              <span>Upload Excel</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Teachers" value={stats.total_teachers} icon={GraduationCap} gradient="gradient-card-orange" />
        <StatCard title="Active" value={stats.active} icon={Users} gradient="gradient-card-green" />
        <StatCard title="Departments" value={stats.departments} icon={Building2} gradient="gradient-card-purple" />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight italic">Department Teachers</h2>
        <DataTable columns={columns} data={teachers} />
      </div>
    </Layout>
  );
};

export default HODDashboard;
