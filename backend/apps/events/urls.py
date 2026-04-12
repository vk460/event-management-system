from django.urls import path
from .views import (
    EventCreateView, EventListView, EventApproveView, EventDetailView, 
    DepartmentListView, EventRegisterView, EventDeleteView,
    ReportListView, ReportCreateView, ReportDownloadView
)

urlpatterns = [
    path('', EventListView.as_view(), name='event_list'),
    path('departments/', DepartmentListView.as_view(), name='department_list'),
    path('create/', EventCreateView.as_view(), name='event_create'),
    path('approve/<int:pk>/', EventApproveView.as_view(), name='event_approve'),
    path('register/<int:pk>/', EventRegisterView.as_view(), name='event_register'),
    path('delete/<int:pk>/', EventDeleteView.as_view(), name='event_delete'),
    path('<int:pk>/', EventDetailView.as_view(), name='event_detail'),
    
    # Reports mapped within events app to match the requested endpoints
    path('reports/', ReportListView.as_view(), name='report_list'),
    path('reports/create/', ReportCreateView.as_view(), name='report_create'),
    path('reports/<int:pk>/download/', ReportDownloadView.as_view(), name='report_download'),
]
