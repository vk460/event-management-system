from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('otp_attempt', 'OTP Attempt'),
        ('login_attempt', 'Login Attempt'),
        ('otp_verification', 'OTP Verification'),
        ('event_creation', 'Event Creation'),
        ('event_action', 'Event Action'),
        ('event_registration', 'Event Registration'),
        ('file_upload', 'File Upload'),
        ('attendance_mark', 'Attendance Marking'),
        ('event_deletion', 'Event Deletion'),
    )
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('failed', 'Failed'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='audit_logs', null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='success')
    message = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Unknown'} - {self.action} ({self.status}) at {self.timestamp}"
