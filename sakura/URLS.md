# Sakura - Full Application URLs

## Development URLs (Local)
Base URL: `http://localhost:3000`

---

## ✅ Implemented Routes - Full URLs

### Public Routes

#### Home
- **`http://localhost:3000/`** - Home page
  - Hero section, Services, Testimonials, FAQ

---

### Authentication Routes

- **`http://localhost:3000/auth/login`** - Login page
- **`http://localhost:3000/auth/register`** - Registration page
- **`http://localhost:3000/auth/forgot-password`** - Forgot password page
- **`http://localhost:3000/auth/reset-password`** - Reset password page
- **`http://localhost:3000/auth/verify`** - Email/Phone verification page

---

### Patient Portal Routes ✅

#### Dashboard
- **`http://localhost:3000/patient/dashboard`** ✅
  - Welcome message
  - Upcoming appointments
  - Secure messages
  - Quick access cards

#### Appointments
- **`http://localhost:3000/patient/appointments`** ✅
  - List of appointments (Upcoming/Past)
  - Appointment cards with doctor info
  - Reschedule, Cancel, View Details

#### Medical Records
- **`http://localhost:3000/patient/medical-records`** ✅
  - Medical records list
  - Search and filters
  - Category tabs
  - Download/Print options

#### Lab Results
- **`http://localhost:3000/patient/lab-results`** ✅
  - Lab results table
  - Status indicators
  - Doctor's notes
  - Download/Print options

#### Messages
- **`http://localhost:3000/patient/messages`** ✅
  - Secure messaging
  - Conversation list
  - Chat interface

#### Prescriptions
- **`http://localhost:3000/patient/prescriptions`** ✅
  - Active prescriptions
  - Past prescriptions
  - Request refills

#### Profile
- **`http://localhost:3000/patient/profile`** ✅
  - Profile management
  - Update personal information
  - Change profile photo

---

### Doctor Dashboard Routes

#### Assistants
- **`http://localhost:3000/doctor/assistants`** ✅ - Assistant management
- **`http://localhost:3000/doctor/assistants/schedule`** ✅ - Assistant schedule management

#### Other Doctor Routes (Folders exist, pages to be created)
- **`http://localhost:3000/doctor/dashboard`** - Doctor main dashboard
- **`http://localhost:3000/doctor/patients`** - Patient management
- **`http://localhost:3000/doctor/calendar`** - Calendar view
- **`http://localhost:3000/doctor/reports`** - Reports and analytics
- **`http://localhost:3000/doctor/communications`** - Patient communications
- **`http://localhost:3000/doctor/settings/profile`** - Profile settings
- **`http://localhost:3000/doctor/settings/notifications`** - Notification preferences
- **`http://localhost:3000/doctor/settings/clinic`** - Clinic information
- **`http://localhost:3000/doctor/settings/security`** - Security settings

---

### Assistant Dashboard Routes (Folders exist)

- **`http://localhost:3000/assistant/dashboard`** - Assistant dashboard
- **`http://localhost:3000/assistant/appointments`** - Appointments management
- **`http://localhost:3000/assistant/appointments/new`** - Create new appointment
- **`http://localhost:3000/assistant/calendar`** - Calendar view
- **`http://localhost:3000/assistant/patients`** - Patient management
- **`http://localhost:3000/assistant/communications`** - Communications
- **`http://localhost:3000/assistant/reports`** - Reports
- **`http://localhost:3000/assistant/settings`** - Settings

---

### Appointment Routes

- **`http://localhost:3000/appointments`** - General appointments page
- **`http://localhost:3000/appointments/confirmed`** - Appointment confirmation page

---

### Admin Routes

- **`http://localhost:3000/admin`** - Admin dashboard (to be created)

---

## Quick Access URLs

### Most Used Patient URLs
```
http://localhost:3000/patient/dashboard
http://localhost:3000/patient/appointments
http://localhost:3000/patient/medical-records
http://localhost:3000/patient/lab-results
http://localhost:3000/patient/messages
http://localhost:3000/patient/prescriptions
http://localhost:3000/patient/profile
```

### Authentication URLs
```
http://localhost:3000/auth/login
http://localhost:3000/auth/register
http://localhost:3000/auth/forgot-password
http://localhost:3000/auth/reset-password
http://localhost:3000/auth/verify
```

### Doctor URLs
```
http://localhost:3000/doctor/assistants
http://localhost:3000/doctor/assistants/schedule
```

---

## Production URLs (Example)

If deployed to production, replace `localhost:3000` with your domain:

### Example Production URLs
```
https://sakura-healthcare.com/
https://sakura-healthcare.com/auth/login
https://sakura-healthcare.com/patient/dashboard
https://sakura-healthcare.com/doctor/assistants
```

---

## Special Pages

- **`http://localhost:3000/loading`** - Loading state
- **`http://localhost:3000/error`** - Error page
- **`http://localhost:3000/not-found`** - 404 page

---

## How to Access

1. **Start Development Server:**
   ```bash
   cd sakura
   npm run dev
   ```

2. **Open in Browser:**
   - Home: `http://localhost:3000`
   - Patient Dashboard: `http://localhost:3000/patient/dashboard`
   - Login: `http://localhost:3000/auth/login`

---

## URL Structure Pattern

```
http://localhost:3000/{route-path}
```

### Examples:
- Patient routes: `http://localhost:3000/patient/{page}`
- Doctor routes: `http://localhost:3000/doctor/{page}`
- Auth routes: `http://localhost:3000/auth/{page}`
- Assistant routes: `http://localhost:3000/assistant/{page}`

---

## Status Legend

- ✅ **Fully Implemented** - Page created and ready to use
- 📁 **Folder Exists** - Route folder created, page needs implementation
- ⏳ **To Be Created** - Route not yet created

