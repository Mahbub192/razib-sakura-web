'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { doctorApi } from '@/lib/api/doctors'
import { DOCTOR_NAME, DOCTOR_SPECIALTY } from '@/lib/constants'

interface TodayPatient {
  id: string
  serial: number
  patientName: string
  phoneNumber: string
  age: number
  gender: string
  time: string
  status: string
}

export default function TodayPatientsPage() {
  const [patients, setPatients] = useState<TodayPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)

  useEffect(() => {
    fetchTodayPatients()
    fetchDoctorProfile()
  }, [])

  const fetchTodayPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await doctorApi.getTodayAppointments()
      
      if (response.success && response.data) {
        // Transform appointments to patient list with required fields
        const patientList: TodayPatient[] = response.data.map((apt: any, index: number) => {
          const patient = apt.patient || {}
          const dob = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null
          const age = dob ? new Date().getFullYear() - dob.getFullYear() : 0
          
          return {
            id: apt.id || `patient-${index}`,
            serial: index + 1,
            patientName: apt.patientName || patient.fullName || 'Unknown',
            phoneNumber: patient.phoneNumber || 'N/A',
            age: age || 0,
            gender: patient.gender || 'N/A',
            time: apt.time || 'N/A',
            status: apt.status || 'pending',
          }
        })
        
        setPatients(patientList)
      } else {
        setError(response.message || 'Failed to load today\'s patients')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load today\'s patients')
      console.error('Fetch patients error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorProfile = async () => {
    try {
      const response = await doctorApi.getProfile()
      if (response.success && response.data) {
        setDoctorProfile(response.data)
      }
    } catch (err) {
      console.error('Failed to load doctor profile:', err)
    }
  }

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0
    const dob = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Side - Patient Table */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111418] dark:text-white">
                Today's Patients
              </h1>
              <p className="text-sm text-[#617589] dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-[#617589] dark:text-gray-400">Loading patients...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                  </div>
                </div>
              ) : patients.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">people</span>
                    <p className="text-[#617589] dark:text-gray-400">No patients scheduled for today</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          SL
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Phone Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Gender
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111418] dark:text-white">
                            {patient.serial}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[#111418] dark:text-white">
                            {patient.patientName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[#617589] dark:text-gray-400">
                            {patient.phoneNumber}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[#617589] dark:text-gray-400">
                            {patient.age > 0 ? `${patient.age} years` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[#617589] dark:text-gray-400 capitalize">
                            {patient.gender}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Doctor Info Card & YouTube Video */}
          <div className="w-full lg:w-80 flex flex-col gap-4 sm:gap-6">
            {/* Doctor Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 overflow-hidden">
                  {doctorProfile?.avatar ? (
                    <img 
                      src={doctorProfile.avatar} 
                      alt={DOCTOR_NAME}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-4xl font-bold">
                      {DOCTOR_NAME.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-1">
                  {doctorProfile?.fullName || DOCTOR_NAME}
                </h2>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                  {doctorProfile?.specialty || DOCTOR_SPECIALTY}
                </p>
                {doctorProfile?.bio && (
                  <p className="text-xs text-[#617589] dark:text-gray-400 text-center line-clamp-3">
                    {doctorProfile.bio}
                  </p>
                )}
                {doctorProfile?.yearsOfExperience && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                    <p className="text-sm text-[#617589] dark:text-gray-400">
                      <span className="font-semibold text-[#111418] dark:text-white">
                        {doctorProfile.yearsOfExperience}+
                      </span> Years of Experience
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* YouTube Video */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-[#111418] dark:text-white">
                  Health Information
                </h3>
              </div>
              <div className="flex-1 p-3 sm:p-4 min-h-0">
                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Health Information Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

