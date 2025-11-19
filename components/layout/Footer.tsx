import Link from 'next/link'

interface FooterProps {
  tagline?: string
  address?: string
  phone?: string
  email?: string
}

export const Footer = ({ 
  tagline = 'Providing quality healthcare for a better life.',
  address = 'Bakshiganj, Jamalpur',
  phone = '+8801234567891',
  email = 'info@sakura.com'
}: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary">
                {/* Sakura Logo - Cherry Blossom */}
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" fill="url(#sakuraGradient)" opacity="0.2"/>
                  <path d="M24 8C24 8 18 12 18 18C18 24 24 28 24 28C24 28 30 24 30 18C30 12 24 8 24 8Z" fill="#FF69B4"/>
                  <path d="M24 20C24 20 20 22 20 24C20 26 24 28 24 28C24 28 28 26 28 24C28 22 24 20 24 20Z" fill="#FFB6C1"/>
                  <path d="M20 16L24 12L28 16" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 24L12 24L16 28" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M24 32L24 36L28 32" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M32 24L36 24L32 20" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="sakuraGradient" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0%" stopColor="#FF69B4"/>
                      <stop offset="100%" stopColor="#FFB6C1"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 className="text-white text-xl font-bold">Sakura</h2>
            </div>
            <p className="text-gray-400 text-sm">{tagline || 'Providing quality healthcare for a better life.'}</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-doctor" className="text-gray-400 hover:text-white">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">location_on</span>
                {address}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">call</span>
                {phone}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">mail</span>
                {email}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <svg className="bi bi-facebook" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <svg className="bi bi-twitter" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.142 0-.282-.008-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <svg className="bi bi-linkedin" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.325 0-1.936.724-2.26 1.287h.018v-1.116H7.83v7.225h2.408z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© 2024 Sakura Healthcare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
