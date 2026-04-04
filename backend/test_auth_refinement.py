import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_admin_email_login():
    print("\n--- Testing Admin Email login (Sankalp) ---")
    payload = {
        "username": "sankalpvasekar@gmail.com",
        "password": "vscode@123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    data = response.json()
    print(f"Status Code: {response.status_code}")
    print(f"Response: {data}")
    assert response.status_code == 200
    assert data.get('bypass_otp') is True
    print("✅ Admin Email Login Success")
    return data.get('access')

def test_admin_create_user(token):
    print("\n--- Testing Admin Create User ---")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "username": "9988776655",
        "password": "user@123",
        "role": "teacher",
        "email": "teacher_test@example.com",
        "first_name": "Test",
        "last_name": "Teacher"
    }
    # Clean up if exists
    response = requests.post(f"{BASE_URL}/auth/admin-create-user/", json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    # If 400, it might already exist, which is fine for this test script if it's rerun
    if response.status_code == 400:
         print("Note: User might already exist.")
    else:
        assert response.status_code == 201
        print("✅ Admin Create User Success")

def test_user_phone_login():
    print("\n--- Testing User Phone login ---")
    payload = {
        "username": "9988776655",
        "password": "user@123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    data = response.json()
    print(f"Status Code: {response.status_code}")
    print(f"Response: {data}")
    assert response.status_code == 200
    assert data.get('bypass_otp') is False
    print("✅ User Phone Login Success (Reached OTP stage)")

def test_restrictions():
    print("\n--- Testing Login Restrictions ---")
    
    # 1. Admin trying to login with username (if we had one) or if we passed a phone for admin
    # In our case, the logic is: if '@' in identifier, check superuser.
    
    # 2. Regular user trying to login with email
    print("Testing regular user trying to login with email (should fail logic)...")
    payload = {
        "username": "teacher_test@example.com",
        "password": "user@123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    print(f"Status Code: {response.status_code} | Response: {response.json()}")
    assert response.status_code == 404
    assert response.json().get('error') == "Admin email not found"
    print("✅ Restriction Success: Regular user cannot login via email")

if __name__ == "__main__":
    try:
        admin_token = test_admin_email_login()
        test_admin_create_user(admin_token)
        test_user_phone_login()
        test_restrictions()
        print("\n🎉 ALL DUAL-LOGIN TESTS PASSED SUCCESSFULLY!")
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
