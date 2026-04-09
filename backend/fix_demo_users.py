import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def fix_demo_users():
    demo_users = [
        {'phone': '9999900005', 'pass': 'admin123', 'role': 'admin', 'email': 'admin@school.com'},
        {'phone': '9876543210', 'pass': 'hod123', 'role': 'hod', 'email': 'hod@school.com'},
        {'phone': '9123456789', 'pass': 'principal123', 'role': 'principal', 'email': 'principal@school.com'},
        {'phone': '9988776655', 'pass': 'teacher123', 'role': 'teacher', 'email': 'teacher@school.com'},
        {'phone': '9123456780', 'pass': 'student123', 'role': 'student', 'email': 'student@school.com'},
    ]
    
    for entry in demo_users:
        phone = entry['phone']
        password = entry['pass']
        role = entry['role']
        email = entry['email']
        
        # Try finding by phone first
        user = User.objects.filter(phone_number=phone).first()
        if not user:
            # Try finding by email
            user = User.objects.filter(email=email).first()
        
        if user:
            print(f"Updating user: {user.username} -> role: {role}, phone: {phone}")
            user.phone_number = phone
            user.role = role
            user.email = email
            user.set_password(password)
            user.save()
        else:
            # Check if username clashing
            if User.objects.filter(username=phone).exists():
                print(f"Username {phone} exists but for different role. Deleting it to re-create correctly.")
                User.objects.filter(username=phone).delete()
                
            print(f"Creating user: {phone} -> role: {role}")
            user = User.objects.create_user(
                username=phone,
                email=email,
                password=password,
                role=role,
                phone_number=phone
            )
            
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()

if __name__ == '__main__':
    fix_demo_users()
