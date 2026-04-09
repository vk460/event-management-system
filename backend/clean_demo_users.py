import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def recreate_demo_users():
    demo_users = [
        {'id': '9999900005', 'pass': 'admin123', 'role': 'admin', 'email': 'admin@school.com'},
        {'id': '9876543210', 'pass': 'hod123', 'role': 'hod', 'email': 'hod@school.com'},
        {'id': '9123456789', 'pass': 'principal123', 'role': 'principal', 'email': 'principal@school.com'},
        {'id': '9988776655', 'pass': 'teacher123', 'role': 'teacher', 'email': 'teacher@school.com'},
        {'id': '9123456780', 'pass': 'student123', 'role': 'student', 'email': 'student@school.com'},
    ]
    
    # 1. Clear any existing records that might clash
    all_phones = [d['id'] for d in demo_users]
    all_emails = [d['email'] for d in demo_users]
    
    print("Cleaning up old demo data...")
    User.objects.filter(phone_number__in=all_phones).delete()
    User.objects.filter(email__in=all_emails).delete()
    
    # 2. Recreate cleanly
    for entry in demo_users:
        print(f"Creating {entry['role']} user: {entry['id']}")
        user = User.objects.create_user(
            username=f"demo_{entry['role']}_{entry['id']}", # Unique internal username
            email=entry['email'],
            password=entry['pass'],
            role=entry['role'],
            phone_number=entry['id']
        )
        
        if entry['role'] == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()
            print("  - Elevated to superuser")
            
    print("\nVerified Users in DB:")
    for u in User.objects.all():
        print(f"Role: {u.role:<10} | Phone: {u.phone_number:<12} | Email: {u.email}")

if __name__ == '__main__':
    recreate_demo_users()
