import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardHeader, StatCard } from '../../components/DashboardUI';
import { Calendar, Users, GraduationCap, Building2, Download } from 'lucide-react';
import api from '../../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    total_events: 35,
    students: 1240,
    teachers: 58,
    departments: 5
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('dashboard/stats/');
      setStats({
        ...stats,
        total_events: res.data.total_events || 35,
        students: res.data.total_users || 1240,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deptData = [
    { name: 'CS', value: 12 },
    { name: 'ECE', value: 8 },
    { name: 'Arts', value: 6 },
    { name: 'Civil', value: 4 },
    { name: 'EEE', value: 5 },
  ];

  const trendData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 6 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 12 },
    { name: 'May', value: 9 },
  ];

  const attendanceData = [
    { name: 'Present', value: 82 },
    { name: 'Absent', value: 18 },
  ];

  const COLORS = ['#10B981', '#F97316'];

  return (
    <Layout>
      <DashboardHeader 
        title="PrincipalPortal" 
        subtitle="Institution Overview" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Events" value={stats.total_events} icon={Calendar} gradient="gradient-card-orange" />
        <StatCard title="Students" value={stats.students} icon={Users} gradient="gradient-card-green" />
        <StatCard title="Teachers" value={stats.teachers} icon={GraduationCap} gradient="gradient-card-purple" />
        <StatCard title="Departments" value={stats.departments} icon={Building2} gradient="gradient-card-indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dept Bar Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="text-xl font-bold mb-8 italic">Events per Department</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="text-xl font-bold mb-8 italic">Monthly Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Line type="monotone" dataKey="value" stroke="#EC4899" strokeWidth={4} dot={{ r: 6, fill: "#EC4899", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Pie Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="text-xl font-bold mb-8 italic">Overall Attendance</h3>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                <span className="text-sm font-bold text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                <span className="text-sm font-bold text-gray-500">Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrincipalDashboard;
