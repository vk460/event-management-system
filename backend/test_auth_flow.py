import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_admin_bypass():
    print("\n--- Testing Admin Bypass (Email/Password) ---")
    payload = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {data}")
    
    assert response.status_code == 200
    assert data.get('bypass_otp') is True
    assert 'access' in data
    assert data.get('user', {}).get('role') == 'admin'
    print("✅ Admin Bypass Success")

def test_student_otp_flow():
    print("\n--- Testing Student OTP Flow (Phone/Password -> OTP) ---")
    # Step 1: Login
    login_payload = {
        "username": "1234567890",
        "password": "password123"
    }
    login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_payload)
    login_data = login_response.json()
    
    print(f"Login Status: {login_response.status_code}")
    print(f"Login Response: {login_data}")
    
    assert login_response.status_code == 200
    assert login_data.get('bypass_otp') is False
    assert "OTP sent" in login_data.get('message', '')
    
    # Step 2: Verify OTP (Static 123456)
    otp_payload = {
        "username": "1234567890",
        "otp": "123456"
    }
    otp_response = requests.post(f"{BASE_URL}/auth/verify-otp/", json=otp_payload)
    otp_data = otp_response.json()
    
    print(f"OTP Status: {otp_response.status_code}")
    print(f"OTP Response: {otp_data}")
    
    assert otp_response.status_code == 200
    assert 'access' in otp_data
    assert otp_data.get('user', {}).get('role') == 'student'
    print("✅ Student OTP Flow Success")

def test_forgot_password():
    print("\n--- Testing Forgot Password via Email (Sankalp) ---")
    payload = {"username": "sankalpvasekar@gmail.com"}
    response = requests.post(f"{BASE_URL}/auth/forgot-password/", json=payload)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {data}")
    
    assert response.status_code == 200
    assert "Recovery OTP sent" in data.get('message', '')
    print("✅ Forgot Password via Email Success")
    
    # Step 2: Reset Password (using static 123456)
    reset_payload = {
        "username": "1234567890",
        "otp": "123456",
        "new_password": "new_password_123"
    }
    res2 = requests.post(f"{BASE_URL}/auth/reset-password/", json=reset_payload)
    print(f"Reset PW Status: {res2.status_code} - {res2.json()}")
    assert res2.status_code == 200
    
    # Step 3: Verify login with new password
    login_payload = {
        "username": "1234567890",
        "password": "new_password_123"
    }
    res3 = requests.post(f"{BASE_URL}/auth/login/", json=login_payload)
    assert res3.status_code == 200
    print("✅ Forgot Password Flow Success")

if __name__ == "__main__":
    try:
        test_admin_bypass()
        test_student_otp_flow()
        test_forgot_password()
        print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
