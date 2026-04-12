import sys
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class DualIdentifierBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        identifier = username or kwargs.get('email') or kwargs.get('phone_number')
        
        if not identifier:
            return None
            
        sys.stderr.write(f"\n[AUTH] Identifying: {identifier}\n")
            
        try:
            if '@' in identifier:
                user = User.objects.filter(email=identifier).first()
            else:
                # Sanitize input: remove non-digits for phone matching
                ident_clean = ''.join(filter(str.isdigit, identifier))
                user = User.objects.filter(Q(phone_number=ident_clean) | Q(username=identifier)).first()
                
            if user:
                sys.stderr.write(f"[AUTH] User Found: {user.email}\n")
                # Force strip password to handle accidental whitespaces
                clean_password = password.strip() if password else ""
                
                if user.check_password(clean_password):
                    sys.stderr.write(f"[AUTH] Password Correct\n")
                    return user
                else:
                    sys.stderr.write(f"[AUTH] Password FAILED for {user.email} (len: {len(clean_password)})\n")
            else:
                sys.stderr.write(f"[AUTH] User NOT Found\n")
                
        except Exception as e:
            sys.stderr.write(f"[AUTH] Exception: {str(e)}\n")
            return None
            
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
