# 🛡️ Secure Event Management System

A high-security, full-stack event management platform designed for educational institutions. This system provides role-based access control (RBAC), multi-factor authentication, and comprehensive event tracking for Students, Teachers, HODs, and Principals.

---

## 🚀 Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5AD?style=for-the-badge&logo=react&logoColor=white)

### Backend
![Django](https://img.shields.io/badge/django-%23092e20.svg?style=for-the-badge&logo=django&logoColor=white)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=008CFF)

---

## ✨ Key Features

### 🔐 High Security & Auth
- **Multi-Factor Authentication (2FA)**: Secure login using OTP verification via `pyotp`.
- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for:
  - **Principal**: High-level overview and institutional reports.
  - **HOD (Head of Department)**: Department-specific event management and approvals.
  - **Teacher**: Event coordination, attendance tracking, and student management.
  - **Student**: Event registration, certificates, and personal logs.
  - **Admin**: System configuration and user management.
- **JWT Authentication**: Secure API communication using stateless tokens.
- **Detailed Audit Logs**: Tracking user actions and system changes.

### 📅 Event Management
- **Full Lifecycle Tracking**: From creation and approval to execution and reporting.
- **Attendance System**: Digital attendance tracking for all participants.
- **Departmental Segregation**: Events can be managed at a departmental or institutional level.
- **Media Support**: Upload and manage event-related media and documents.

### 📊 Dashboard & Analytics
- **Visual Analytics**: Interactive charts using `Recharts` for attendance and event metrics.
- **Data Export/Import**: Support for Excel/CSV data management using `pandas` and `openpyxl`.

### 💳 Payments & Finance
- **Razorpay Integration**: Secure handling of registration fees and event finances.

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Optional, defaults to SQLite for local dev)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in your details (DB, Secret Key, Razorpay API, etc.).
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### 🧪 Data Seeding
To populate the database with initial data (departments, demo users, etc.), run the following scripts from the backend directory:
```bash
python seed_departments.py
python seed_strategic.py
python seed_institutional_demos.py
```
*Refer to the various `seed_*.py` and `create_*.py` files in the backend root for specific data initialization needs.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
├── backend/
│   ├── apps/          # Django Applications (users, events, attendance, etc.)
│   ├── config/        # Project settings and root URLs
│   ├── utils/         # Helper functions and decorators
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/       # Axios API configurations
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Role-specific views and dashboards
│   │   └── context/   # React Context providers (Auth, etc.)
│   └── vite.config.js
└── README.md
```

---

## 🔒 Security Implementation

This project implements several security best practices:
- **Environment Isolation**: Sensitive keys are managed via `.env` files.
- **Password Hashing**: Django's default PBKDF2 with SHA256.
- **2FA**: Time-based One-Time Passwords (TOTP) for sensitive roles.
- **CORS Configuration**: Restricting API access to trusted origins.
- **Input Validation**: Strict schema validation for all API endpoints.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details (if applicable).
