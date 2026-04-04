import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def create_test_users():
    users = [
        ('admin', 'admin123', 'admin'),
        ('student1', 'student123', 'student'),
        ('teacher1', 'teacher123', 'teacher'),
        ('hod1', 'hod123', 'hod'),
    ]
    for username, password, role in users:
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, password=password, role=role)
            if role == 'admin':
                user.is_staff = True
                user.is_superuser = True
                user.save()
            print(f"User {username} created as {role}")
        else:
            print(f"User {username} already exists")

if __name__ == '__main__':
    create_test_users()
