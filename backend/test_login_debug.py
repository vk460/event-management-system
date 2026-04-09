import os
import django
from django.contrib.auth import authenticate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_login():
    creds = [
        ('9999900005', 'admin123', 'admin'),
        ('9876543210', 'hod123', 'hod'),
        ('9123456789', 'principal123', 'principal'),
        ('9988776655', 'teacher123', 'teacher'),
        ('9123456780', 'student123', 'student'),
    ]
    
    for identifier, password, role in creds:
        print(f"Testing {role} ({identifier})...")
        user = authenticate(username=identifier, password=password)
        if user:
            print(f"  SUCCESS: Authenticated as {user.username} (Role: {user.role})")
        else:
            print(f"  FAILED: Could not authenticate")

if __name__ == '__main__':
    test_login()
