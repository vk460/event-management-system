import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def reset_passwords():
    demo_creds = {
        'admin@school.com': 'admin123',
        'hod@school.com': 'hod123',
        'principal@school.com': 'principal123',
        'teacher@school.com': 'teacher123',
        'student@school.com': 'student123',
    }
    
    for email, password in demo_creds.items():
        user = User.objects.filter(email=email).first()
        if user:
            user.set_password(password)
            user.save()
            print(f"Password reset for {email}")
        else:
            print(f"User {email} NOT FOUND")

if __name__ == '__main__':
    reset_passwords()
