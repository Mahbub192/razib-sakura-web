# Project Information

## Doctor Information
- **Doctor Name:** Dr. Ashraful Islam Razib
- **Full Name:** Dr. Ashraful Islam Razib

## System Overview
This healthcare management system is designed for **Dr. Ashraful Islam Razib** to manage patient appointments, medical records, and clinic operations through a comprehensive dashboard system.

## User Roles

The system supports four distinct user roles:

### 1. **Doctor** (`doctor`)
- Primary user: Dr. Ashraful Islam Razib
- Access to doctor dashboard
- Manage patients, appointments, and medical records
- View reports and analytics
- Manage assistants and clinic settings

### 2. **Assistant** (`assistant`)
- Medical assistants working under Dr. Ashraful Islam Razib
- Access to assistant dashboard
- Manage patient appointments
- Handle patient communications
- View and manage patient records
- Schedule appointments on behalf of patients
- Access to calendar, reports, and settings

### 3. **Patient** (`patient`)
- Patients booking appointments with Dr. Ashraful Islam Razib
- Access to patient portal
- Book and manage appointments
- View medical records and lab results
- Access prescriptions
- Communicate with doctor/assistant
- Manage personal profile

### 4. **Admin** (`admin`)
- System administrators
- Full access to all features
- Manage users, clinics, and system settings
- Access to analytics and reports
- User management capabilities

## Role-Based Access Control

### Protected Routes
- `/patient/*` - Accessible by: `patient`, `admin`
- `/doctor/*` - Accessible by: `doctor`, `admin`
- `/assistant/*` - Accessible by: `assistant`, `admin`
- `/admin/*` - Accessible by: `admin` only

### Public Routes
- `/` - Home page
- `/auth/*` - Authentication pages (login, register, forgot password, etc.)
- `/appointments` - Public appointment booking
- `/appointments/confirmed` - Appointment confirmation
- `/help` - Help page
- `/privacy` - Privacy policy

## Authentication Flow

1. User visits login page (`/auth/login`)
2. Enters credentials (phone number + password)
3. System validates credentials and returns JWT token
4. Token stored in cookies and localStorage
5. User role stored in cookies
6. Middleware checks role-based access for protected routes
7. User redirected to appropriate dashboard based on role

## Key Features

### Assistant Features
- Dashboard with today's appointments and statistics
- Appointment management (view, create, edit, cancel)
- Patient management (search, view details, timeline)
- Calendar view for appointments
- Reports and analytics
- Communications (SMS/Email with patients)
- Settings (notifications, clinic info)

### Patient Features
- Book appointments with Dr. Ashraful Islam Razib
- View appointment history
- Access medical records
- View lab results
- Manage prescriptions
- Message doctor/assistant
- Profile management

### Doctor Features
- Dashboard overview
- Patient management
- Appointment scheduling
- Medical records management
- Assistant management
- Reports and analytics
- Clinic settings

## Technology Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 3
- **Authentication:** JWT-based with role-based access control
- **State Management:** React Hooks (useState, useEffect)
- **API:** RESTful API integration

## Constants

Doctor name is defined in `/lib/constants.ts`:
```typescript
export const DOCTOR_NAME = 'Dr. Ashraful Islam Razib'
export const DOCTOR_FULL_NAME = 'Dr. Ashraful Islam Razib'
```

Use these constants throughout the application instead of hardcoding the doctor name.

