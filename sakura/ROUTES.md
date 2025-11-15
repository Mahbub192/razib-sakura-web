# Sakura - Application Routes

## ✅ Implemented Routes

### Public Routes

#### Home
- **`/`** - Home page
  - Hero section
  - Meet Dr. section
  - Statistics
  - Services
  - Why Choose Us
  - Testimonials
  - FAQ
  - Footer

---

### Authentication Routes

- **`/auth/login`** - Login page
- **`/auth/register`** - Registration page
- **`/auth/forgot-password`** - Forgot password page
- **`/auth/reset-password`** - Reset password page
- **`/auth/verify`** - Email/Phone verification page

---

### Patient Portal Routes ✅

#### Dashboard
- **`/patient/dashboard`** ✅
  - Welcome message
  - Important notifications
  - Upcoming appointments (2 cards)
  - Secure messages sidebar
  - Quick access cards (Medical Records, Lab Results, Prescriptions)

#### Appointments
- **`/patient/appointments`** ✅
  - Tabs: Upcoming / Past
  - Appointment cards with doctor info
  - Status badges (Confirmed)
  - Actions: Reschedule, Cancel, View Details

#### Medical Records
- **`/patient/medical-records`** ✅
  - Search and filters
  - Category tabs (All Records, Diagnoses, Medications, Allergies, Vaccinations, Lab Results)
  - Record cards with icons and status
  - Pagination
  - Download/Print options

#### Lab Results
- **`/patient/lab-results`** ✅
  - Results table with status indicators
  - Color-coded status (Normal, Borderline High, Low)
  - Doctor's notes section
  - Download/Print options

#### Messages
- **`/patient/messages`** ✅
  - Conversation list sidebar
  - Chat window
  - Message input
  - Online status indicators

#### Prescriptions
- **`/patient/prescriptions`** ✅
  - Active prescriptions section
  - Past prescriptions section
  - Refill requests
  - Status indicators

#### Profile
- **`/patient/profile`** ✅
  - Profile photo upload
  - Form fields (Name, Phone, Email, Age, Gender, Address)
  - Save/Cancel buttons

---

### Doctor Dashboard Routes

#### Assistants
- **`/doctor/assistants`** ✅ - Assistant management
- **`/doctor/assistants/schedule`** ✅ - Assistant schedule management

#### Other Doctor Routes (Folders exist, pages to be created)
- **`/doctor/dashboard`** - Doctor main dashboard
- **`/doctor/patients`** - Patient management
- **`/doctor/calendar`** - Calendar view
- **`/doctor/reports`** - Reports and analytics
- **`/doctor/communications`** - Patient communications
- **`/doctor/settings/profile`** - Profile settings
- **`/doctor/settings/notifications`** - Notification preferences
- **`/doctor/settings/clinic`** - Clinic information
- **`/doctor/settings/security`** - Security settings

---

### Assistant Dashboard Routes (Folders exist)

- **`/assistant/dashboard`** - Assistant dashboard
- **`/assistant/appointments`** - Appointments management
- **`/assistant/appointments/new`** - Create new appointment
- **`/assistant/calendar`** - Calendar view
- **`/assistant/patients`** - Patient management
- **`/assistant/communications`** - Communications
- **`/assistant/reports`** - Reports
- **`/assistant/settings`** - Settings

---

### Appointment Routes

- **`/appointments`** - General appointments page
- **`/appointments/confirmed`** - Appointment confirmation page

---

### Admin Routes

- **`/admin`** - Admin dashboard (to be created)

---

## Route Structure

```
/
├── / (Home) ✅
│
├── /auth/
│   ├── /login ✅
│   ├── /register ✅
│   ├── /forgot-password ✅
│   ├── /reset-password ✅
│   └── /verify ✅
│
├── /patient/ ✅ (Fully Implemented)
│   ├── /dashboard ✅
│   ├── /appointments ✅
│   ├── /medical-records ✅
│   ├── /lab-results ✅
│   ├── /messages ✅
│   ├── /prescriptions ✅
│   └── /profile ✅
│
├── /doctor/
│   ├── /assistants ✅
│   │   └── /schedule ✅
│   ├── /dashboard (folder exists)
│   ├── /patients (folder exists)
│   ├── /calendar (folder exists)
│   ├── /reports (folder exists)
│   ├── /communications (folder exists)
│   └── /settings/
│       ├── /profile (folder exists)
│       ├── /notifications (folder exists)
│       ├── /clinic (folder exists)
│       └── /security (folder exists)
│
├── /assistant/ (folders exist)
│   ├── /dashboard
│   ├── /appointments/
│   │   └── /new
│   ├── /calendar
│   ├── /patients
│   ├── /communications
│   ├── /reports
│   └── /settings
│
├── /appointments/
│   ├── / (general)
│   └── /confirmed
│
└── /admin (to be created)
```

---

## Navigation Structure

### Header Navigation (Public)
- Home (`/`)
- Find a Doctor (`/find-doctor` - to be created)
- My Appointments (`/appointments`)
- Messages (`/messages` - to be created)

### Patient Sidebar Navigation
- Dashboard (`/patient/dashboard`)
- Appointments (`/patient/appointments`)
- Medical Records (`/patient/medical-records`)
- Lab Results (`/patient/lab-results`)
- Messages (`/patient/messages`)
- Prescriptions (`/patient/prescriptions`)
- Update Profile (`/patient/profile`)
- Log Out (`/auth/login`)

---

## Special Pages

- **`/loading`** - Loading state (app/loading.tsx)
- **`/error`** - Error page (app/error.tsx)
- **`/not-found`** - 404 page (app/not-found.tsx)

---

## Status Legend

- ✅ **Fully Implemented** - Page created with complete UI
- 📁 **Folder Exists** - Route folder created, page needs implementation
- ⏳ **To Be Created** - Route not yet created

---

## Quick Access

### Patient Portal (All Implemented)
- Dashboard: `/patient/dashboard`
- Appointments: `/patient/appointments`
- Medical Records: `/patient/medical-records`
- Lab Results: `/patient/lab-results`
- Messages: `/patient/messages`
- Prescriptions: `/patient/prescriptions`
- Profile: `/patient/profile`

### Doctor Portal (Partially Implemented)
- Assistants: `/doctor/assistants`
- Assistant Schedule: `/doctor/assistants/schedule`

### Authentication
- Login: `/auth/login`
- Register: `/auth/register`
- Forgot Password: `/auth/forgot-password`
- Reset Password: `/auth/reset-password`
- Verify: `/auth/verify`
