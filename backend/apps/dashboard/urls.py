from django.urls import path
from .views import DashboardStatsView, PrincipalReportsView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('reports/', PrincipalReportsView.as_view(), name='principal_reports'),
]
