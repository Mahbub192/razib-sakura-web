'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { DOCTOR_NAME } from '@/lib/constants'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    age: '',
    location: '',
    patientType: 'new',
    clinic: '',
    selectedDate: '',
    selectedTime: '',
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, patientType: value }))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setFormData((prev) => ({
      ...prev,
      selectedDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }))
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }))
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    // TODO: Implement appointment booking logic
    console.log('Booking appointment:', formData)
    
    // Get clinic details
    const clinicNames: Record<string, string> = {
      main: 'Main Clinic, 123 Health St.',
      downtown: 'Downtown Branch, 456 Wellness Ave.',
      northside: 'Northside Center, 789 Care Blvd.',
    }
    const clinicAddresses: Record<string, string> = {
      main: '123 Health St., Medville',
      downtown: '456 Wellness Ave., Medville',
      northside: '789 Care Blvd., Medville',
    }
    
    const clinicName = clinicNames[formData.clinic] || 'CardioHealth Clinic'
    const clinicAddress = clinicAddresses[formData.clinic] || '123 Wellness Ave, Suite 101, Medville'
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to confirmation page with appointment details
      const params = new URLSearchParams({
        patientName: formData.patientName || 'Alex Johnson',
        date: formData.selectedDate || 'Monday, October 28th',
        time: formData.selectedTime || '10:30 AM (PST)',
        clinicName,
        clinicAddress,
        phoneNumber: '(555) 123-4567',
        doctorName: DOCTOR_NAME,
        doctorSpecialty: 'Cardiologist',
      })
      router.push(`/appointments/confirmed?${params.toString()}`)
    }, 1000)
  }

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) })
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const isAvailable = i >= 16 && i <= 25 && i !== 19 && i !== 21 && i !== 23 && i !== 26
      days.push({ day: i, isCurrentMonth: true, date, isAvailable })
    }
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) })
    }
    return days
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM']
  const availableSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM', '01:30 PM', '02:00 PM']
  const bookedSlots = ['10:30 AM', '01:00 PM']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="layout-content-container flex flex-col max-w-[960px] mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 p-4">
                <span className="text-base font-bold leading-normal text-primary">
                  Patient Info
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-base font-medium leading-normal">/</span>
                <span className="text-base font-medium leading-normal text-primary">
                  Choose Time
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-base font-medium leading-normal">/</span>
                <span className="text-base font-medium leading-normal text-primary">
                  Confirm
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-0 sm:min-w-72 flex-col gap-3">
                  <p className="text-[#111418] dark:text-white text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">
                    Book an Appointment
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal leading-normal">
                    Fill in your details to schedule your visit in a few simple steps.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Patient Information */}
            <section className="mb-8 sm:mb-12">
                <h2 className="text-[#111418] dark:text-white text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
                  1. Patient Information
                </h2>
                <div className="bg-[#F3F4F6] dark:bg-background-dark p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Patient Name"
                      type="text"
                      className="form-input h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-500"
                    />
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      type="tel"
                      className="form-input h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-500"
                    />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      type="email"
                      className="form-input h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-500 md:col-span-2"
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-select h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      type="number"
                      className="form-input h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-500"
                    />
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      type="text"
                      className="form-input h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-500 md:col-span-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        checked={formData.patientType === 'new'}
                        onChange={() => handleRadioChange('new')}
                        className="form-radio text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                        name="patient-type"
                        type="radio"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New patient</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        checked={formData.patientType === 'old'}
                        onChange={() => handleRadioChange('old')}
                        className="form-radio text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                        name="patient-type"
                        type="radio"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Old patient</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        checked={formData.patientType === 'ot'}
                        onChange={() => handleRadioChange('ot')}
                        className="form-radio text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                        name="patient-type"
                        type="radio"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OT patient</span>
                    </label>
                  </div>
                </div>
              </section>

            {/* Section 2: Choose Date & Time */}
            <section className="mb-12">
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  2. Choose Date & Time
                </h2>
                <div className="bg-[#F3F4F6] dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="mb-6">
                    <select
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleInputChange}
                      className="form-select h-12 w-full rounded-lg bg-background-light dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Choose Clinic Name</option>
                      <option value="main">Main Clinic, 123 Health St.</option>
                      <option value="downtown">Downtown Branch, 456 Wellness Ave.</option>
                      <option value="northside">Northside Center, 789 Care Blvd.</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                      <div className="bg-background-light dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
                          </button>
                          <p className="font-bold text-lg text-center text-[#111418] dark:text-white">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </p>
                          <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                          {weekDays.map((day) => (
                            <div key={day} className="text-gray-500 dark:text-gray-400 font-semibold py-2">
                              {day}
                            </div>
                          ))}
                          {getDaysInMonth(currentMonth).map((dayObj, index) => {
                            const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString()
                            const isToday = dayObj.date.toDateString() === new Date().toDateString()
                            return (
                              <div
                                key={index}
                                onClick={() => dayObj.isAvailable && handleDateSelect(dayObj.date)}
                                className={`py-2 relative ${
                                  !dayObj.isCurrentMonth || !dayObj.isAvailable
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-primary text-white rounded-full font-bold cursor-pointer'
                                    : 'cursor-pointer hover:bg-primary/10 rounded-full text-[#111418] dark:text-white'
                                }`}
                              >
                                {dayObj.day}
                                {dayObj.isAvailable && dayObj.isCurrentMonth && (
                                  <span
                                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                                      isSelected ? 'bg-white' : 'bg-[#10B981]'
                                    }`}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-background-light dark:bg-gray-800 p-4 rounded-lg h-full">
                        <p className="font-bold text-center mb-4 text-[#111418] dark:text-white">
                          Available Slots for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Oct 17'}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((time) => {
                            const isAvailable = availableSlots.includes(time)
                            const isBooked = bookedSlots.includes(time)
                            const isSelected = formData.selectedTime === time
                            return (
                              <button
                                key={time}
                                onClick={() => isAvailable && !isBooked && handleTimeSelect(time)}
                                disabled={isBooked}
                                className={`h-10 rounded-lg text-sm font-semibold ${
                                  isSelected
                                    ? 'bg-primary text-white'
                                    : isBooked
                                    ? 'border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10'
                                }`}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            {/* Section 3: Review and Confirm */}
            <section>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  3. Review and Confirm
                </h2>
                <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="w-full">
                    <h3 className="font-bold text-lg mb-4 text-primary dark:text-white">Appointment Summary</h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary dark:text-primary/80">person</span>
                        <span className="font-semibold">{DOCTOR_NAME}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">(Cardiologist)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary dark:text-primary/80">calendar_month</span>
                        <span className="font-semibold">{formData.selectedDate || 'Thursday, October 17, 2024'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary dark:text-primary/80">schedule</span>
                        <span className="font-semibold">{formData.selectedTime || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary dark:text-primary/80">location_on</span>
                        <span className="font-semibold">
                          {formData.clinic === 'main'
                            ? 'Main Clinic, 123 Health St.'
                            : formData.clinic === 'downtown'
                            ? 'Downtown Branch, 456 Wellness Ave.'
                            : formData.clinic === 'northside'
                            ? 'Northside Center, 789 Care Blvd.'
                            : 'Main Clinic, 123 Health St.'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading || !formData.patientName || !selectedDate || !formData.selectedTime || !formData.clinic}
                      className="w-full md:w-auto h-12 px-8 rounded-lg bg-primary text-white text-base font-bold flex items-center justify-center whitespace-nowrap shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </div>
              </section>
          </div>
        </div>
      </main>
    </div>
  )
}

