from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'approved', 'approved_by', 'created_at')
    list_filter = ('approved', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('file_hash',)
