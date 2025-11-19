'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { homePageApi, HomePageContent } from '@/lib/api/home-page'

export default function HomePageEditor() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [activeTab, setActiveTab] = useState('hero')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState<HomePageContent>({
    // Hero Section
    heroTitle: '',
    heroDescription: '',
    heroButton1: '',
    heroButton2: '',
    
    // Meet Doctor Section
    doctorName: '',
    doctorTitle: '',
    doctorDescription: '',
    
    // Statistics
    happyPatients: '',
    yearsExperience: '',
    specialistDoctors: '',
    positiveFeedback: '',
    
    // Services
    servicesTitle: '',
    servicesDescription: '',
    services: [],
    
    // Why Choose Us
    whyChooseUsTitle: '',
    whyChooseUsDescription: '',
    whyChooseUsItems: [],
    
    // Testimonials
    testimonialsTitle: '',
    testimonialsDescription: '',
    testimonials: [],
    
    // FAQ
    faqTitle: '',
    faqDescription: '',
    faqs: [],
    
    // Footer
    footerTagline: '',
    footerAddress: '',
    footerPhone: '',
    footerEmail: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setIsLoadingContent(true)
      setError(null)
      
      const response = await homePageApi.getContent()
      
      if (response.success && response.data) {
        setFormData(response.data)
      } else {
        setError(response.message || 'Failed to load home page content')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading home page content')
      console.error('Fetch content error:', err)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      ),
    }))
  }

  const handleWhyChooseUsChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUsItems: prev.whyChooseUsItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      ),
    }))
  }

  const handleFAQChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await homePageApi.updateContent(formData)
      
      if (response.success) {
        setSuccess('Home page information updated successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(response.message || 'Failed to update home page content')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating home page content')
      console.error('Update content error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: 'home' },
    { id: 'doctor', name: 'Meet Doctor', icon: 'person' },
    { id: 'statistics', name: 'Statistics', icon: 'bar_chart' },
    { id: 'services', name: 'Services', icon: 'medical_services' },
    { id: 'why-choose', name: 'Why Choose Us', icon: 'star' },
    { id: 'testimonials', name: 'Testimonials', icon: 'format_quote' },
    { id: 'faq', name: 'FAQ', icon: 'help' },
    { id: 'footer', name: 'Footer', icon: 'description' },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Change Home Page Information</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Edit and update all content displayed on the home page.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingContent && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[#617589] dark:text-gray-400">Loading home page content...</p>
            </div>
          )}

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchContent}
                  className="text-red-600 dark:text-red-400 hover:underline text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span className="text-sm">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          {!isLoadingContent && (
            <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Hero Section */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Hero Section</h2>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Hero Description
                    </label>
                    <textarea
                      name="heroDescription"
                      value={formData.heroDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Button 1 Text
                      </label>
                      <input
                        type="text"
                        name="heroButton1"
                        value={formData.heroButton1}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Button 2 Text
                      </label>
                      <input
                        type="text"
                        name="heroButton2"
                        value={formData.heroButton2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Meet Doctor Section */}
              {activeTab === 'doctor' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Meet Doctor Section</h2>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Doctor Title
                    </label>
                    <input
                      type="text"
                      name="doctorTitle"
                      value={formData.doctorTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Doctor Description
                    </label>
                    <textarea
                      name="doctorDescription"
                      value={formData.doctorDescription}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Statistics Section */}
              {activeTab === 'statistics' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Statistics Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Happy Patients
                      </label>
                      <input
                        type="text"
                        name="happyPatients"
                        value={formData.happyPatients}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Specialist Doctors
                      </label>
                      <input
                        type="text"
                        name="specialistDoctors"
                        value={formData.specialistDoctors}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Positive Feedback
                      </label>
                      <input
                        type="text"
                        name="positiveFeedback"
                        value={formData.positiveFeedback}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Services Section</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Services Title
                      </label>
                      <input
                        type="text"
                        name="servicesTitle"
                        value={formData.servicesTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Services Description
                      </label>
                      <textarea
                        name="servicesDescription"
                        value={formData.servicesDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {formData.services.map((service, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-[#111418] dark:text-white mb-4">Service {index + 1}</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Service Name
                            </label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Service Description
                            </label>
                            <textarea
                              value={service.description}
                              onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Choose Us Section */}
              {activeTab === 'why-choose' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Why Choose Us Section</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        name="whyChooseUsTitle"
                        value={formData.whyChooseUsTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Description
                      </label>
                      <textarea
                        name="whyChooseUsDescription"
                        value={formData.whyChooseUsDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {formData.whyChooseUsItems.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-[#111418] dark:text-white mb-4">Item {index + 1}</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleWhyChooseUsChange(index, 'title', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Description
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials Section */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Testimonials Section</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        name="testimonialsTitle"
                        value={formData.testimonialsTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Description
                      </label>
                      <textarea
                        name="testimonialsDescription"
                        value={formData.testimonialsDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {formData.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-[#111418] dark:text-white mb-4">Testimonial {index + 1}</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                                Patient Name
                              </label>
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                                Condition/Reason
                              </label>
                              <input
                                type="text"
                                value={testimonial.condition}
                                onChange={(e) => handleTestimonialChange(index, 'condition', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Quote
                            </label>
                            <textarea
                              value={testimonial.quote}
                              onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">FAQ Section</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        name="faqTitle"
                        value={formData.faqTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Section Description
                      </label>
                      <textarea
                        name="faqDescription"
                        value={formData.faqDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {formData.faqs.map((faq, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-[#111418] dark:text-white mb-4">FAQ {index + 1}</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                              Answer
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Section */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">Footer Section</h2>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Footer Tagline
                    </label>
                    <input
                      type="text"
                      name="footerTagline"
                      value={formData.footerTagline}
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
                      name="footerAddress"
                      value={formData.footerAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="footerPhone"
                        value={formData.footerPhone}
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
                        name="footerEmail"
                        value={formData.footerEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
          )}
        </div>
      </main>
    </div>
  )
}

