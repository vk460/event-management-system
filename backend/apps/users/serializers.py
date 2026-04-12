from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    name = serializers.CharField(source='first_name', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'phone_number', 'password', 'role', 'first_name', 'last_name', 'department', 'department_name', 'department_code', 'reporting_to')
        read_only_fields = ('id', 'role', 'department_name', 'department_code')

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        email = validated_data.get('email', instance.email)
        
        if password:
            print(f"[AUTH] Hashing new password for user {instance.email}")
            instance.set_password(password)
            
        # Keep username in sync with email for consistent login
        if 'email' in validated_data:
            instance.username = validated_data['email']
            
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(source='first_name', required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('username', 'name', 'password', 'email', 'phone_number', 'role', 'department')

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username') or validated_data['email'],
            password=validated_data['password'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number'),
            role=validated_data.get('role', 'student'),
            first_name=validated_data.get('first_name', ''),
            department=validated_data.get('department')
        )
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()

class VerifyOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    code = serializers.CharField(max_length=6)
