from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    VerifyOTPView, 
    UserProfileView,
    ForgotPasswordView,
    ResetPasswordView,
    AdminCreateUserView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('admin-create-user/', AdminCreateUserView.as_view(), name='admin-create-user'),
]
