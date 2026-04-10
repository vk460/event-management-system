import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from events.models import Department

def seed_departments():
    depts = [
        {'name': 'Computer Science', 'code': 'CS'},
        {'name': 'Civil Engineering', 'code': 'CIVIL'},
        {'name': 'Electronics & Telecommunication', 'code': 'ENTC'},
        {'name': 'Mechanical Engineering', 'code': 'MECH'},
        {'name': 'Electrical Engineering', 'code': 'ELEC'},
        {'name': 'Artificial Intelligence & Data Science', 'code': 'AI/DS'},
    ]
    
    for dept in depts:
        obj, created = Department.objects.get_or_create(
            code=dept['code'],
            defaults={'name': dept['name']}
        )
        if created:
            print(f"Created Department: {dept['name']}")
        else:
            print(f"Department already exists: {dept['name']}")

if __name__ == '__main__':
    seed_departments()
