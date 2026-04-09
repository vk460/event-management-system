import os
import django
from django.contrib.auth import authenticate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

print("Testing direct authentication...")
# Test Admin (Email)
user = authenticate(username='admin@school.com', password='admin123')
print(f"Admin (Email): {'SUCCESS' if user else 'FAILED'}")

# Test HOD (Phone)
user = authenticate(username='9876543210', password='hod123')
print(f"HOD (Phone): {'SUCCESS' if user else 'FAILED'}")
