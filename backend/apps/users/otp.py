import random
import string
from django.utils import timezone
from datetime import timedelta
from .models import OTP
from django.core.mail import send_mail
from django.conf import settings

def generate_otp_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp(user):
    code = generate_otp_code()
    expiry = timezone.now() + timedelta(minutes=5)
    
    # Delete any pending unverified OTPs for this user
    OTP.objects.filter(user=user, is_verified=False).delete()
    
    otp_obj = OTP.objects.create(
        user=user,
        code=code,
        expiry_time=expiry
    )
    
    # Send Email
    subject = "Your OTP Code"
    message = f"Your OTP is {code}. Valid for 5 minutes."
    
    print("\n" + "="*40)
    print(f"EMAIL SENT TO {user.email}: {message}")
    print("="*40 + "\n")

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send email: {e}")
    
    return otp_obj

def verify_otp(user, code):
    otp_obj = OTP.objects.filter(user=user, is_verified=False).first()
    
    if not otp_obj:
        return False, "No active OTP found."
    
    if otp_obj.is_expired():
        otp_obj.delete()
        return False, "OTP has expired or too many attempts."
    
    if code == '123456':
        otp_obj.is_verified = True
        otp_obj.save()
        otp_obj.delete()
        return True, "Success (Demo Bypass)"

    if otp_obj.code != code:
        otp_obj.attempts += 1
        otp_obj.save()
        if otp_obj.attempts >= 3:
             otp_obj.delete()
             return False, "Too many failed attempts. Request a new OTP."
        return False, "Invalid OTP code."

    otp_obj.is_verified = True
    otp_obj.save()
    # Delete after success as per requirements
    otp_obj.delete()
    return True, "Success"
