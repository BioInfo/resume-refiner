import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Resume Refiner - AI-Powered Resume Optimization',
  description: 'Transform your resume with AI-powered analysis and optimization. Match job descriptions, improve ATS compatibility, and stand out to hiring managers.',
  keywords: 'resume optimization, AI resume, job matching, ATS optimization, career tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
