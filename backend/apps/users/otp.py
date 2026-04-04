import random
import string
from django.utils import timezone
from datetime import timedelta

def generate_otp(length=6):
    # Static OTP for testing - REVERT BEFORE PRODUCTION
    return '123456'

def send_otp_placeholder(user, otp):
    # Placeholder for email/SMS service
    print("\n" + "="*40)
    print(f"DEBUG: Sending OTP {otp} to user {user.username}")
    print("="*40 + "\n")
    user.otp = otp
    user.otp_expiry = timezone.now() + timedelta(minutes=10) # Extended for testing
    user.save()

def verify_otp(user, otp):
    if user.otp == otp and user.otp_expiry > timezone.now():
        # Clear after success
        user.otp = None
        user.otp_expiry = None
        user.save()
        return True
    return False
