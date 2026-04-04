from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AuditLog
from events.models import Event
from attendance.models import Attendance
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Event)
def log_event_creation(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            user=instance.created_by,
            action='event_creation',
            message=f"Event '{instance.title}' created by {instance.created_by.username}."
        )
    elif instance.approved:
        AuditLog.objects.create(
            user=instance.approved_by if instance.approved_by else instance.created_by,
            action='event_approval',
            message=f"Event '{instance.title}' approved."
        )

@receiver(post_save, sender=Attendance)
def log_attendance(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            user=instance.student,
            action='attendance_mark',
            message=f"Attendance marked for event '{instance.event.title}' by {instance.student.username}."
        )
