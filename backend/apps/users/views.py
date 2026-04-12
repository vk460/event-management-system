from django.db import models
from django.db.models import Q
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, VerifyOTPSerializer, UserSerializer
from .otp import send_otp, verify_otp
from django.contrib.auth import authenticate
import sys
import pandas as pd


from django.db import transaction
from apps.events.models import Department
from apps.logs.models import AuditLog

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

            for index, row in enumerate(data_list):
                try:
                    name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone_raw = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    phone = ''.join(filter(str.isdigit, phone_raw))
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    dept_name = str(row.get('department', row.get('Department', ''))).strip()
                    
                    if not phone or not email:
                        skipped_rows.append(f"Item {index+1}: Missing phone or email")
                        continue

                    if phone and User.objects.filter(phone_number=phone).exists():
                        skipped_rows.append(f"Item {index+1}: Phone {phone} already exists")
                        continue
                    
                    if email and User.objects.filter(email=email).exists():
                        skipped_rows.append(f"Item {index+1}: Email {email} already exists")
                        continue

                    # Auto-create department if missing to prevent "not found" blockers
                    with transaction.atomic():
                        dept, _ = Department.objects.get_or_create(
                            name=dept_name,
                            defaults={'code': dept_name[:3].upper()}
                        )

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

            # Log the bulk operation
            AuditLog.objects.create(
                user=request.user,
                action='file_upload',
                status='success' if created_count > 0 else 'failed',
                message=f"Bulk HOD Upload: {created_count} created, {len(skipped_rows)} skipped."
            )

            return Response({
                "message": f"Institutional update complete: {created_count} accounts initialized.",
                "created_count": created_count,
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

            for index, row in df.iterrows():
                try:
                    name = str(row['name'])
                    email = str(row['email']).strip()
                    phone = str(row['phone_number']).strip()
                    password = str(row['password']).strip()
                    if phone and User.objects.filter(phone_number=phone).exists():
                        skipped_rows.append(f"Row {index+2}: Phone {phone} already exists")
                        continue
                    
                    if email and User.objects.filter(email=email).exists():
                        skipped_rows.append(f"Row {index+2}: Email {email} already exists")
                        continue

                    # Auto-create department if missing
                    with transaction.atomic():
                        dept, _ = Department.objects.get_or_create(
                            code=dept_code,
                            defaults={'name': f"Dept {dept_code}"}
                        )

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
        serializer = LoginSerializer(data=request.data)
        ip = self.get_client_ip(request)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=identifier, password=password)
        
        if user:
            # Send OTP as per requirements 1.5
            send_otp(user)
            
            AuditLog.objects.create(
                user=user,
                action='login_attempt',
                status='success',
                message=f"Credentials verified. OTP sent to {identifier}",
                ip_address=ip
            )
            return Response({
                "message": f"OTP sent to your registered contact.",
                "identifier": identifier,
                "otp_sent": True
            }, status=status.HTTP_200_OK)
        
        # Log failure
        user_attempt = User.objects.filter(Q(email=identifier) | Q(phone_number=identifier) | Q(username=identifier)).first()
        AuditLog.objects.create(
            user=user_attempt,
            action='login_attempt',
            status='failed',
            message=f"Failed login attempt for identifier: {identifier}",
            ip_address=ip
        )
        return Response({"error": "Invalid credentials. Please check your email/phone and password."}, status=status.HTTP_401_UNAUTHORIZED)

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
        serializer = VerifyOTPSerializer(data=request.data)
        ip = self.get_client_ip(request)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            code = serializer.validated_data['code']
            
            user = User.objects.filter(Q(email=identifier) | Q(phone_number=identifier) | Q(username=identifier)).first()
            
            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            success, message = verify_otp(user, code)
            
            if success:
                refresh = RefreshToken.for_user(user)
                
                AuditLog.objects.create(
                    user=user,
                    action='otp_verification',
                    status='success',
                    message="OTP verified successfully",
                    ip_address=ip
                )
                
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            
            AuditLog.objects.create(
                user=user,
                action='otp_verification',
                status='failed',
                message=f"Invalid OTP: {message}",
                ip_address=ip
            )
            return Response({"error": message}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            send_otp(user)
            return Response({"message": "Recovery OTP sent to your email."}, status=status.HTTP_200_OK)
        return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('new_password')
        user = User.objects.filter(email=email).first()
        
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        success, message = verify_otp(user, code)
        if success:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": message}, status=status.HTTP_401_UNAUTHORIZED)

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

class BulkTeacherUploadView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if request.user.role != 'hod' and not request.user.is_superuser:
            return Response({"error": "Unauthorized. Only HOD can upload teacher data."}, status=status.HTTP_403_FORBIDDEN)

        data_list = request.data.get('data')
        dept = request.user.department

        if not dept:
             return Response({"error": "HOD must be assigned to a department to upload teachers."}, status=status.HTTP_400_BAD_REQUEST)

        if data_list:
            if not isinstance(data_list, list):
                return Response({"error": "Data must be a list of user objects."}, status=status.HTTP_400_BAD_REQUEST)
            
            created_count = 0
            skipped_rows = []

            for index, row in enumerate(data_list):
                try:
                    name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone_raw = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    phone = ''.join(filter(str.isdigit, phone_raw))
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    # HODs can only add teachers to THEIR OWN department
                    row_dept = request.user.department 
                    # Only Principal/Superuser can specify different departments in Excel
                    if request.user.role in ['principal', 'admin'] or request.user.is_superuser:
                        dept_name = str(row.get('department', row.get('Department', ''))).strip()
                        if dept_name:
                            from apps.events.models import Department
                            parsed_dept, _ = Department.objects.get_or_create(
                                name=dept_name, 
                                defaults={'code': dept_name[:3].upper()}
                            )
                            row_dept = parsed_dept
                    if not phone or not email:
                        skipped_rows.append(f"Item {index+1}: Missing phone or email")
                        continue

                    if phone and User.objects.filter(phone_number=phone).exists():
                        skipped_rows.append(f"Item {index+1}: Phone {phone} already exists")
                        continue
                    
                    if email and User.objects.filter(email=email).exists():
                        skipped_rows.append(f"Item {index+1}: Email {email} already exists")
                        continue

                    User.objects.create_user(
                        username=email,
                        email=email,
                        phone_number=phone,
                        password=password,
                        role='teacher',
                        first_name=name,
                        department=row_dept
                    )
                    created_count += 1
                except Exception as e:
                    skipped_rows.append(f"Item {index+1}: {str(e)}")

            AuditLog.objects.create(
                user=request.user,
                action='file_upload',
                status='success' if created_count > 0 else 'failed',
                message=f"Bulk Teacher Upload: {created_count} created, {len(skipped_rows)} skipped."
            )

            return Response({
                "message": f"Department update complete: {created_count} teachers initialized.",
                "created_count": created_count,
                "skipped": skipped_rows
            }, status=status.HTTP_201_CREATED)

        return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

class TeacherListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        if self.request.user.role not in ['hod', 'principal', 'admin']:
            return User.objects.none()
        
        qs = User.objects.filter(role='teacher')
        if self.request.user.role == 'hod':
            return qs.filter(department=self.request.user.department)
        return qs

class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        if self.request.user.role not in ['hod', 'principal', 'admin']:
            return User.objects.none()
        
        qs = User.objects.filter(role='teacher')
        if self.request.user.role == 'hod':
            return qs.filter(department=self.request.user.department)
        return qs

class BulkStudentUploadView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if request.user.role not in ['teacher', 'hod', 'principal'] and not request.user.is_superuser:
            return Response({"error": "Unauthorized. Higher role required to upload student data."}, status=status.HTTP_403_FORBIDDEN)

        data_list = request.data.get('data')
        dept = request.user.department

        if not dept:
             return Response({"error": "Staff must be assigned to a department to upload students."}, status=status.HTTP_400_BAD_REQUEST)

        if data_list:
            if not isinstance(data_list, list):
                return Response({"error": "Data must be a list of user objects."}, status=status.HTTP_400_BAD_REQUEST)
            
            created_count = 0
            skipped_rows = []

            for index, row in enumerate(data_list):
                try:
                    name = str(row.get('name', row.get('Name', row.get('First_Name', '')))).strip()
                    email = str(row.get('email', row.get('Email', ''))).strip()
                    phone_raw = str(row.get('phone', row.get('Phone', row.get('phone_number', '')))).strip()
                    phone = ''.join(filter(str.isdigit, phone_raw))
                    password = str(row.get('password', row.get('Password', ''))).strip()
                    # Staff can only add students to THEIR OWN department
                    row_dept = request.user.department 
                    # Only Principal/Superuser can specify different departments in Excel
                    if request.user.role in ['principal', 'admin'] or request.user.is_superuser:
                        dept_name = str(row.get('department', row.get('Department', ''))).strip()
                        if dept_name:
                            from apps.events.models import Department
                            parsed_dept, _ = Department.objects.get_or_create(
                                name=dept_name, 
                                defaults={'code': dept_name[:3].upper()}
                            )
                            row_dept = parsed_dept

                    identifier = email if email else (phone if phone else None)
                    if not identifier:
                        skipped_rows.append(f"Item {index+1}: Missing email and phone")
                        continue

                    if phone and User.objects.filter(phone_number=phone).exists():
                        skipped_rows.append(f"Item {index+1}: Phone {phone} already exists")
                        continue
                    
                    if identifier and User.objects.filter(username=identifier).exists():
                        skipped_rows.append(f"Item {index+1}: Identifier {identifier} already exists")
                        continue

                    User.objects.create_user(
                        username=identifier,
                        email=email if email else f"{identifier}@student.local",
                        phone_number=phone,
                        password=password,
                        role='student',
                        first_name=name,
                        department=row_dept
                    )
                    created_count += 1
                except Exception as e:
                    skipped_rows.append(f"Item {index+1}: {str(e)}")

            AuditLog.objects.create(
                user=request.user,
                action='file_upload',
                status='success' if created_count > 0 else 'failed',
                message=f"Bulk Student Upload: {created_count} created, {len(skipped_rows)} skipped."
            )

            return Response({
                "message": f"Department update complete: {created_count} students initialized.",
                "created_count": created_count,
                "skipped": skipped_rows
            }, status=status.HTTP_201_CREATED)

        return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

class StudentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        if self.request.user.role not in ['teacher', 'hod', 'principal', 'admin']:
            return User.objects.none()
        
        qs = User.objects.filter(role='student')
        if self.request.user.role in ['teacher', 'hod']:
            return qs.filter(department=self.request.user.department)
        return qs

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        if self.request.user.role not in ['teacher', 'hod', 'principal', 'admin']:
            return User.objects.none()
        
        qs = User.objects.filter(role='student')
        if self.request.user.role in ['teacher', 'hod']:
            return qs.filter(department=self.request.user.department)
        return qs

class BulkHODDeleteView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request):
        if request.user.role != 'principal' and not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        count, _ = User.objects.filter(role='hod').delete()
        AuditLog.objects.create(user=request.user, action='file_upload', status='success', message=f"Deleted all {count} HODs")
        return Response({"message": f"Deleted {count} HODs."}, status=status.HTTP_200_OK)

class BulkTeacherDeleteView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request):
        if request.user.role not in ['hod', 'principal'] and not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        qs = User.objects.filter(role='teacher')
        if request.user.role == 'hod':
            qs = qs.filter(department=request.user.department)
            
        count, _ = qs.delete()
        AuditLog.objects.create(user=request.user, action='file_upload', status='success', message=f"Deleted {count} Teachers")
        return Response({"message": f"Deleted {count} Teachers."}, status=status.HTTP_200_OK)

class BulkStudentDeleteView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request):
        if request.user.role not in ['teacher', 'hod', 'principal'] and not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        qs = User.objects.filter(role='student')
        if request.user.role in ['teacher', 'hod']:
            qs = qs.filter(department=request.user.department)
            
        count, _ = qs.delete()
        AuditLog.objects.create(user=request.user, action='file_upload', status='success', message=f"Deleted {count} Students")
        return Response({"message": f"Deleted {count} Students."}, status=status.HTTP_200_OK)
