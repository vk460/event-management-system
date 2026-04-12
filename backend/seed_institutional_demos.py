import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.events.models import Department

def seed_demo_users():
    print("Seeding demo users...")
    
    # Ensure departments
    cs_dept, _ = Department.objects.get_or_create(code='CS', defaults={'name': 'Computer Science'})
    
    # Demo Data Map
    demos = [
        {
            'username': 'principal_demo',
            'email': 'principal@demo.com',
            'phone': '9112233445',
            'role': 'principal',
            'password': 'password123',
            'name': 'Principal Demo'
        },
        {
            'username': 'hod_demo',
            'email': 'hod@demo.com',
            'phone': '9876543210',
            'role': 'hod',
            'password': 'password123',
            'name': 'HOD Demo',
            'dept': cs_dept
        },
        {
            'username': 'teacher_demo',
            'email': 'teacher@demo.com',
            'phone': '9988776655',
            'role': 'teacher',
            'password': 'password123',
            'name': 'Teacher Demo',
            'dept': cs_dept
        },
        {
            'username': 'student_demo',
            'email': 'student@demo.com',
            'phone': '8877665544',
            'role': 'student',
            'password': 'password123',
            'name': 'Student Demo',
            'dept': cs_dept
        }
    ]
    
    for d in demos:
        user, created = User.objects.get_or_create(
            phone_number=d['phone'],
            defaults={
                'username': d['username'],
                'email': d['email'],
                'role': d['role'],
                'first_name': d['name'],
                'department': d.get('dept')
            }
        )
        if created:
            user.set_password(d['password'])
            user.save()
            print(f"Created {d['role']}: {d['phone']}")
        else:
            # Update existing if needed
            user.role = d['role']
            user.first_name = d['name']
            user.department = d.get('dept')
            user.save()
            print(f"Updated {d['role']}: {d['phone']}")

if __name__ == '__main__':
    seed_demo_users()
