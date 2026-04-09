from django.db import models
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, OTPSerializer, UserSerializer
from .otp import generate_otp, send_otp_placeholder, verify_otp
from django.contrib.auth import authenticate
import sys

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

from logs.models import AuditLog

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def post(self, request):
        sys.stderr.write(f"\n[REQUEST] Incoming Login: {request.data}\n")
        serializer = LoginSerializer(data=request.data)
        ip = self.get_client_ip(request)
        
        if not serializer.is_valid():
            return Response({"error": "Invalid Data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=identifier, password=password)
        
        if user:
            sys.stderr.write(f"[SUCCESS] Login successful for: {user.email}\n")
            AuditLog.objects.create(
                user=user,
                action='login',
                status='success',
                message=f"User logged in successfully from {ip}",
                ip_address=ip
            )
            # TEMPORARY: BYPASS OTP FOR ALL ROLES TO ENABLE DEMO TESTING
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
                "role": user.role,
                "bypass_otp": True # ALWAYS TRUE FOR NOW
            }, status=status.HTTP_200_OK)
        
        sys.stderr.write(f"[FAIL] Auth failed for: {identifier}\n")
        # Log failure
        user_attempt = User.objects.filter(models.Q(email=identifier) | models.Q(username=identifier) | models.Q(phone_number=identifier)).first()
        AuditLog.objects.create(
            user=user_attempt, # Can be None
            action='login',
            status='failed',
            message=f"Failed login attempt for identifier: {identifier}",
            ip_address=ip
        )
        return Response({"error": "Invalid phone/email or password"}, status=status.HTTP_401_UNAUTHORIZED)

# Rest of the views remain the same
class AdminCreateUserView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        ip = self.get_client_ip(request)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            otp = serializer.validated_data['otp']
            user = User.objects.filter(models.Q(email=username) | models.Q(username=username) | models.Q(phone_number=username)).first()
            
            if user and verify_otp(user, otp):
                AuditLog.objects.create(
                    user=user,
                    action='otp_attempt',
                    status='success',
                    message=f"OTP verified successfully for {username}",
                    ip_address=ip
                )
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data
                })
            
            AuditLog.objects.create(
                user=user,
                action='otp_attempt',
                status='failed',
                message=f"Invalid OTP attempt for {username}",
                ip_address=ip
            )
            return Response({"error": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        username = request.data.get('username')
        user = User.objects.filter(models.Q(email=username) | models.Q(username=username) | models.Q(phone_number=username)).first()
        if user:
            otp = generate_otp()
            send_otp_placeholder(user, otp)
            return Response({"message": "Recovery OTP sent"}, status=status.HTTP_200_OK)
        return Response({"error": "No account found"}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        username = request.data.get('username')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        user = User.objects.filter(models.Q(email=username) | models.Q(username=username) | models.Q(phone_number=username)).first()
        if user and verify_otp(user, otp):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_object(self):
        return self.request.user
