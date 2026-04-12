import os
import re

file_path = r"f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace CreateEventSection and ReportGenerationSection with functional components
new_forms = """const CreateEventSection = () => {
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
};"""

pattern = re.compile(r'const CreateEventSection = \(\) => \{.+?export default TeacherDashboard;', re.DOTALL)
if pattern.search(content):
    new_text = pattern.sub(new_forms + '\n\nexport default TeacherDashboard;', content)
else:
    # Alternative pattern if block matches arrow func returning JSX directly (which it does in current codebase)
    pattern2 = re.compile(r'const CreateEventSection = \(\) => \(.+?export default TeacherDashboard;', re.DOTALL)
    new_text = pattern2.sub(new_forms + '\n\nexport default TeacherDashboard;', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_text)

print("Teacher Dashboard Forms updated.")
