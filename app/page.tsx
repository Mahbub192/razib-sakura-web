'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { homePageApi, HomePageContent } from '@/lib/api/home-page'
import { authApi } from '@/lib/api/auth'

export default function Home() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchContent()
    checkAuth()
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth()
    }
    // Also check on focus (when user returns to tab)
    const handleFocus = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkAuth = () => {
    const authenticated = authApi.isAuthenticated()
    const currentUser = authApi.getCurrentUser()
    setIsAuthenticated(authenticated)
    setUser(currentUser)
  }

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await homePageApi.getContent()
      if (response.success && response.data) {
        setContent(response.data)
      }
    } catch (err) {
      console.error('Failed to load home page content:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push('/auth/login?redirect=/patient/appointments/book')
    } else {
      const role = user?.role?.toLowerCase()
      if (role === 'patient') {
        router.push('/patient/appointments/book')
      } else {
        router.push('/auth/login?redirect=/patient/appointments/book')
      }
    }
  }

  const getAppointmentLink = () => {
    if (!isAuthenticated) return '/auth/login'
    const role = user?.role?.toLowerCase()
    if (role === 'patient') return '/patient/appointments/book'
    return '/auth/login'
  }

  // Default content fallback
  const defaultContent: HomePageContent = {
    heroTitle: 'Your Health, Our Priority. Compassionate Care, Always.',
    heroDescription: 'Experience dedicated and personalized healthcare. Our team of experts is here to support you on your journey to wellness.',
    heroButton1: 'Book an Appointment',
    heroButton2: 'Find a Doctor',
    doctorName: 'Dr. Ashraful Islam Razib',
    doctorTitle: 'ENT Specialist',
    doctorDescription: 'Dr. Ashraful Islam Razib is a highly experienced ENT (Ear, Nose, and Throat) specialist dedicated to providing comprehensive care for all ear, nose, and throat conditions. With years of expertise, Dr. Razib offers personalized treatment plans and compassionate care to patients at Sakura Healthcare in Bakshiganj, Jamalpur. He is committed to helping patients achieve optimal health and well-being through advanced medical practices and patient-centered approach.',
    happyPatients: '12,000+',
    yearsExperience: '15+',
    specialistDoctors: '50+',
    positiveFeedback: '98%',
    servicesTitle: 'Our Services',
    servicesDescription: 'We offer a wide range of medical services to ensure you and your family receive the best care.',
    services: [
      { name: 'Cardiology', description: 'Comprehensive heart care, from preventative screenings to advanced treatment for cardiovascular diseases.', icon: 'ecg_heart' },
      { name: 'Neurology', description: 'Expert diagnosis and management of disorders of the nervous system, including the brain and spinal cord.', icon: 'neurology' },
      { name: 'Dermatology', description: 'Specialized care for skin, hair, and nail conditions, offering both medical and cosmetic treatments.', icon: 'dermatology' },
      { name: 'Radiology', description: 'Advanced imaging services including X-ray, MRI, and CT scans to provide accurate diagnoses.', icon: 'radiology' },
      { name: 'Primary Care', description: 'General health services, check-ups, and preventative care for all ages.', icon: 'vaccines' },
      { name: 'Emergency Care', description: 'Immediate medical attention for urgent and critical health situations, available 24/7.', icon: 'emergency' },
    ],
    whyChooseUsTitle: 'Why Choose Us?',
    whyChooseUsDescription: 'We are committed to delivering exceptional healthcare with a personal touch. Our clinic is designed for your comfort and equipped with the latest technology.',
    whyChooseUsItems: [
      { title: 'Qualified Doctors', description: 'Our team consists of highly skilled and experienced professionals dedicated to your well-being.', icon: 'verified_user' },
      { title: 'Modern Technology', description: 'We utilize state-of-the-art medical equipment for accurate diagnosis and effective treatments.', icon: 'devices' },
      { title: '24/7 Support', description: 'Our support team is available around the clock to assist you with any inquiries or emergencies.', icon: 'schedule' },
    ],
    testimonialsTitle: 'What Our Patients Say',
    testimonialsDescription: 'Real stories from our valued patients. Their health and satisfaction are our greatest achievements.',
    testimonials: [
      { name: 'Sarah L.', condition: 'Cardiology Patient', quote: 'The care I received was exceptional. Dr. Reed was thorough, compassionate, and took the time to explain everything clearly. I felt truly listened to and cared for.' },
      { name: 'Michael B.', condition: 'General Check-up', quote: 'Booking an appointment was incredibly easy, and the staff were all friendly and professional. The clinic is modern and clean. A great experience overall!' },
      { name: 'Jessica T.', condition: 'Dermatology Patient', quote: "I'm so pleased with the results of my treatment. The dermatologist was very knowledgeable and made me feel comfortable throughout the entire process." },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqDescription: 'Find answers to common questions about our services and procedures.',
    faqs: [
      { question: 'How do I book an appointment?', answer: 'You can book an appointment through our website by clicking the "Book an Appointment" button, or by calling our clinic directly. Our online system allows you to choose your preferred doctor and time slot.' },
      { question: 'What should I bring to my first appointment?', answer: 'Please bring a valid ID, your insurance card, a list of current medications, and any relevant medical records or test results from other doctors.' },
      { question: 'Do you accept my insurance?', answer: 'We accept a wide variety of insurance plans. Please check our "Insurance" page for a full list or contact our office to verify your coverage before your appointment.' },
      { question: 'What is your cancellation policy?', answer: 'We kindly request that you notify us at least 24 hours in advance if you need to cancel or reschedule your appointment. This allows us to offer the time slot to another patient in need.' },
    ],
    footerTagline: 'Providing quality healthcare for a better life.',
    footerAddress: 'Bakshiganj, Jamalpur',
    footerPhone: '+8801234567891',
    footerEmail: 'info@sakura.com',
  }

  const displayContent = content || defaultContent

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 w-full">
          {/* Hero Section */}
          <section className="relative w-full bg-primary/10 dark:bg-primary/20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
                  <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
                    {displayContent.heroTitle}
                  </h1>
                  <p className="text-lg text-[#617589] dark:text-gray-400 max-w-lg">
                    {displayContent.heroDescription}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={getAppointmentLink()}
                      onClick={handleAppointmentClick}
                      className="flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold px-8 hover:bg-primary/90"
                    >
                      {displayContent.heroButton1}
                    </Link>
                    <Link
                      href="/find-doctor"
                      className="flex items-center justify-center rounded-lg h-12 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-base font-bold px-8 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    >
                      {displayContent.heroButton2}
                    </Link>
                  </div>
                </div>
                <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-center bg-no-repeat w-full h-full bg-cover bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl text-white opacity-50">local_hospital</span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Meet Dr. Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden order-last lg:order-first">
                <div className="bg-center bg-no-repeat w-full h-full bg-cover bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-9xl text-white opacity-50">person</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">
                  Meet {displayContent.doctorName}
                </h2>
                <p className="text-primary font-semibold text-lg">{displayContent.doctorTitle}</p>
                <p className="text-[#617589] dark:text-gray-400 text-base leading-relaxed">
                  {displayContent.doctorDescription}
                </p>
                <Link
                  href={getAppointmentLink()}
                  onClick={handleAppointmentClick}
                  className="flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold px-8 hover:bg-primary/90 mt-4 max-w-xs"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="bg-white dark:bg-gray-800/50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">{displayContent.happyPatients}</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Happy Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">{displayContent.yearsExperience}</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Years of Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">{displayContent.specialistDoctors}</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Specialist Doctors</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">{displayContent.positiveFeedback}</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Positive Feedback</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">
                {displayContent.servicesTitle}
              </h2>
              <p className="text-lg text-[#617589] dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                {displayContent.servicesDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(displayContent.services && displayContent.services.length > 0
                ? displayContent.services
                : defaultContent.services
              ).map((service, index) => (
                <div
                  key={service.name || index}
                  className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      {service.icon || 'medical_services'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">{service.name}</h3>
                  <p className="text-[#617589] dark:text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="bg-white dark:bg-gray-800/50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">
                    {displayContent.whyChooseUsTitle}
                  </h2>
                  <p className="text-lg text-[#617589] dark:text-gray-400 mt-4">
                    {displayContent.whyChooseUsDescription}
                  </p>
                  <div className="mt-8 space-y-6">
                    {(displayContent.whyChooseUsItems && displayContent.whyChooseUsItems.length > 0
                      ? displayContent.whyChooseUsItems
                      : defaultContent.whyChooseUsItems
                    ).map((item, index) => (
                      <div key={item.title || index} className="flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl text-primary">
                            {item.icon || 'star'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white">{item.title}</h3>
                          <p className="text-[#617589] dark:text-gray-400 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative w-full h-80 lg:h-full rounded-xl overflow-hidden">
                  <div className="bg-center bg-no-repeat w-full h-full bg-cover bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl text-white opacity-50">hearing</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">
                {displayContent.testimonialsTitle}
              </h2>
              <p className="text-lg text-[#617589] dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                {displayContent.testimonialsDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(displayContent.testimonials && displayContent.testimonials.length > 0
                ? displayContent.testimonials
                : defaultContent.testimonials
              ).map((testimonial, index) => (
                <div
                  key={testimonial.name || index}
                  className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">{testimonial.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#111418] dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-[#617589] dark:text-gray-400">{testimonial.condition}</p>
                    </div>
                  </div>
                  <p className="text-[#617589] dark:text-gray-400 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white dark:bg-gray-800/50">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">
                  {displayContent.faqTitle}
                </h2>
                <p className="text-lg text-[#617589] dark:text-gray-400 mt-4">{displayContent.faqDescription}</p>
              </div>
              <div className="space-y-4">
                {(displayContent.faqs && displayContent.faqs.length > 0
                  ? displayContent.faqs
                  : defaultContent.faqs
                ).map((faq, index) => (
                  <details
                    key={faq.question || index}
                    className="group bg-background-light dark:bg-background-dark p-4 rounded-lg cursor-pointer"
                  >
                    <summary className="flex justify-between items-center font-semibold text-[#111418] dark:text-white">
                      {faq.question}
                      <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">
                        expand_more
                      </span>
                    </summary>
                    <p className="text-[#617589] dark:text-gray-400 mt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer
          tagline={displayContent.footerTagline}
          address={displayContent.footerAddress}
          phone={displayContent.footerPhone}
          email={displayContent.footerEmail}
        />
      </div>
    </div>
  )
}
