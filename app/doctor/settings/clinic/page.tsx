'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi } from '@/lib/api/doctors'
import { fileUploadUtils } from '@/lib/utils/fileUpload'

export default function DoctorClinicSettings() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchClinicInfo()
  }, [])

  const fetchClinicInfo = async () => {
    try {
      setLoading(true)
      const response = await doctorApi.getClinicInfo()
      if (response.success && response.data) {
        setFormData({
          name: response.data.name || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          description: response.data.description || '',
        })
        if (response.data.logo) {
          setLogoPreview(response.data.logo)
        }
      } else if (response.success && !response.data) {
        // No clinic exists yet, use empty form
        setFormData({
          name: '',
          address: '',
          phone: '',
          email: '',
          description: '',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load clinic information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await doctorApi.updateClinicInfo(formData)
      if (response.success) {
        setSuccess('Clinic information updated successfully!')
        setTimeout(() => setSuccess(null), 3000)
        fetchClinicInfo() // Refresh
      } else {
        setError(response.message || 'Failed to update clinic information')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update clinic information')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = fileUploadUtils.validateFile(file, {
      maxSize: 2, // 2MB for logo
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'],
    })

    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const previewUrl = fileUploadUtils.createPreviewUrl(file)
      setLogoPreview(previewUrl)

      const uploadResult = await fileUploadUtils.uploadFile(file)
      
      if (uploadResult.success && uploadResult.url) {
        // Update clinic info with logo
        const updateResponse = await doctorApi.updateClinicInfo({
          logo: uploadResult.url,
        })
        
        if (updateResponse.success) {
          setSuccess('Logo uploaded successfully!')
          setTimeout(() => setSuccess(null), 3000)
          fetchClinicInfo()
        } else {
          setError('Failed to update clinic logo')
          setLogoPreview(null)
        }
      } else {
        setError(uploadResult.error || 'Failed to upload logo')
        setLogoPreview(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo')
      setLogoPreview(null)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading clinic information...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Settings</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Manage your account, clinic, and application settings.
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <Link
                  href="/doctor/settings/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/profile'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </Link>
                <Link
                  href="/doctor/settings/notifications"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/notifications'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span>Notifications</span>
                </Link>
                <Link
                  href="/doctor/settings/clinic"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/clinic'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">business</span>
                  <span>Clinic Info</span>
                </Link>
                <Link
                  href="/doctor/settings/security"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/security'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">security</span>
                  <span>Security</span>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Clinic Information</h2>
                <p className="text-[#617589] dark:text-gray-400 mb-6">
                  Update your clinic's details, branding, and operating hours.
                </p>

                {/* Clinic Logo */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Clinic Logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Clinic Logo"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <span className="text-green-600 dark:text-green-400 font-bold text-xl">
                          {formData.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleUploadLogo}
                        accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Upload Logo'}
                      </button>
                      <p className="text-xs text-[#617589] dark:text-gray-400">PNG, JPG, or SVG. Max 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Clinic Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={fetchClinicInfo}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
