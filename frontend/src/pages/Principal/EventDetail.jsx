import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import Breadcrumbs from '../../components/Breadcrumbs';
import api from '../../api/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  ArrowLeft,
  Building,
  Tag,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine path for breadcrumbs
    const source = location.state?.from || 'events';
    const deptInfo = location.state?.deptInfo;

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`events/${id}/`);
            setEvent(res.data);
        } catch (err) {
            console.error("Failed to fetch event details:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        </Layout>
    );

    if (!event) return (
        <Layout>
            <div className="text-center p-20">
                <h2 className="text-2xl font-black text-gray-900">Event Not Found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold underline">Go Back</button>
            </div>
        </Layout>
    );

    const breadcrumbPaths = source === 'departments' 
        ? [
            { label: 'DEPARTMENTS', link: '/principal/departments' },
            { label: deptInfo?.name || event.department_name, link: `/principal/departments?code=${event.department_code}` },
            { label: event.title }
          ]
        : [
            { label: 'EVENTS', link: '/principal/events' },
            { label: event.title }
          ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Breadcrumbs paths={breadcrumbPaths} />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Image and Main Info */}
                    <div className="flex-1 space-y-8">
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[400px]">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                                    <Tag size={80} />
                                </div>
                            )}
                            <div className="absolute top-6 left-6 px-6 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                                {event.event_type}
                            </div>
                        </div>

                        <div className="glass-card rounded-[40px] p-10 space-y-6">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-4">
                                <InfoBadge icon={Building} label="Dept" value={event.department_name} />
                                <InfoBadge icon={MapPin} label="Venue" value={event.venue} />
                                <InfoBadge icon={Calendar} label="Date" value={new Date(event.event_date).toLocaleDateString()} />
                            </div>
                            <hr className="border-gray-100" />
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Description</h3>
                                <p className="text-gray-600 font-medium leading-relaxed text-lg">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Actions */}
                    <div className="w-full lg:w-[350px] space-y-6">
                        <div className="glass-card rounded-[40px] p-8 space-y-6 bg-gradient-to-br from-white to-orange-50/30">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Status & Analytics</h3>
                            
                            <div className="space-y-4">
                                <StatRow icon={Users} label="Total Participants" value="245" color="text-orange-500" />
                                <StatRow icon={Clock} label="Duration" value="3 Hours" color="text-indigo-500" />
                                <StatRow icon={ShieldCheck} label="Approval" value="Verified" color="text-green-500" />
                            </div>

                            <div className="pt-4 space-y-3">
                                <button className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all">
                                    <Download size={20} /> DOWNLOAD REPORT
                                </button>
                                <button className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-all">
                                    <Calendar size={20} /> ADD TO CALENDAR
                                </button>
                            </div>
                        </div>

                        <div className="glass-card rounded-[40px] p-8 border-dashed border-2 border-gray-100">
                             <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Flyer Attachment</h4>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">PDF</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-700 truncate">{event.file?.split('/').pop() || 'event_brochure.pdf'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">2.4 MB • BROCHURE</p>
                                </div>
                                <Download size={18} className="text-gray-300 cursor-pointer hover:text-primary transition-colors" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const InfoBadge = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
        <Icon className="text-primary" size={18} />
        <div>
            <p className="text-[8px] font-black text-gray-400 uppercase leading-none">{label}</p>
            <p className="text-sm font-black text-gray-800 tracking-tight">{value}</p>
        </div>
    </div>
);

const StatRow = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
        <div className="flex items-center gap-3">
            <Icon className={color} size={20} />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-lg font-black text-gray-900">{value}</span>
    </div>
);

export default EventDetail;
