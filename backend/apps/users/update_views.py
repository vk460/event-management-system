import os
import re

file_path = r"f:\Event Management\backend\apps\users\views.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace parsing for HOD
hod_pattern = r"name = str\(row\.get\('name',\s*''\)\)\.strip\(\)\n\s*email = str\(row\.get\('email',\s*''\)\)\.strip\(\)\n\s*phone = str\(row\.get\('phone_number',\s*''\)\)\.strip\(\)\n\s*dept_name = str\(row\.get\('department',\s*''\)\)\.strip\(\)"
hod_replacement = r"""name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    dept_name = str(row.get('department', row.get('Department', ''))).strip()"""
if hod_pattern in text:
    pass # Wait, let's just use regex

hod_block_pattern = re.compile(r"(class BulkHODUploadView.*?)(name = str\(row.*?)(if not phone or not email:)", re.DOTALL)
hod_block_replacement = r"""name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    dept_name = str(row.get('department', row.get('Department', ''))).strip()
                    
                    """
def replacer_hod(match):
    return match.group(1) + hod_block_replacement + match.group(3)
text = hod_block_pattern.sub(replacer_hod, text)

# For Teacher
teacher_block_pattern = re.compile(r"(class BulkTeacherUploadView.*?)(name = str\(row.*?)(if not phone or not email:)", re.DOTALL)
teacher_block_replacement = r"""name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    dept_name = str(row.get('department', row.get('Department', ''))).strip()
                    if dept_name:
                        from apps.events.models import Department
                        parsed_dept = Department.objects.filter(name__iexact=dept_name).first()
                        if not parsed_dept:
                            parsed_dept = Department.objects.create(name=dept_name, code=dept_name[:3].upper())
                        dept = parsed_dept
                    """
def replacer_teacher(match):
    return match.group(1) + teacher_block_replacement + match.group(3)
text = teacher_block_pattern.sub(replacer_teacher, text)

# For Student
student_block_pattern = re.compile(r"(class BulkStudentUploadView.*?)(name = str\(row.*?)(if not phone or not email:)", re.DOTALL)
def replacer_student(match):
    return match.group(1) + teacher_block_replacement + match.group(3) # Same replacement block
text = student_block_pattern.sub(replacer_student, text)

# Also ensure BulkHODUploadView actually uses 'password'
hod_create_pattern = re.compile(r"(User\.objects\.create_user\([\s\S]*?phone_number=phone,)([\s\S]*?role='hod')", re.DOTALL)
def replacer_hod_create(match):
    if 'password=' not in match.group(0):
        return match.group(1) + "\n                        password=password," + match.group(2)
    return match.group(0)
text = hod_create_pattern.sub(replacer_hod_create, text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated parsing logic correctly")
