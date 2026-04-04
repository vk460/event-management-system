import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def fix_superuser_roles():
    superusers = User.objects.filter(is_superuser=True)
    for user in superusers:
        if user.role != 'admin':
            user.role = 'admin'
            user.save()
            print(f"Fixed role for superuser: {user.username} ({user.email})")
        else:
            print(f"Role already correct for superuser: {user.username} ({user.email})")

if __name__ == '__main__':
    fix_superuser_roles()
