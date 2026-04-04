from django.urls import path
from .views import AttendanceMarkView, AttendanceListView

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance_list'),
    path('mark/', AttendanceMarkView.as_view(), name='attendance_mark'),
]
