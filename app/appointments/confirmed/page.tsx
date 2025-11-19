'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  
  // Get appointment details from URL params or use defaults
  const patientName = searchParams.get('patientName') || 'Alex Johnson'
  const date = searchParams.get('date') || 'Monday, October 28th'
  const time = searchParams.get('time') || '10:30 AM (PST)'
  const clinicName = searchParams.get('clinicName') || 'CardioHealth Clinic'
  const clinicAddress = searchParams.get('clinicAddress') || '123 Wellness Ave, Suite 101, Medville'
  const phoneNumber = searchParams.get('phoneNumber') || '(555) 123-4567'
  const doctorName = searchParams.get('doctorName') || 'Dr. Emily Carter'
  const doctorSpecialty = searchParams.get('doctorSpecialty') || 'Cardiologist'

  const handleAddToCalendar = () => {
    // TODO: Implement calendar integration (Google Calendar, iCal, etc.)
    // For now, create a simple calendar event
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // 30 minutes later
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment with ${doctorName}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Appointment at ${clinicName}&location=${clinicAddress}`
    
    window.open(calendarUrl, '_blank')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 dark:border-b-slate-800 px-4 sm:px-10 py-3 bg-white dark:bg-background-dark">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">HealthCare</h2>
          </div>
          <div className="flex flex-1 justify-end gap-2 sm:gap-4">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeZzZDGV7Dlq16JbM4mZiPh2a7XVau7oR0o0_GTcrjKaY738frEEWXvwcMF6HbWFoovi4jrkm0tQgLjHQvr6kYZchp6f5BF7Xa2hTBdkivBsUnx7CH0tq1dmawcFfIgds7UMBNVwardlNj0dVme4vQyD4x-72JbHPyg-KMWA_thzfB3XcDjDm1l4sOCwUpSJ4pZKkgthRRxMj7FpRFFabIJYfQk9Ei7X54OHeztPWW1k9jUYtVidLLJsr1iENr8rarxdMvneEcIWE")',
              }}
            />
          </div>
        </header>

        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="layout-content-container flex flex-col max-w-2xl w-full flex-1">
            {/* Success Message */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center size-16 rounded-full bg-[#16a34a]/20 mb-4">
                <span className="material-symbols-outlined text-3xl text-[#16a34a]">check_circle</span>
              </div>
              <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold leading-tight pb-2 pt-2">
                Appointment Confirmed!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-6 max-w-md">
                Your appointment has been successfully scheduled. A confirmation has been sent to your email address.
              </p>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              {/* Doctor Info */}
              <div className="p-6 @container">
                <div className="flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-start">
                  <div
                    className="w-full sm:w-1/3 max-w-[150px] mx-auto sm:mx-0 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiel2ORpE4RGWMWxMMBK4bm56aNnqRNJh0jE1AwNfLTOcFsLSiXKo53qr_kgNGptmcMm3exLD5oxLZY63VAbprXJQCyt2ErIPMF15vTr7RVzMe_hTgMiuBwWE37XQtptZlQo9eN9cd318z3S5qZNenjAMXncokOFiLx8HBI2JORTpiBRDUwplG-P6LIA5s8QUq5OEwq9Gwd4h9cw0Ex-2mkQ2tJDRnMtXSQeG8rwket-5QO_xWJb5WFUd8TB4acKHwtCJUmLTCgOU")',
                    }}
                  />
                  <div className="flex w-full flex-col items-stretch justify-center gap-1 text-center sm:text-left">
                    <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                      {doctorName}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                      {doctorSpecialty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="p-6">
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Patient Name</p>
                  <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal text-right">
                    {patientName}
                  </p>
                </div>
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Date</p>
                  <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal text-right">{date}</p>
                </div>
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Time</p>
                  <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal text-right">{time}</p>
                </div>
              </div>

              {/* Clinic Details */}
              <div className="p-6">
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Clinic Name</p>
                  <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal text-right">
                    {clinicName}
                  </p>
                </div>
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Clinic Address</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium leading-normal text-right hover:underline"
                  >
                    {clinicAddress}
                  </a>
                </div>
                <div className="flex justify-between gap-x-6 py-2.5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Phone Number</p>
                  <a
                    href={`tel:${phoneNumber.replace(/\D/g, '')}`}
                    className="text-[#111418] dark:text-white text-sm font-medium leading-normal text-right hover:text-primary"
                  >
                    {phoneNumber}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleAddToCalendar}
                className="flex w-full items-center justify-center rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-wide px-6 transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">event</span>
                <span>Add to Calendar</span>
              </button>
              <Link
                href="/patient/appointments"
                className="flex w-full items-center justify-center rounded-lg h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-wide px-6 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span>View All Appointments</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AppointmentConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}

