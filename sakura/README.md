# Sakura - Healthcare Management System

A comprehensive healthcare management system with patient portal, doctor dashboard, and clinic management features.

Built with **Next.js 14** (App Router), **TypeScript**, and **React**.

## Project Structure

```
sakura/
├── app/                    # Next.js App Router directory
│   ├── auth/               # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify/
│   ├── patient/            # Patient portal routes
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── medical-records/
│   │   ├── lab-results/
│   │   ├── messages/
│   │   ├── prescriptions/
│   │   └── profile/
│   ├── doctor/             # Doctor dashboard routes
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── calendar/
│   │   ├── reports/
│   │   ├── settings/
│   │   │   ├── profile/
│   │   │   ├── notifications/
│   │   │   ├── clinic/
│   │   │   └── security/
│   │   └── communications/
│   ├── admin/              # Admin routes
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css          # Global styles
│   ├── loading.tsx          # Loading UI
│   ├── error.tsx            # Error UI
│   └── not-found.tsx        # 404 page
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── features/           # Feature-specific components
│       ├── auth/
│       ├── patient/
│       ├── doctor/
│       ├── appointments/
│       ├── medical-records/
│       ├── prescriptions/
│       ├── lab-results/
│       └── messages/
├── lib/                     # Library utilities
│   ├── utils/              # Helper functions
│   ├── api/                # API client
│   └── validations/        # Form validations
├── hooks/                   # Custom React hooks
├── context/                 # React context providers
├── types/                   # TypeScript type definitions
├── constants/               # Application constants
├── public/                  # Static files
│   ├── images/
│   ├── fonts/
│   └── icons/
└── docs/                    # Documentation
```

## Features

### Patient Portal
- User authentication (Login, Registration, Password Reset)
- Appointment booking and management
- Medical records access
- Lab results viewing
- Prescription management
- Secure messaging with doctors
- Profile management

### Doctor Dashboard
- Patient management
- Appointment scheduling
- Medical records management
- Prescription creation
- Lab results review
- Patient communication
- Analytics and reports
- Settings and preferences

### Clinic Management
- Assistant schedule management
- Clinic information management
- Notification preferences
- Security settings

### Assistant Management
- Assistant list and profile management
- Schedule creation and management
- Shift assignment
- Calendar view for schedules
- Weekly/Monthly schedule views

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS 4.x
- **State Management:** (To be added)
- **Database:** (To be added)
- **Authentication:** (To be added)

## Tailwind CSS

Tailwind CSS is installed and configured. You can use Tailwind utility classes throughout your components.

### Configuration Files:
- `tailwind.config.js` - Tailwind configuration with custom primary color palette
- `postcss.config.js` - PostCSS configuration
- `app/globals.css` - Global styles with Tailwind directives

### Example Usage:
```tsx
<div className="flex items-center justify-center min-h-screen bg-gray-50">
  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
    Click me
  </button>
</div>
```

