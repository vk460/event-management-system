from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .models import Event, Department
from .serializers import EventSerializer, DepartmentSerializer, ReportSerializer
from apps.users.permissions import IsTeacher, IsHOD
from io import BytesIO
from django.core.files.base import ContentFile
from xhtml2pdf import pisa
from django.utils import timezone
from .models import Report
from django.http import FileResponse

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = (permissions.IsAuthenticated,)

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (IsTeacher,)

    def perform_create(self, serializer):
        user = self.request.user
        # Auto-assign the teacher's department so event appears for HOD/Principal
        event = serializer.save(
            created_by=user,
            department=user.department
        )
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=user,
            action='event_creation',
            message=f"Created event: {event.title}"
        )

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Event.objects.all()
        dept_id = self.request.query_params.get('department_id')
        dept_code = self.request.query_params.get('department_code')
        
        if dept_id:
            queryset = queryset.filter(department_id=dept_id)
        if dept_code:
            queryset = queryset.filter(department__code=dept_code)

        user = self.request.user
        if user.role in ['principal', 'admin']:
             return queryset
        
        if user.role == 'hod':
             # HOD see all events in their department
             return queryset.filter(department=user.department)
        
        if user.role == 'teacher':
             # Teachers see all events in their department
             return queryset.filter(department=user.department)

        # Students and others see only APPROVED events of their department
        return queryset.filter(status=Event.Status.APPROVED, department=user.department)

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAuthenticated,)

class EventApproveView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        if request.user.role not in ['hod', 'principal', 'admin']:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        event = Event.objects.filter(pk=pk).first()
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # HODs can only approve events in their department
        if request.user.role == 'hod' and event.department != request.user.department:
             return Response({"error": "Unauthorized for this department"}, status=status.HTTP_403_FORBIDDEN)
        
        action = request.data.get('action') # 'approve' or 'reject'
        msg = ""

        if action == 'approve':
            if request.user.role == 'hod':
                if event.status != Event.Status.PENDING:
                    return Response({"error": "Event must be in PENDING status for HOD approval."}, status=status.HTTP_400_BAD_REQUEST)
                event.status = Event.Status.HOD_APPROVED
                msg = "hod_approved"
            elif request.user.role in ['principal', 'admin']:
                if event.status != Event.Status.HOD_APPROVED:
                    return Response({"error": "Event must be approved by HOD first."}, status=status.HTTP_400_BAD_REQUEST)
                event.status = Event.Status.APPROVED
                msg = "approved"
        elif action == 'reject':
            event.status = Event.Status.REJECTED
            msg = "rejected"
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        event.approved_by = request.user
        event.save()
        
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action='event_action',
            message=f"{msg.replace('_', ' ').capitalize()} event: {event.title}"
        )
        return Response({"message": f"Event '{event.title}' {msg.replace('_', ' ')} successfully."}, status=status.HTTP_200_OK)

