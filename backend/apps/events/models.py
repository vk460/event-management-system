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

    title = models.CharField(max_length=200)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='events', null=True)
    venue = models.CharField(max_length=200, default='Main Auditorium')
    event_date = models.DateField(null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='academic')
    
    file = models.FileField(upload_to='events/')
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    file_hash = models.CharField(max_length=64, null=True, blank=True)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_events')
    
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
        return self.title
