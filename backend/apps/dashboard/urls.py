from django.urls import path
from .views import DashboardStatsView, PrincipalReportsView, DepartmentAnalyticsView, PrincipalAnalyticsView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('reports/', PrincipalReportsView.as_view(), name='principal_reports'),
    path('analytics/department/', DepartmentAnalyticsView.as_view(), name='dept_analytics'), # Shared for HOD and Teacher
    path('analytics/principal/', PrincipalAnalyticsView.as_view(), name='principal_analytics'),
]
