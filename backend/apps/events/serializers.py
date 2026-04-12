from rest_framework import serializers
from .models import Event, Department, Report

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.title', read_only=True)
    teacher_name = serializers.CharField(source='teacher.first_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Report
        fields = (
            'id', 'event', 'event_name', 'teacher', 'teacher_name',
            'department', 'department_name', 'date', 'participants_count',
            'objective', 'description', 'outcome',
            'poster', 'participant_list', 'certificates', 'generated_pdf', 'created_at'
        )
        read_only_fields = ('id', 'teacher', 'department', 'date', 'created_at', 'generated_pdf')

class EventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    has_report = serializers.SerializerMethodField()
    report_id = serializers.SerializerMethodField()

    def get_created_by_name(self, obj):
        u = obj.created_by
        name = (u.first_name or '').strip()
        return name if name else u.email

    def get_has_report(self, obj):
        return hasattr(obj, 'report')

    def get_report_id(self, obj):
        if hasattr(obj, 'report'):
            return obj.report.id
        return None

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'department', 'department_name', 'department_code',
            'venue', 'start_time', 'end_time', 'event_type', 'max_participants',
            'status', 'file', 'image', 'file_hash',
            'created_by', 'created_by_name', 'created_by_email',
            'approved_by', 'approved_by_name', 'registrations',
            'has_report', 'report_id', 'created_at'
        )
        read_only_fields = (
            'id', 'file_hash', 'created_by', 'status', 'approved_by',
            'department', 'created_at', 'has_report', 'report_id'
        )

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
