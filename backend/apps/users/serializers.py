from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'role', 'first_name', 'last_name', 'department', 'department_name', 'department_code')
        read_only_fields = ('id', 'role', 'department_name', 'department_code')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(source='first_name', required=False)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'name', 'password', 'email', 'phone_number', 'role')

    def validate_phone_number(self, value):
        if value and (not value.isdigit() or len(value) < 10):
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value

    def create(self, validated_data):
        # Use phone_number as username if username is not provided or is empty
        username = validated_data.get('username')
        if not username:
             username = validated_data.get('phone_number')
        
        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            phone_number=validated_data.get('phone_number'),
            role=validated_data.get('role', 'student'),
            first_name=validated_data.get('first_name', '')
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class OTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp = serializers.CharField()
