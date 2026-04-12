import os
import re

dashboards = [
    {
        "file": r"f:\Event Management\frontend\src\pages\Principal\Dashboard.jsx",
        "type": "hod",
        "url_part": "hods",
        "fetch_fn": "fetchHods",
        "item_var": "hod"
    },
    {
        "file": r"f:\Event Management\frontend\src\pages\HOD\Dashboard.jsx",
        "type": "teacher",
        "url_part": "teachers",
        "fetch_fn": "fetchTeachers",
        "item_var": "t"
    },
    {
        "file": r"f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx",
        "type": "student",
        "url_part": "students",
        "fetch_fn": "fetchStudents",
        "item_var": "s"
    }
]

for d in dashboards:
    with open(d["file"], "r", encoding="utf-8") as f:
        text = f.read()

    delete_fn = f'''  const handleDeleteUser = async (id) => {{
    if (!window.confirm("Are you sure you want to delete this {d['type']}?")) return;
    try {{
      await api.delete(`users/{d['url_part']}/${{id}}/`);
      toast.success("{d['type'].capitalize()} deleted successfully!");
      {d['fetch_fn']}();
    }} catch (err) {{
      toast.error("Failed to delete.");
    }}
  }};'''

    if "handleDeleteUser =" not in text:
        if "handleSaveEdit =" in text:
             text = text.replace("handleSaveEdit =", delete_fn + "\n\n  const handleSaveEdit =")
    
    old_btn = r'<button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>'
    new_btn = '<button onClick={() => handleDeleteUser(' + d["item_var"] + '.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>'
    text = text.replace(old_btn, new_btn)

    with open(d["file"], "w", encoding="utf-8") as f:
        f.write(text)

print("Injected Individual Delete handlers")
