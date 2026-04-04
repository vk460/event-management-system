from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class DualIdentifierBackend(ModelBackend):
    """
    Custom authentication backend that allows:
    1. Admins to authenticate using email.
    2. Other roles (Staff/Students) to authenticate using phone_number.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username:
            return None
            
        try:
            # Check for email matches (intended for Admin)
            if '@' in username:
                user = User.objects.get(email=username)
            else:
                # Check for phone_number matches (intended for Students/Staff)
                user = User.objects.get(phone_number=username)
                
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
