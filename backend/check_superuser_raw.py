import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, username, email, is_superuser, role FROM users_user WHERE is_superuser = 1")
    rows = cursor.fetchall()
    print("Superuser(s) found:")
    for row in rows:
        print(f"ID: {row[0]}, Username: {row[1]}, Email: {row[2]}, is_superuser: {row[3]}, Role: {row[4]}")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
