import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  Calendar, 
  Trophy, 
  CheckCircle,
  XCircle,
  CalendarDays,
  Activity
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'events_view';

  // Tabs array removed as sidebar handles it

  const renderContent = () => {
    switch(activeTab) {
      case 'events_view': return <EventsViewSection user={user} />;
      case 'participation': return <ParticipationSection user={user} />;
      default: return <EventsViewSection user={user} />;
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

const EventsViewSection = ({ user }) => {
    const [events, setEvents] = useState([]);
    
    useEffect(() => {
      fetchEvents();
    }, []);
  
    const fetchEvents = async () => {
      try {
        const res = await api.get('events/'); // Fetch approved events
        setEvents(res.data);
      } catch (err) { }
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.length === 0 ? (
              <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-10 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest">No Events Available</p>
              </div>
          ) : (
              events.map((event) => (
                  <div key={event.id} className="bg-white/80 backdrop-blur-xl border border-gray-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                      <div className="w-full h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                         {/* Placeholder for Event Flyer */}
                         <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                             <Calendar size={48} />
                         </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight mb-2">{event.title}</h3>
                      <div className="space-y-1 mb-4">
                         <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2">
                             <CalendarDays size={14} className="text-orange-500" /> {new Date(event.start_time || event.date).toLocaleDateString()}
                         </p>
                         <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2">
                             <Activity size={14} className="text-orange-500" /> Dept: {event.department || 'General'}
                         </p>
                      </div>
                      <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-orange-500 transition-colors">
                          View & Register
                      </button>
                  </div>
              ))
          )}
      </div>
    );
  };
  
const ParticipationSection = ({ user }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-2xl p-8">
        <div className="border-b border-gray-100 pb-6 mb-6">
           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Participation Record</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Event Name', 'Date', 'Status'].map((h, i) => (
                <th key={i} className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {/* Mock Data for UI demonstration */}
             <tr className="hover:bg-orange-50/20">
                <td className="px-8 py-6 font-black uppercase text-gray-900">Tech Symposium 2024</td>
                <td className="px-8 py-6 text-gray-500 font-medium">10/12/2024</td>
                <td className="px-8 py-6">
                    <span className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full w-max text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle size={14} /> Attended
                    </span>
                </td>
             </tr>
             <tr className="hover:bg-orange-50/20">
                <td className="px-8 py-6 font-black uppercase text-gray-900">Guest Lecture: AI Trends</td>
                <td className="px-8 py-6 text-gray-500 font-medium">11/15/2024</td>
                <td className="px-8 py-6">
                    <span className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full w-max text-[10px] font-bold uppercase tracking-wider">
                        <XCircle size={14} /> Registered, Did Not Attend
                    </span>
                </td>
             </tr>
          </tbody>
        </table>
    </div>
);

export default StudentDashboard;
