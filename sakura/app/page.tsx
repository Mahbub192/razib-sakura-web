import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
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
                    Your Health, Our Priority. Compassionate Care, Always.
                  </h1>
                  <p className="text-lg text-[#617589] dark:text-gray-400 max-w-lg">
                    Experience dedicated and personalized healthcare. Our team of experts is here to support you on your journey to wellness.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/appointments"
                      className="flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold px-8 hover:bg-primary/90"
                    >
                      Book an Appointment
                    </Link>
                    <Link
                      href="/find-doctor"
                      className="flex items-center justify-center rounded-lg h-12 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-base font-bold px-8 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    >
                      Find a Doctor
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
                <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">Meet Dr. Evelyn Reed</h2>
                <p className="text-primary font-semibold text-lg">Lead Cardiologist, MD</p>
                <p className="text-[#617589] dark:text-gray-400 text-base leading-relaxed">
                  Dr. Evelyn Reed is a board-certified cardiologist with over 15 years of experience in diagnosing and treating a wide range of cardiovascular conditions. She is dedicated to providing patient-centered care and is a recognized leader in preventative cardiology and advanced cardiac imaging. Dr. Reed believes in building strong relationships with her patients to achieve the best possible health outcomes.
                </p>
                <Link
                  href="/appointments"
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
                  <p className="text-4xl font-black text-primary">12,000+</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Happy Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">15+</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Years of Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">50+</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Specialist Doctors</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">98%</p>
                  <p className="text-base text-[#617589] dark:text-gray-400 mt-2">Positive Feedback</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">Our Services</h2>
              <p className="text-lg text-[#617589] dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                We offer a wide range of medical services to ensure you and your family receive the best care.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Cardiology', icon: 'ecg_heart', desc: 'Comprehensive heart care, from preventative screenings to advanced treatment for cardiovascular diseases.' },
                { name: 'Neurology', icon: 'neurology', desc: 'Expert diagnosis and management of disorders of the nervous system, including the brain and spinal cord.' },
                { name: 'Dermatology', icon: 'dermatology', desc: 'Specialized care for skin, hair, and nail conditions, offering both medical and cosmetic treatments.' },
                { name: 'Radiology', icon: 'radiology', desc: 'Advanced imaging services including X-ray, MRI, and CT scans to provide accurate diagnoses.' },
                { name: 'Primary Care', icon: 'vaccines', desc: 'General health services, check-ups, and preventative care for all ages.' },
                { name: 'Emergency Care', icon: 'emergency', desc: 'Immediate medical attention for urgent and critical health situations, available 24/7.' },
              ].map((service) => (
                <div key={service.name} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-primary">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">{service.name}</h3>
                  <p className="text-[#617589] dark:text-gray-400">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="bg-white dark:bg-gray-800/50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">Why Choose Us?</h2>
                  <p className="text-lg text-[#617589] dark:text-gray-400 mt-4">
                    We are committed to delivering exceptional healthcare with a personal touch. Our clinic is designed for your comfort and equipped with the latest technology.
                  </p>
                  <div className="mt-8 space-y-6">
                    {[
                      { title: 'Qualified Doctors', icon: 'verified_user', desc: 'Our team consists of highly skilled and experienced professionals dedicated to your well-being.' },
                      { title: 'Modern Technology', icon: 'devices', desc: 'We utilize state-of-the-art medical equipment for accurate diagnosis and effective treatments.' },
                      { title: '24/7 Support', icon: 'schedule', desc: 'Our support team is available around the clock to assist you with any inquiries or emergencies.' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl text-primary">{item.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white">{item.title}</h3>
                          <p className="text-[#617589] dark:text-gray-400 mt-1">{item.desc}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">What Our Patients Say</h2>
              <p className="text-lg text-[#617589] dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                Real stories from our valued patients. Their health and satisfaction are our greatest achievements.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Sarah L.', condition: 'Cardiology Patient', quote: 'The care I received was exceptional. Dr. Reed was thorough, compassionate, and took the time to explain everything clearly. I felt truly listened to and cared for.' },
                { name: 'Michael B.', condition: 'General Check-up', quote: 'Booking an appointment was incredibly easy, and the staff were all friendly and professional. The clinic is modern and clean. A great experience overall.' },
                { name: 'Jessica T.', condition: 'Dermatology Patient', quote: "I'm so pleased with the results of my treatment. The dermatologist was very knowledgeable and made me feel comfortable throughout the entire process." },
              ].map((testimonial) => (
                <div key={testimonial.name} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">{testimonial.name.charAt(0)}</span>
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
                <h2 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white">Frequently Asked Questions</h2>
                <p className="text-lg text-[#617589] dark:text-gray-400 mt-4">
                  Find answers to common questions about our services and procedures.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { question: 'How do I book an appointment?', answer: 'You can book an appointment through our website by clicking the "Book an Appointment" button, or by calling our clinic directly. Our online system allows you to choose your preferred doctor and time slot.' },
                  { question: 'What should I bring to my first appointment?', answer: 'Please bring a valid ID, your insurance card, a list of current medications, and any relevant medical records or test results from other doctors.' },
                  { question: 'Do you accept my insurance?', answer: 'We accept a wide variety of insurance plans. Please check our "Insurance" page for a full list or contact our office to verify your coverage before your appointment.' },
                  { question: 'What is your cancellation policy?', answer: 'We kindly request that you notify us at least 24 hours in advance if you need to cancel or reschedule your appointment. This allows us to offer the time slot to another patient in need.' },
                ].map((faq, index) => (
                  <details key={index} className="group bg-background-light dark:bg-background-dark p-4 rounded-lg cursor-pointer">
                    <summary className="flex justify-between items-center font-semibold text-[#111418] dark:text-white">
                      {faq.question}
                      <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
                    </summary>
                    <p className="text-[#617589] dark:text-gray-400 mt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
