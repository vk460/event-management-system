import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  PieChart, 
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  PlusCircle,
  FileText,
  CalendarHeart,
  CalendarDays,
  Menu,
  Settings,
  Trophy,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', id: 'overview', icon: LayoutDashboard },
          { name: 'User Management', id: 'users', icon: Users },
          { name: 'Event Management', id: 'events', icon: Calendar },
          { name: 'Security Logs', id: 'logs', icon: ShieldCheck },
          { name: 'Analytics', id: 'analytics', icon: PieChart },
        ];
      case 'principal':
        return [
          { name: 'Overview', id: 'overview', icon: LayoutDashboard },
          { name: 'Manage HODs', id: 'manage_hods', icon: Users },
          { name: 'Event Approval', id: 'event_approval', icon: ClipboardCheck },
          { name: 'Detailed Analytics', id: 'analytics', icon: Settings },
        ];
      case 'hod':
        return [
          { name: 'Overview', id: 'overview', icon: LayoutDashboard },
          { name: 'Manage Teachers', id: 'manage_teachers', icon: GraduationCap },
          { name: 'Department Events', id: 'event_approval', icon: ClipboardCheck },
          { name: 'Participation Analytics', id: 'analytics', icon: Settings },
        ];
      case 'teacher':
        return [
          { name: 'Manage Students', id: 'manage_students', icon: Users },
          { name: 'My Events', id: 'my_events', icon: CalendarDays },
          { name: 'Department Events', id: 'dept_events', icon: CalendarHeart },
          { name: 'Create Event', id: 'create_event', icon: PlusCircle },
          { name: 'Generate Report', id: 'reports', icon: FileText },
          { name: 'Analytics', id: 'analytics', icon: PieChart },
        ];
      case 'student':
        return [
          { name: 'Upcoming Events', id: 'events_view', icon: CalendarDays },
          { name: 'My Participation', id: 'participation', icon: Trophy },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const basePath = `/${user?.role || 'login'}/dashboard`;

  return (
    <div className="w-72 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl fixed left-0 top-0 z-40 flex flex-col pt-20"> {/* pt-20 to clear header */}
      <div className="px-6 py-6 pb-2 border-b border-gray-100 flex items-center gap-3">
         <Menu className="text-gray-400" size={20}/>
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Navigation Menu</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <NavLink
              key={link.id}
              to={`${basePath}?tab=${link.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <link.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-4">SKN Event System</p>
      </div>
    </div>
  );
};

export default Sidebar;
