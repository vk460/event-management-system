import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardHeader, DataTable } from '../../components/DashboardUI';
import { Calendar, Download, ChevronRight, Laptop, Music, Microchip, Trophy } from 'lucide-react';
import api from '../../api/api';

const StudentDashboard = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Tech Fest 2025', date: 'Apr 15, 2025', dept: 'Computer Science', icon: Laptop, color: 'gradient-card-orange' },
    { id: 2, name: 'Cultural Night', date: 'Apr 20, 2025', dept: 'Arts', icon: Music, color: 'gradient-card-green' },
    { id: 3, name: 'Science Symposium', date: 'Apr 25, 2025', dept: 'Physics', icon: Microchip, color: 'gradient-card-purple' },
    { id: 4, name: 'Sports Day', date: 'May 1, 2025', dept: 'Sports', icon: Trophy, color: 'gradient-card-indigo' },
  ]);

  const [attendance, setAttendance] = useState([
    { event: 'Workshop on AI', date: 'Mar 10, 2025', dept: 'CS', status: 'Present' },
    { event: 'Hackathon 2025', date: 'Mar 5, 2025', dept: 'CS', status: 'Present' },
  ]);

  const attendanceColumns = [
    { key: 'event', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'dept', label: 'Department' },
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
        title="StudentPortal" 
        subtitle="Your Events & Attendance" 
      />

      <div className="mb-12">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight italic mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
              <div className={`h-32 ${event.color} flex items-center justify-center`}>
                <event.icon size={48} className="text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{event.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Calendar size={14} />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                    {event.dept}
                  </span>
                </div>
                <button className="w-full mt-6 bg-gradient-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95">
                  <span>View Details</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight italic">My Attendance</h2>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition-colors font-bold text-sm">
            <Download size={18} />
            <span>Download CSV</span>
          </button>
        </div>
        <DataTable columns={attendanceColumns} data={attendance} />
      </div>
    </Layout>
  );
};

export default StudentDashboard;
