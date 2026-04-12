import os

with open(r'f:\Event Management\frontend\manage_teachers_clean.txt', 'r', encoding='utf-8') as f:
    teachers_clean = f.read()

with open(r'f:\Event Management\frontend\manage_students_clean.txt', 'r', encoding='utf-8') as f:
    students_clean = f.read()

# HOD Dashboard Fix
hod_path = r'f:\Event Management\frontend\src\pages\HOD\Dashboard.jsx'
if os.path.exists(hod_path):
    with open(hod_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_tag = 'const ManageTeachersSection = () => {'
    end_tag = 'const EventApprovalSection'
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx] + teachers_clean + '\n\n' + content[end_idx:]
        with open(hod_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated HOD Dashboard accurately")

# Teacher Dashboard Fix
t_path = r'f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx'
if os.path.exists(t_path):
    with open(t_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_tag = 'const ManageStudentsSection = () => {'
    end_tag = 'const MyEventsSection'
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx] + students_clean + '\n\n' + content[end_idx:]
        with open(t_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated Teacher Dashboard accurately")
