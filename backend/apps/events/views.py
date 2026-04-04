from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from users.permissions import IsTeacher, IsHOD, IsStudent

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (IsTeacher,)

    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user)
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=self.request.user,
            action='event_creation',
            message=f"Created event: {event.title}"
        )

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.role == 'hod':
             return Event.objects.all() # HOD sees all
        return Event.objects.filter(approved=True) # Others see approved

class EventApproveView(views.APIView):
    permission_classes = (IsHOD,)

    def post(self, request, pk):
        event = Event.objects.filter(pk=pk).first()
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        event.approved = True
        event.approved_by = request.user
        event.save()
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action='event_approval',
            message=f"Approved event: {event.title}"
        )
        return Response({"message": f"Event '{event.title}' approved successfully."}, status=status.HTTP_200_OK)

class EventDeleteView(views.APIView):
    permission_classes = (IsTeacher,)

    def post(self, request, pk):
        reason = request.data.get('reason')
        if not reason:
            return Response({"error": "Delete reason is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        event = Event.objects.filter(pk=pk, created_by=request.user).first()
        if not event:
            return Response({"error": "Event not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)
        
        title = event.title
        event.delete()
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action='event_deletion', # Note: need to add this to ACTION_CHOICES in AuditLog model
            message=f"Deleted event: {title}. Reason: {reason}"
        )
        return Response({"message": f"Event '{title}' deleted."}, status=status.HTTP_200_OK)
