from django.db import models
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, OTPSerializer, UserSerializer
from .otp import generate_otp, send_otp_placeholder, verify_otp
from django.contrib.auth import authenticate
import sys
import pandas as pd


from django.db import transaction
from apps.events.models import Department

class BulkHODUploadView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if request.user.role != 'principal' and not request.user.is_superuser:
            return Response({"error": "Unauthorized. Only Principal can upload HOD data."}, status=status.HTTP_403_FORBIDDEN)

        # Handle JSON data (if parsed/edited on frontend)
        data_list = request.data.get('data')
        
        if data_list:
            if not isinstance(data_list, list):
                return Response({"error": "Data must be a list of user objects."}, status=status.HTTP_400_BAD_REQUEST)
            
            created_count = 0
            skipped_rows = []

            with transaction.atomic():
                for index, row in enumerate(data_list):
                    try:
                        name = str(row.get('name', '')).strip()
                        email = str(row.get('email', '')).strip()
                        phone = str(row.get('phone_number', '')).strip()
                        password = str(row.get('password', '')).strip()
                        dept_code = str(row.get('department_code', '')).strip().upper()

                        if not phone or not email:
                            skipped_rows.append(f"Item {index+1}: Missing phone or email")
                            continue

                        if User.objects.filter(phone_number=phone).exists():
                            skipped_rows.append(f"Item {index+1}: Phone {phone} already exists")
                            continue
                        
                        if User.objects.filter(email=email).exists():
                            skipped_rows.append(f"Item {index+1}: Email {email} already exists")
                            continue

                        dept = Department.objects.filter(code=dept_code).first()
                        if not dept:
                            skipped_rows.append(f"Item {index+1}: Department {dept_code} not found")
                            continue

                        User.objects.create_user(
                            username=email,
                            email=email,
                            phone_number=phone,
                            password=password,
                            role='hod',
                            first_name=name,
                            department=dept
                        )
                        created_count += 1
                    except Exception as e:
                        skipped_rows.append(f"Item {index+1}: {str(e)}")

            return Response({
                "message": f"Successfully created {created_count} HOD accounts.",
                "skipped": skipped_rows
            }, status=status.HTTP_201_CREATED)

        # Fallback to File upload logic
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No data or file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.name.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file)
            else:
                return Response({"error": "Invalid file format. Please upload .csv or .xlsx"}, status=status.HTTP_400_BAD_REQUEST)

            required_cols = ['name', 'email', 'phone_number', 'password', 'department_code']
            for col in required_cols:
                if col not in df.columns:
                    return Response({"error": f"Missing column: {col}"}, status=status.HTTP_400_BAD_REQUEST)

            created_count = 0
            skipped_rows = []

            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        name = str(row['name'])
                        email = str(row['email']).strip()
                        phone = str(row['phone_number']).strip()
                        password = str(row['password']).strip()
                        dept_code = str(row['department_code']).strip().upper()

                        if not phone or not email:
                            skipped_rows.append(f"Row {index+2}: Missing phone or email")
                            continue

                        if User.objects.filter(phone_number=phone).exists():
                            skipped_rows.append(f"Row {index+2}: Phone {phone} already exists")
                            continue
                        
                        if User.objects.filter(email=email).exists():
                            skipped_rows.append(f"Row {index+2}: Email {email} already exists")
                            continue

                        dept = Department.objects.filter(code=dept_code).first()
                        if not dept:
                            skipped_rows.append(f"Row {index+2}: Department {dept_code} not found")
                            continue

                        User.objects.create_user(
                            username=email,
                            email=email,
                            phone_number=phone,
                            password=password,
                            role='hod',
                            first_name=name,
                            department=dept
                        )
                        created_count += 1
                    except Exception as e:
                        skipped_rows.append(f"Row {index+2}: {str(e)}")

            return Response({
                "message": f"Successfully created {created_count} HOD accounts.",
                "skipped": skipped_rows
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to process file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

from apps.logs.models import AuditLog

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
            try:
                user = serializer.save()
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Format errors into a single string for easier frontend display
        error_msgs = []
        for field, errors in serializer.errors.items():
            error_msgs.append(f"{field}: {', '.join(errors)}")
        return Response({"error": "; ".join(error_msgs)}, status=status.HTTP_400_BAD_REQUEST)

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

class HODListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        if self.request.user.role not in ['principal', 'admin']:
            return User.objects.none()
        return User.objects.filter(role='hod')

class HODDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        if self.request.user.role not in ['principal', 'admin']:
            return User.objects.none()
        return User.objects.filter(role='hod')
