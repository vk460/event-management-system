from rest_framework import views, permissions
from rest_framework.response import Response
from users.models import User
from events.models import Event
from attendance.models import Attendance
from logs.models import AuditLog

class DashboardStatsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        stats = {}
        if user.role == 'student':
            stats = {
                'total_events': Event.objects.filter(approved=True).count(),
                'my_attendance': Attendance.objects.filter(student=user, status=True).count(),
                'upcoming_events': Event.objects.filter(approved=True).count()
            }
        elif user.role == 'teacher':
             stats = {
                'my_events': Event.objects.filter(created_by=user).count(),
                'total_registrations': Attendance.objects.filter(event__created_by=user).count(),
                'active_approvals': Event.objects.filter(created_by=user, approved=True).count()
            }
        elif user.role == 'hod':
            stats = {
                'pending_approvals': Event.objects.filter(approved=False).count(),
                'total_department_events': Event.objects.all().count(),
                'teacher_activity': Event.objects.values('created_by').distinct().count()
            }
        elif user.role in ['principal', 'admin']:
            stats = {
                'total_users': User.objects.count(),
                'total_events': Event.objects.count(),
                'security_logs': AuditLog.objects.count()
            }
        return Response(stats)

class PrincipalReportsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,) # Add principal/admin role check

    def get(self, request):
        # High level analytics
        logs = AuditLog.objects.order_by('-timestamp')[:50]
        return Response({
            'activity_logs': list(logs.values('user__username', 'action', 'timestamp', 'message'))
        })
