'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AssistantReportsPage() {
  const [dateRange, setDateRange] = useState('Oct 1, 2024 - Oct 31, 2024')
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Anya Sharma')
  const [selectedAssistant, setSelectedAssistant] = useState('All Assistants')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('month')

  const handleExportReports = () => {
    // TODO: Implement export functionality
    console.log('Exporting reports...')
  }

  const handleApplyFilters = () => {
    // TODO: Implement filter logic
    console.log('Applying filters:', { dateRange, selectedDoctor, selectedAssistant })
  }

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">list_alt</span>
              <p className="text-sm font-medium leading-normal">Appointments</p>
            </Link>
            <Link
              href="/assistant/patients"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">group</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <p className="text-sm font-medium leading-normal">Communications</p>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">bar_chart</span>
              <p className="text-sm font-semibold leading-normal">Reports</p>
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
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Total Patients</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">850</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+1.5% this month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">12</p>
            <p className="text-red-600 dark:text-red-500 text-sm font-medium leading-normal">-5% vs yesterday</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Analytics & Reports</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">View key metrics and generate reports.</p>
            </div>
            <button
              onClick={handleExportReports}
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">download</span>
              <span className="truncate">Export All Reports</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="date-range">
                Date Range
              </label>
              <input
                id="date-range"
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="doctor">
                Doctor
              </label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              >
                <option>Dr. Anya Sharma</option>
                <option>All Doctors</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="assistant">
                Assistant
              </label>
              <select
                id="assistant"
                value={selectedAssistant}
                onChange={(e) => setSelectedAssistant(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              >
                <option>All Assistants</option>
                <option>Chloe Davis</option>
                <option>Mark Chen</option>
              </select>
            </div>
            <div className="self-end">
              <button
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">245</p>
              <p className="text-sm font-medium text-green-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_upward</span>
                <span>10% vs last month</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">210</p>
              <p className="text-sm font-medium text-green-500">85.7% Completion Rate</p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Missed / Canceled</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">35</p>
              <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_downward</span>
                <span>-5% vs last month</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (est.)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">$31,500</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. $150 / appointment</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Appointment Volume Chart */}
            <div className="lg:col-span-3 flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointment Volume</h3>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-sm">
                  <button
                    onClick={() => setTimeRange('day')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'day'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'week'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'month'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
              <div className="w-full h-80 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-center">Chart data for appointments per {timeRange} would be displayed here.</p>
              </div>
            </div>

            {/* Patient Demographics Chart */}
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patient Demographics</h3>
              <div className="w-full h-80 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500">
                <p className="text-center">Patient age/gender chart would be displayed here.</p>
                <div className="flex flex-col items-center gap-2 w-full mt-4">
                  <div className="flex items-center justify-between w-full text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Age 0-18</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <div className="flex items-center justify-between w-full text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Age 19-45</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex items-center justify-between w-full text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Age 46+</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

