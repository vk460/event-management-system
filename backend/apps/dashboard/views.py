from rest_framework import views, permissions
from rest_framework.response import Response
from apps.users.models import User
from apps.events.models import Event
from apps.attendance.models import Attendance
from apps.logs.models import AuditLog
from apps.events.models import Department
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

class DashboardStatsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        stats = {}
        if user.role == 'student':
            stats = {
                'total_events': Event.objects.filter(status=Event.Status.APPROVED).count(),
                'my_attendance': Attendance.objects.filter(student=user, status=True).count(),
                'upcoming_events': Event.objects.filter(status=Event.Status.APPROVED).count()
            }
        elif user.role == 'teacher':
             stats = {
                'my_events': Event.objects.filter(created_by=user).count(),
                'total_registrations': Attendance.objects.filter(event__created_by=user).count(),
                'active_approvals': Event.objects.filter(created_by=user, status=Event.Status.APPROVED).count()
            }
        elif user.role == 'hod':
            stats = {
                'total_teachers': User.objects.filter(role='teacher', department=user.department).count(),
                'active_events': Event.objects.filter(status=Event.Status.APPROVED, department=user.department).count(),
                'pending_events': Event.objects.filter(status=Event.Status.PENDING, department=user.department).count()
            }
        elif user.role in ['principal', 'admin']:
            stats = {
                'student_count': User.objects.filter(role='student').count(),
                'teacher_count': User.objects.filter(role='teacher').count(),
                'hod_count': User.objects.filter(role='hod').count(),
                'department_count': Department.objects.count(),
                'total_events': Event.objects.count(),
                'pending_approvals': Event.objects.filter(status=Event.Status.HOD_APPROVED).count()
            }
        return Response(stats)

class DepartmentAnalyticsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        if user.role == 'hod':
            events = Event.objects.filter(department=user.department)
        elif user.role == 'teacher':
            events = Event.objects.filter(created_by=user)
        else:
            return Response({"error": "Unauthorized"}, status=403)
        
        # Events per month
        monthly_data = list(events.exclude(start_time__isnull=True).annotate(
            month=TruncMonth('start_time')
        ).values('month').annotate(total=Count('id')).order_by('month'))
        
        for m in monthly_data:
            m['month'] = m['month'].strftime('%b %Y')

        # Participants per event
        participation_data = list(events.filter(status=Event.Status.APPROVED).annotate(
            count=Count('registrations')
        ).values('title', 'count'))

        return Response({
            "monthly_event_count": monthly_data,
            "participation_per_event": participation_data
        })

class PrincipalAnalyticsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if request.user.role not in ['principal', 'admin']:
            return Response({"error": "Unauthorized"}, status=403)

        # Department performance
        dept_stats = list(Department.objects.annotate(
            event_count=Count('events', distinct=True),
            participation_count=Count('events__registrations', distinct=True)
        ).values('name', 'event_count', 'participation_count'))

        # Trends
        monthly_stats = list(Event.objects.filter(status=Event.Status.APPROVED).exclude(start_time__isnull=True).annotate(
            month=TruncMonth('start_time')
        ).values('month').annotate(total=Count('id')).order_by('month'))
        
        for m in monthly_stats:
            m['month'] = m['month'].strftime('%b %Y')

        return Response({
            "monthly_stats": monthly_stats,
            "department_stats": dept_stats
        })

class PrincipalReportsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,) # Add principal/admin role check

    def get(self, request):
        # High level analytics
        logs = AuditLog.objects.order_by('-timestamp')[:50]
        return Response({
            'activity_logs': list(logs.values('user__username', 'action', 'timestamp', 'message', 'ip_address', 'status'))
        })
