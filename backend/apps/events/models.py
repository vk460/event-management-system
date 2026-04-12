import hashlib
from django.db import models
from django.conf import settings

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    EVENT_TYPES = (
        ('academic', 'ACADEMIC'),
        ('cultural', 'CULTURAL'),
        ('sports', 'SPORTS'),
        ('other', 'OTHER'),
    )

    class Status(models.TextChoices):
        PENDING = 'pending', 'PENDING'
        HOD_APPROVED = 'hod_approved', 'HOD APPROVED'
        APPROVED = 'approved', 'APPROVED'
        REJECTED = 'rejected', 'REJECTED'

    title = models.CharField(max_length=200)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='events', null=True)
    venue = models.CharField(max_length=200, default='Main Auditorium')
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='academic')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    max_participants = models.IntegerField(default=100)
    
    file = models.FileField(upload_to='events/', null=True, blank=True)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    file_hash = models.CharField(max_length=64, null=True, blank=True)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_events_meta')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.file and not self.file_hash:
            sha256_hash = hashlib.sha256()
            for chunk in self.file.chunks():
                sha256_hash.update(chunk)
            self.file_hash = sha256_hash.hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.status})"

class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'student')

    def __str__(self):
        return f"{self.student.username} -> {self.event.title}"

class Report(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='report')
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_reports', null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)
    
    date = models.DateField(auto_now_add=True)
    report_type = models.CharField(max_length=50, default='Post-Event')
    participants_count = models.IntegerField(default=0)
    
    objective = models.TextField()
    description = models.TextField()
    outcome = models.TextField()
    
    poster = models.ImageField(upload_to='reports/posters/', null=True, blank=True)
    # Using JSON field to store arrays of photo URLs or simple text data for multiple images
    photos = models.JSONField(default=list, blank=True) 
    
    participant_list = models.FileField(upload_to='reports/participants/', null=True, blank=True)
    certificates = models.FileField(upload_to='reports/certificates/', null=True, blank=True)
    
    generated_pdf = models.FileField(upload_to='reports/pdfs/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.event.title}"
