from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'file', 'file_hash', 'created_by', 'created_by_name', 'approved', 'approved_by', 'approved_by_name', 'created_at')
        read_only_fields = ('id', 'file_hash', 'created_by', 'approved', 'approved_by', 'created_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
