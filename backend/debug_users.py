import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, username, email, is_superuser, password, role, phone_number FROM users_user")
    rows = cursor.fetchall()
    print("User Table Dump:")
    for row in rows:
        print(f"ID: {row[0]}, Username: {row[1]}, Email: {row[2]}, is_superuser: {row[3]}, Role: {row[5]}, Phone: {row[6]}")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
