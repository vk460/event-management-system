from django.urls import path
from .views import EventCreateView, EventListView, EventApproveView, EventDetailView, DepartmentListView

urlpatterns = [
    path('', EventListView.as_view(), name='event_list'),
    path('departments/', DepartmentListView.as_view(), name='department_list'),
    path('create/', EventCreateView.as_view(), name='event_create'),
    path('approve/<int:pk>/', EventApproveView.as_view(), name='event_approve'),
    path('<int:pk>/', EventDetailView.as_view(), name='event_detail'),
]
