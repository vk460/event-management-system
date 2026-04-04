from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer
from users.permissions import IsStudent, IsTeacher, IsHOD

class AttendanceMarkView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = (IsStudent,)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status=True)

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Attendance.objects.filter(student=user)
        return Attendance.objects.all() # Teachers/HOD see all
