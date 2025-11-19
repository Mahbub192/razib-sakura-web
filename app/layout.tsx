import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sakura Healthcare - Home',
  description: 'Comprehensive healthcare management system - Dr. Ashraful Islam Razib, ENT Specialist, Bakshiganj, Jamalpur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 antialiased">
        {children}
      </body>
    </html>
  )
}

