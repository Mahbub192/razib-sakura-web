import { apiClient, ApiResponse } from './client'

export interface HomePageContent {
  heroTitle: string
  heroDescription: string
  heroButton1: string
  heroButton2: string
  doctorName: string
  doctorTitle: string
  doctorDescription: string
  happyPatients: string
  yearsExperience: string
  specialistDoctors: string
  positiveFeedback: string
  servicesTitle: string
  servicesDescription: string
  services: Array<{
    name: string
    description: string
    icon: string
  }>
  whyChooseUsTitle: string
  whyChooseUsDescription: string
  whyChooseUsItems: Array<{
    title: string
    description: string
    icon: string
  }>
  testimonialsTitle: string
  testimonialsDescription: string
  testimonials: Array<{
    name: string
    condition: string
    quote: string
  }>
  faqTitle: string
  faqDescription: string
  faqs: Array<{
    question: string
    answer: string
  }>
  footerTagline: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
}

// Home page content API functions
export const homePageApi = {
  // Get home page content
  async getContent(): Promise<ApiResponse<HomePageContent>> {
    return apiClient.get<ApiResponse<HomePageContent>>('/home-page-content')
  },

  // Update home page content
  async updateContent(data: Partial<HomePageContent>): Promise<ApiResponse<HomePageContent>> {
    return apiClient.patch<ApiResponse<HomePageContent>>('/home-page-content', data)
  },
}

