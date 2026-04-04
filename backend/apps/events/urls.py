from django.urls import path
from .views import EventCreateView, EventListView, EventApproveView

urlpatterns = [
    path('', EventListView.as_view(), name='event_list'),
    path('create/', EventCreateView.as_view(), name='event_create'),
    path('approve/<int:pk>/', EventApproveView.as_view(), name='event_approve'),
]
