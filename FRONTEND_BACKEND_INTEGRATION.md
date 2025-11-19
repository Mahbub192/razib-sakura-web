# Frontend-Backend Integration Guide

## ✅ Status: Complete

### Summary
Successfully integrated the frontend Next.js application with the NestJS backend API. All API clients are created and key pages are connected to the backend.

---

## 📋 Integration Details

### 1. **API Client Setup**

#### Base API Client (`lib/api/client.ts`)
✅ **Features:**
- Handles both absolute and relative URLs
- Automatic JWT token management (localStorage + cookies)
- Error handling
- Response transformation
- Default base URL: `http://localhost:3001/api`

#### API Client Files Created:
- ✅ `lib/api/patients.ts` - Patient API functions
- ✅ `lib/api/doctors.ts` - Doctor API functions
- ✅ `lib/api/assistants.ts` - Assistant API functions (updated)

### 2. **Frontend Pages Integrated**

#### Patient Portal:
- ✅ **Dashboard** (`app/patient/dashboard/page.tsx`)
  - Fetches dashboard data from API
  - Displays upcoming appointments
  - Shows secure messages
  - Lab results notification
  - Loading and error states

- ✅ **Appointments** (`app/patient/appointments/page.tsx`)
  - Fetches appointments with status filter
  - Tab switching (Upcoming/Past)
  - Cancel appointment functionality
  - Dynamic appointment cards

#### Doctor Portal:
- ✅ **Dashboard** (`app/doctor/dashboard/page.tsx`)
  - Fetches dashboard data from API
  - Today's appointments
  - Weekly chart data
  - Statistics cards
  - Loading and error states

### 3. **Environment Configuration**

✅ **Created `.env.example`** with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Sakura
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

**Note:** Copy `.env.example` to `.env.local` for local development.

---

## 🔌 API Endpoints Mapping

### Patient Endpoints:
- `GET /api/patients/dashboard` → `patientApi.getDashboard()`
- `GET /api/patients/profile` → `patientApi.getProfile()`
- `GET /api/patients/:id/appointments` → `patientApi.getAppointments()`
- `GET /api/patients/:id/medical-records` → `patientApi.getMedicalRecords()`
- `GET /api/patients/:id/lab-results` → `patientApi.getLabResults()`
- `GET /api/patients/:id/prescriptions` → `patientApi.getPrescriptions()`
- `GET /api/patients/:id/messages` → `patientApi.getMessages()`

### Doctor Endpoints:
- `GET /api/doctors/dashboard` → `doctorApi.getDashboard()`
- `GET /api/doctors/profile` → `doctorApi.getProfile()`
- `GET /api/doctors/:id/patients` → `doctorApi.getPatients()`
- `GET /api/doctors/:id/appointments` → `doctorApi.getAppointments()`
- `GET /api/doctors/:id/reports` → `doctorApi.getReports()`

### Assistant Endpoints:
- `GET /api/assistants` → `assistantApi.getAssistants()`
- `GET /api/assistants/:id/shifts` → `assistantApi.getShifts()`
- `POST /api/assistants/:id/shifts` → `assistantApi.createShift()`

---

## 🔄 Data Flow

### Request Flow:
1. Frontend component calls API function (e.g., `patientApi.getDashboard()`)
2. API client adds JWT token from localStorage/cookies
3. Request sent to backend (`http://localhost:3001/api/...`)
4. Backend processes request and returns formatted data
5. Frontend receives response and updates UI

### Response Format:
```typescript
{
  success: true,
  data: { ... } // Formatted data matching frontend expectations
}
```

---

## 🎯 Features Implemented

### ✅ Patient Dashboard:
- Real-time appointment data
- Secure messages list
- Lab results notification
- Loading states
- Error handling

### ✅ Patient Appointments:
- Dynamic appointment list
- Status filtering (Upcoming/Past)
- Cancel appointment
- Status badges
- Empty states

### ✅ Doctor Dashboard:
- Today's appointments
- Weekly chart (dynamic data)
- Statistics cards
- Loading states
- Error handling

---

## 🚀 Setup Instructions

### 1. **Backend Setup:**
```bash
cd sakura-backend-code
npm install
# Ensure PostgreSQL is running
npm run start:dev
# Backend runs on http://localhost:3001
```

### 2. **Frontend Setup:**
```bash
cd sakura
# Copy environment file
cp .env.example .env.local
# Edit .env.local if needed
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. **Environment Variables:**
Create `.env.local` in the `sakura` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📝 Next Steps

### To Complete Integration:

1. **Add Authentication:**
   - Implement login/logout
   - Store JWT token after login
   - Handle token refresh

2. **Integrate Remaining Pages:**
   - Patient: Medical Records, Lab Results, Prescriptions, Messages
   - Doctor: Patients, Calendar, Reports, Communications
   - Assistant: Schedule management

3. **Add Error Handling:**
   - Global error boundary
   - Toast notifications for API errors
   - Retry mechanisms

4. **Add Loading States:**
   - Skeleton loaders
   - Optimistic updates
   - Caching strategies

---

## 🔍 Testing

### Test API Connection:
1. Start backend: `cd sakura-backend-code && npm run start:dev`
2. Start frontend: `cd sakura && npm run dev`
3. Open browser: `http://localhost:3000`
4. Check browser console for API calls
5. Verify data loads in dashboards

### Common Issues:

**CORS Error:**
- Ensure backend CORS is configured for `http://localhost:3000`
- Check `main.ts` in backend

**401 Unauthorized:**
- Ensure JWT token is set in localStorage
- Check token expiration
- Verify token format

**404 Not Found:**
- Verify backend is running on port 3001
- Check API endpoint paths match
- Verify route definitions

---

## ✅ Integration Checklist

- [x] API client created and configured
- [x] Patient API functions implemented
- [x] Doctor API functions implemented
- [x] Assistant API functions implemented
- [x] Patient dashboard integrated
- [x] Patient appointments integrated
- [x] Doctor dashboard integrated
- [x] Environment configuration
- [x] Error handling
- [x] Loading states
- [ ] Authentication flow
- [ ] Remaining pages integration
- [ ] Error boundaries
- [ ] Toast notifications

---

**Last Updated:** Frontend-Backend integration complete for key pages.


