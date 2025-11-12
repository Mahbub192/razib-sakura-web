'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientType: 'new',
    patientName: '',
    phoneNumber: '',
    location: '',
    age: '',
    gender: '',
    notes: '',
    selectedDate: '',
    selectedTime: '',
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, patientType: value }))
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setFormData((prev) => ({
      ...prev,
      selectedDate: selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }))
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement appointment creation logic
    console.log('Creating appointment:', formData)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to appointments list after successful creation
      router.push('/assistant/appointments')
    }, 1000)
  }

  const handleCancel = () => {
    router.back()
  }

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

  // Calendar generation
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false })
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true })
    }
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false })
    }
    return days
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']

  const today = new Date()
  const todayDate = today.getDate()
  const currentMonthNum = currentMonth.getMonth()
  const currentYear = currentMonth.getFullYear()
  const isCurrentMonth = currentMonthNum === today.getMonth() && currentYear === today.getFullYear()

  const days = getDaysInMonth()
  const selectedDay = formData.selectedDate ? parseInt(formData.selectedDate.split(' ')[1]) : null

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Sarah Johnson</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              href="/assistant/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              href="/assistant/appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">list_alt</span>
              <p className="text-sm font-semibold leading-normal">Appointments</p>
            </Link>
            <Link
              href="/assistant/patients"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">group</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link
              href="/assistant/calendar"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Calendar</p>
            </Link>
            <Link
              href="/assistant/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
            </Link>
            <Link
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <p className="text-sm font-medium leading-normal">Communications</p>
            </Link>
            <Link
              href="/assistant/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Upcoming Appointments</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">32</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+5 this week</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Completed Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">8</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">out of 12</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">New Appointment</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
              Fill in the details below to schedule a new appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div className="flex flex-col gap-6">
                  {/* Patient Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient Type</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                          checked={formData.patientType === 'new'}
                          onChange={() => handleRadioChange('new')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary"
                          name="patient-type"
                          type="radio"
                        />
                        <span className="ml-2">New patient</span>
                      </label>
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                          checked={formData.patientType === 'old'}
                          onChange={() => handleRadioChange('old')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary"
                          name="patient-type"
                          type="radio"
                        />
                        <span className="ml-2">Old patient</span>
                      </label>
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                          checked={formData.patientType === 'ot'}
                          onChange={() => handleRadioChange('ot')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary"
                          name="patient-type"
                          type="radio"
                        />
                        <span className="ml-2">OT patient</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800"></div>

                  {/* Patient Information */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Patient Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="patient-name">
                          Name
                        </label>
                        <input
                          id="patient-name"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          placeholder="Enter patient's full name"
                          type="text"
                          required
                          className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="patient-phone">
                          Phone Number
                        </label>
                        <input
                          id="patient-phone"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          type="tel"
                          required
                          className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="patient-location">
                          Location
                        </label>
                        <input
                          id="patient-location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter city or area"
                          type="text"
                          className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="patient-age">
                            Age
                          </label>
                          <input
                            id="patient-age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="e.g. 35"
                            type="number"
                            className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="patient-gender">
                            Gender
                          </label>
                          <select
                            id="patient-gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="notes">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any relevant notes for the appointment..."
                      rows={4}
                      className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Date & Time */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Date & Time</h3>
                <div className="flex flex-col">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => navigateMonth('prev')}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <span className="font-semibold text-sm">
                      {monthNames[currentMonthNum]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateMonth('next')}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>

                  {/* Week Days */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {weekDays.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {days.map((dayObj, index) => {
                      const isToday = dayObj.isCurrentMonth && dayObj.day === todayDate && isCurrentMonth
                      const isSelected = dayObj.isCurrentMonth && dayObj.day === selectedDay
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => dayObj.isCurrentMonth && handleDateSelect(dayObj.day)}
                          disabled={!dayObj.isCurrentMonth}
                          className={`aspect-square flex items-center justify-center rounded-full transition-colors ${
                            !dayObj.isCurrentMonth
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : isSelected
                              ? 'font-semibold bg-primary text-white cursor-pointer'
                              : isToday
                              ? 'font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary cursor-pointer'
                              : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                          }`}
                        >
                          {dayObj.day}
                        </button>
                      )
                    })}
                  </div>

                  {/* Time Slots */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="time-slot">
                      Available Slots
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelect(time)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            formData.selectedTime === time
                              ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold'
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="truncate">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.patientName || !formData.phoneNumber || !formData.selectedDate || !formData.selectedTime}
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">event_available</span>
              <span className="truncate">{isLoading ? 'Scheduling...' : 'Schedule Appointment'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

