from django.db import models
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, OTPSerializer, UserSerializer
from .otp import generate_otp, send_otp_placeholder, verify_otp

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

from django.contrib.auth import authenticate

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Use standard authenticate which calls DualIdentifierBackend
            user = authenticate(request, username=identifier, password=password)
            
            if user:
                # 1. Admin/Superuser flow (Bypass OTP)
                if user.is_superuser or user.role == 'admin':
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": UserSerializer(user).data,
                        "role": user.role,
                        "is_superuser": user.is_superuser,
                        "bypass_otp": True
                    }, status=status.HTTP_200_OK)
                
                # 2. Regular User flow (Send OTP)
                otp = generate_otp()
                send_otp_placeholder(user, otp)
                return Response({
                    "message": "OTP sent to your registered device.", 
                    "username": user.email, # email is the USERNAME_FIELD now
                    "role": user.role,
                    "is_superuser": user.is_superuser,
                    "bypass_otp": False
                }, status=status.HTTP_200_OK)
            
            # Specific error if authentication fails
            return Response({"error": "Invalid Credentials: Check Email/Phone or Password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            otp = serializer.validated_data['otp']
            user = User.objects.filter(username=username).first()
            if user and verify_otp(user, otp):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data
                })
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        user = User.objects.filter(models.Q(username=username) | models.Q(email=username)).first()
        if user:
            otp = generate_otp()
            send_otp_placeholder(user, otp)
            return Response({"message": "Recovery OTP sent to your phone."}, status=status.HTTP_200_OK)
        return Response({"error": "No account found with this phone number."}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        user = User.objects.filter(username=username).first()
        
        if user and verify_otp(user, otp):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
