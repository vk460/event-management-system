import os
import re

teacher_file = r"f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx"
with open(teacher_file, "r", encoding="utf-8") as f:
    text = f.read()

# Update Preview Headers
str_preview_headers = r"{['Name', 'Email', 'Phone'].map("
new_preview_headers = r"{['Name', 'Email', 'Phone', 'Password', 'Department'].map("
text = text.replace(str_preview_headers, new_preview_headers)

# Update Preview Rows
str_preview_row = r"""<td className="px-8 py-4 font-mono text-gray-600">{row.phone_number || row.phone || row.Phone || '-'}</td>"""
new_preview_row = r"""<td className="px-8 py-4 font-mono text-gray-600">{row.phone_number || row.phone || row.Phone || '-'}</td>
                    <td className="px-8 py-4 text-gray-500 font-medium">{row.password || row.Password || '******'}</td>
                    <td className="px-8 py-4 font-black text-gray-900 uppercase">{row.department || row.Department || '-'}</td>"""
text = text.replace(str_preview_row, new_preview_row)


# Update Existing Headers
str_existing_headers = r"{['Name', 'Email', 'Phone', 'Role', 'Actions'].map("
new_existing_headers = r"{['Name', 'Email', 'Phone', 'Password', 'Department', 'Actions'].map("
text = text.replace(str_existing_headers, new_existing_headers)

# Update Existing Rows
str_existing_row = r"""<td className="px-8 py-6 font-bold text-orange-500 uppercase">{t.role}</td>"""
new_existing_row = r"""<td className="px-8 py-6 text-gray-400 font-medium tracking-widest">******</td>
                <td className="px-8 py-6 font-bold text-orange-500 uppercase">{t.department?.name || 'Assigned Dept'}</td>"""
text = text.replace(str_existing_row, new_existing_row)

# Fix Tab Naming "All Events"
text = text.replace("Department Events", "All Events")

with open(teacher_file, "w", encoding="utf-8") as f:
    f.write(text)

# ----------- HOD Dashboard -----------
hod_file = r"f:\Event Management\frontend\src\pages\HOD\Dashboard.jsx"
with open(hod_file, "r", encoding="utf-8") as f:
    text2 = f.read()

text2 = text2.replace(str_preview_headers, new_preview_headers)
text2 = text2.replace(str_preview_row, new_preview_row)
text2 = text2.replace(str_existing_headers, new_existing_headers)
text2 = text2.replace(str_existing_row, new_existing_row)

with open(hod_file, "w", encoding="utf-8") as f:
    f.write(text2)

# ----------- Principal Dashboard -----------
principal_file = r"f:\Event Management\frontend\src\pages\Principal\Dashboard.jsx"
with open(principal_file, "r", encoding="utf-8") as f:
    text3 = f.read()

text3 = text3.replace(str_preview_headers, new_preview_headers)
text3 = text3.replace(str_preview_row, new_preview_row)
text3 = text3.replace(str_existing_headers, new_existing_headers)
text3 = text3.replace(str_existing_row, new_existing_row)

with open(principal_file, "w", encoding="utf-8") as f:
    f.write(text3)


print("Successfully updated UI tables and naming across all 3 dashboards.")
