from .models import Attendance
from django.contrib.auth import get_user_model
from events.models import Event

User = get_user_model()

def process_attendance_csv(file_obj, event_id):
    """
    Parses a CSV file with 'username' and 'status' (True/False).
    """
    decoded_file = file_obj.read().decode('utf-8').splitlines()
    reader = csv.DictReader(decoded_file)
    event = Event.objects.get(id=event_id)
    
    count = 0
    for row in reader:
        username = row.get('username')
        status_str = row.get('status', 'True').lower()
        status = status_str in ['true', '1', 'present']
        
        try:
            student = User.objects.get(username=username)
            Attendance.objects.update_or_create(
                event=event,
                student=student,
                defaults={'status': status}
            )
            count += 1
        except User.DoesNotExist:
            continue
            
    return count
