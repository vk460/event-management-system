import os
import re

modal_code = """
const EditModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: '', email: '', phone_number: '', password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || user.username || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                password: '' // empty by default
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToPatch = {
                first_name: formData.first_name,
                email: formData.email,
                phone_number: formData.phone_number
            };
            if (formData.password) {
                dataToPatch.password = formData.password;
            }
            await onSave(user.id, dataToPatch);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 transition-colors">
                    ✕
                </button>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Edit User</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                        <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                        <input type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-orange-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password (Leave blank to keep)</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-orange-500" placeholder="******" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 mt-4 disabled:opacity-50">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};
"""

dashboards = [
    {
        "file": r"f:\Event Management\frontend\src\pages\Principal\Dashboard.jsx",
        "section": "ManageHODsSection",
        "state_injector": r"const \[existingHODs, setExistingHODs\] = useState\(\[\]\);",
        "state_content": "const [existingHODs, setExistingHODs] = useState([]);\n  const [editingUser, setEditingUser] = useState(null);",
        "save_logic": """  const handleSaveEdit = async (id, data) => {
    try {
      await api.patch(`users/hods/${id}/`, data);
      toast.success("HOD updated successfully!");
      fetchHods();
    } catch (err) {
      toast.error("Failed to update HOD.");
    }
  };""",
        "edit_button_old": r"<button className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>",
        "edit_button_new": r"<button onClick={() => setEditingUser(hod)} className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>",
        "modal_injector": r"</div>\s*\n\s*\);\s*\n};"
    },
    {
        "file": r"f:\Event Management\frontend\src\pages\HOD\Dashboard.jsx",
        "section": "ManageTeachersSection",
        "state_injector": r"const \[existingTeachers, setExistingTeachers\] = useState\(\[\]\);",
        "state_content": "const [existingTeachers, setExistingTeachers] = useState([]);\n  const [editingUser, setEditingUser] = useState(null);",
        "save_logic": """  const handleSaveEdit = async (id, data) => {
    try {
      await api.patch(`users/teachers/${id}/`, data);
      toast.success("Teacher updated successfully!");
      fetchTeachers();
    } catch (err) {
      toast.error("Failed to update Teacher.");
    }
  };""",
        "edit_button_old": r"<button className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>",
        "edit_button_new": r"<button onClick={() => setEditingUser(t)} className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>"
    },
    {
        "file": r"f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx",
        "section": "ManageStudentsSection",
        "state_injector": r"const \[existingStudents, setExistingStudents\] = useState\(\[\]\);",
        "state_content": "const [existingStudents, setExistingStudents] = useState([]);\n  const [editingUser, setEditingUser] = useState(null);",
        "save_logic": """  const handleSaveEdit = async (id, data) => {
    try {
      await api.patch(`users/students/${id}/`, data);
      toast.success("Student updated successfully!");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to update Student.");
    }
  };""",
        "edit_button_old": r"<button className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>",
        "edit_button_new": r"<button onClick={() => setEditingUser(t)} className=\"p-2 text-gray-400 hover:text-orange-500 transition-colors\"><Settings size={18} /></button>"
    }
]

for d in dashboards:
    with open(d["file"], "r", encoding="utf-8") as f:
        text = f.read()

    # Inject EditModal Component at bottom if not exists
    if "const EditModal =" not in text:
        text = text + "\n" + modal_code

    # Add Editing User State
    if "const [editingUser, setEditingUser] = useState(null);" not in text:
        text = re.sub(d["state_injector"], d["state_content"], text)
        
    # Add handleSaveEdit Function right before fetch/handle routines
    # We'll just insert it inside the component
    if "handleSaveEdit =" not in text:
        # Search for first occurrences inside component
        fn_pattern = re.compile(r"(  const handleDeleteAll = async.*?fetch.+?\(\);.+?\n  };)", re.DOTALL)
        match = fn_pattern.search(text)
        if match:
            text = text[:match.end()] + "\n\n" + d["save_logic"] + text[match.end():]
        else: # fallback
             # inject right after const handleFileChange
             fn_pattern = re.compile(r"(  const handleFileChange = \(e\) => \{.+?reader\.readAsBinaryString\(file\);\n  };)", re.DOTALL)
             match = fn_pattern.search(text)
             if match:
                 text = text[:match.start()] + d["save_logic"] + "\n\n" + text[match.start():]
    
    # Replace Button
    text = text.replace(d["edit_button_old"], d["edit_button_new"])

    # Appending the modal rendering trigger to the end of the root return div for the section
    # This is tricky using regex, we find "</div>\n    </div>\n  );" for instance and insert right before.
    modal_render = f"      <EditModal isOpen={{!!editingUser}} onClose={{() => setEditingUser(null)}} user={{editingUser}} onSave={{handleSaveEdit}} />\n"
    if "<EditModal isOpen" not in text:
         # Find the last </div> before the final return closing logic for the Section Component
         # Teacher/Dashboard.jsx: </div>\n    </div>\n  );\n};\n
         # HOD/Dashboard.jsx: </div>\n    </div>\n  );\n};\n
         
         # Just inject it before the ending tags
         pattern = re.compile(r"(    </div>\s*\n  \);\s*\n};\s*)")
         # We have multiple components in the file, so find the specific section
         # Actually we can just find the end of the return statement for the specific section
         section_idx = text.find(f"const {d['section']} = () => {{")
         next_comp_idx = text.find("const ", section_idx + 10)
         if next_comp_idx == -1: next_comp_idx = len(text)
         
         chunk = text[section_idx:next_comp_idx]
         if "</table>" in chunk:
             chunk = chunk.replace("</table>\n      </div>", f"</table>\n      </div>\n{modal_render}")
         text = text[:section_idx] + chunk + text[next_comp_idx:]

    with open(d["file"], "w", encoding="utf-8") as f:
        f.write(text)

print("Updated dashboards with Modals and Logic")
