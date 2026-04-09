import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  PieChart, 
  LogOut, 
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  PlusCircle,
  FileUp,
  History,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
          { name: 'User Management', icon: Users, path: '/admin/users' },
          { name: 'Event Management', icon: Calendar, path: '/admin/events' },
          { name: 'Security Logs', icon: ShieldCheck, path: '/admin/logs' },
          { name: 'Analytics', icon: PieChart, path: '/admin/analytics' },
        ];
      case 'hod':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/hod/dashboard' },
          { name: 'Teachers', icon: GraduationCap, path: '/hod/teachers' },
          { name: 'Approve Events', icon: ClipboardCheck, path: '/hod/approve' },
          { name: 'Analytics', icon: BarChart2, path: '/hod/analytics' },
          { name: 'Upload Teachers', icon: FileUp, path: '/hod/upload' },
        ];
      case 'principal':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/principal/dashboard' },
          { name: 'Departments', icon: Users, path: '/principal/departments' },
          { name: 'Events', icon: Calendar, path: '/principal/events' },
          { name: 'Reports', icon: FileUp, path: '/principal/reports' },
          { name: 'Upload HODs', icon: PlusCircle, path: '/principal/upload' },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
          { name: 'Create Event', icon: PlusCircle, path: '/teacher/create' },
          { name: 'My Events', icon: Calendar, path: '/teacher/events' },
          { name: 'Upload Attendance', icon: ClipboardCheck, path: '/teacher/attendance' },
        ];
      case 'student':
        return [
          { name: 'Events', icon: Calendar, path: '/student/dashboard' },
          { name: 'Attendance', icon: History, path: '/student/attendance' },
          { name: 'Profile', icon: UserIcon, path: '/student/profile' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 min-h-screen bg-gradient-primary flex flex-col shadow-2xl fixed top-0 left-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 text-white mb-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            {user?.role}Portal
          </span>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
              <UserIcon size={20} />
            </div>
            <div className="text-white overflow-hidden text-ellipsis">
              <p className="font-bold text-sm truncate leading-none mb-1">
                {user?.username || 'Guest'}
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
