from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Attendance
        fields = ('id', 'student', 'student_name', 'event', 'event_title', 'status', 'timestamp')
        read_only_fields = ('id', 'student', 'timestamp')

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