class EventRegisterView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        if request.user.role != 'student':
            return Response({"error": "Only students can register for events."}, status=status.HTTP_403_FORBIDDEN)
            
        event = Event.objects.filter(pk=pk).first()
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if event.status != Event.Status.APPROVED:
            return Response({"error": "You can only register for approved events."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if already registered
        from .models import Registration
        if Registration.objects.filter(event=event, student=request.user).exists():
            return Response({"error": "You are already registered for this event."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check capacity
        if event.registrations.count() >= event.max_participants:
            return Response({"error": "This event has reached its maximum capacity."}, status=status.HTTP_400_BAD_REQUEST)
            
        Registration.objects.create(event=event, student=request.user)
        
        from apps.logs.models import AuditLog
        AuditLog.objects.create(
            user=request.user,
            action='event_registration',
            message=f"Student {request.user.email} registered for event: {event.title}"
        )
        
        return Response({"message": "Successfully registered for the event."}, status=status.HTTP_201_CREATED)

def generate_report_pdf(report, request=None):
    """Utility to generate/regenerate the PDF for a report"""
    event = report.event
    try:
        # Formal Institutional Report Template
        html_content = f"""
        <html>
        <head>
            <style>
                @page {{ size: a4 portrait; margin: 1.5cm; }}
                body {{ font-family: 'Helvetica', 'Arial', sans-serif; color: #1a1a1a; line-height: 1.4; }}
                .header {{ text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 25px; }}
                .inst-name {{ font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }}
                .report-title {{ font-size: 14px; font-weight: bold; color: #555; }}
                
                .meta-table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
                .meta-table td {{ padding: 6px; border: 1px solid #ccc; font-size: 11px; }}
                .label {{ background-color: #f2f2f2; font-weight: bold; width: 30%; }}
                
                .section {{ margin-top: 20px; }}
                .section-title {{ font-size: 12px; font-weight: bold; text-transform: uppercase; background-color: #444; color: white; padding: 4px 10px; margin-bottom: 8px; }}
                .content {{ font-size: 11px; text-align: justify; }}
                
                .footer {{ position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 9px; color: #888; border-top: 1px solid #eee; padding-top: 5px; }}
                .signature-area {{ margin-top: 40px; }}
                .signature-box {{ float: right; width: 180px; text-align: center; font-size: 11px; border-top: 1px solid #333; padding-top: 5px; }}
                
                .page-break {{ page-break-before: always; }}
                .gallery-item {{ text-align: center; margin-bottom: 30px; page-break-inside: avoid; }}
                .gallery-img {{ max-width: 100%; max-height: 400px; border: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="header">
                <div class="inst-name">INSTITUTIONAL EVENT MANAGEMENT SYSTEM</div>
                <div class="report-title">POST-EVENT ACTIVITY REPORT</div>
            </div>
            
            <table class="meta-table">
                <tr><td class="label">Event Title</td><td>{event.title}</td></tr>
                <tr><td class="label">Department</td><td>{event.department.name if event.department else 'N/A'}</td></tr>
                <tr><td class="label">Event Coordinator</td><td>{report.teacher.get_full_name() or report.teacher.username if report.teacher else 'N/A'}</td></tr>
                <tr><td class="label">Date of Event</td><td>{event.start_time.strftime('%B %d, %Y') if event.start_time else 'N/A'}</td></tr>
                <tr><td class="label">Participants Count</td><td>{report.participants_count}</td></tr>
            </table>

            <div class="section">
                <div class="section-title">1. Objective of the Event</div>
                <div class="content">{report.objective}</div>
            </div>

            <div class="section">
                <div class="section-title">2. Event Description</div>
                <div class="content">{report.description}</div>
            </div>

            <div class="section">
                <div class="section-title">3. Key Outcomes</div>
                <div class="content">{report.outcome}</div>
            </div>

            <div class="signature-area">
                <div class="signature-box">
                    <b>Authorized Signature</b><br/>
                    Event Coordinator
                </div>
            </div>

            <div class="footer">
                Generated on {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}
            </div>

            <!-- Annexure: Evidence -->
            {(f'<div class="page-break"></div><div class="section-title">Annexure A: Event Photographs / Poster</div>' if report.poster else '')}
            {f'<div class="gallery-item"><img src="{report.poster.path}" class="gallery-img"/><p class="content">Fig 1: Event Poster/Photo</p></div>' if report.poster else ''}

            {(f'<div class="page-break"></div><div class="section-title">Annexure B: Participant List</div>' if report.participant_list else '')}
            {f'<div class="gallery-item"><img src="{report.participant_list.path}" class="gallery-img"/><p class="content">Scan: Participant Attendance List</p></div>' if report.participant_list else ''}

            {(f'<div class="page-break"></div><div class="section-title">Annexure C: Certificates</div>' if report.certificates else '')}
            {f'<div class="gallery-item"><img src="{report.certificates.path}" class="gallery-img"/><p class="content">Scan: Sample Certificate / Award</p></div>' if report.certificates else ''}

        </body>
        </html>
        """
        result = BytesIO()
        pisa.CreatePDF(BytesIO(html_content.encode("UTF-8")), dest=result)
        report.generated_pdf.save(f"report_{event.id}.pdf", ContentFile(result.getvalue()), save=True)
        return True
    except Exception as e:
        print(f"PDF Generation Error: {str(e)}")
        return False

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
            action='event_deletion',
            message=f"Deleted event: {title}. Reason: {reason}"
        )
        return Response({"message": f"Event '{title}' deleted."}, status=status.HTTP_200_OK)

class ReportListView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        if request.user.role in ['principal', 'admin']:
            reports = Report.objects.all().select_related('event', 'teacher', 'department')
        elif request.user.role == 'hod':
            reports = Report.objects.filter(department=request.user.department).select_related('event', 'teacher', 'department')
        elif request.user.role == 'teacher':
            reports = Report.objects.filter(teacher=request.user).select_related('event', 'teacher', 'department')
        else:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = ReportSerializer(reports, many=True, context={'request': request})
        return Response(serializer.data)

class ReportCreateView(views.APIView):
    permission_classes = (IsTeacher,)
    
    def post(self, request):
        event_id = request.data.get('event_id')
        event = Event.objects.filter(id=event_id, created_by=request.user, status=Event.Status.APPROVED).first()
        
        if not event:
            return Response({"error": "Event not found or not approved."}, status=status.HTTP_400_BAD_REQUEST)
            
        from django.utils import timezone
        if event.start_time and event.start_time > timezone.now():
            return Response({"error": "Cannot submit report before the event occurs."}, status=status.HTTP_400_BAD_REQUEST)
            
        if hasattr(event, 'report'):
            return Response({"error": "Report already exists for this event."}, status=status.HTTP_400_BAD_REQUEST)
        
        report = Report.objects.create(
            event=event,
            teacher=request.user,
            department=request.user.department,
            participants_count=request.data.get('participants_count', 0),
            objective=request.data.get('objective', ''),
            description=request.data.get('description', ''),
            outcome=request.data.get('outcome', ''),
        )
        
        if 'poster' in request.FILES:
            report.poster = request.FILES['poster']
        if 'participant_list' in request.FILES:
            report.participant_list = request.FILES['participant_list']
        if 'certificates' in request.FILES:
            report.certificates = request.FILES['certificates']
        report.save()
        # Unified PDF Generation
        generate_report_pdf(report, request)
            
        return Response({"message": "Report created successfully.", "id": report.id}, status=status.HTTP_201_CREATED)

class ReportDownloadView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        report = Report.objects.filter(pk=pk).first()
        if not report:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'principal'] and report.teacher != request.user:
             if request.user.role == 'hod' and report.department != request.user.department:
                 return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Regenerate on download to ensure it reflects latest template/files
        generate_report_pdf(report, request)

        return FileResponse(report.generated_pdf.open(), as_attachment=False, content_type='application/pdf')
