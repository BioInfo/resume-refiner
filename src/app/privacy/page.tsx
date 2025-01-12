'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto prose prose-gray dark:prose-invert"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          Last updated: January 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>When you use Resume Refiner, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Resume content you upload</li>
              <li>Job descriptions you provide</li>
              <li>Generated and refined resume content</li>
              <li>Usage data and analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and analyze your resume</li>
              <li>Match your qualifications with job requirements</li>
              <li>Generate optimized resume content</li>
              <li>Improve our AI models and services</li>
              <li>Maintain and enhance the application</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
            <p>Your data is stored securely using:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted database storage (Supabase)</li>
              <li>Secure file processing systems</li>
              <li>Industry-standard security protocols</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>OpenAI for resume analysis and optimization</li>
              <li>Supabase for data storage</li>
              <li>Vercel for application hosting</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Opt out of data collection</li>
              <li>Export your data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
            <p>For privacy-related inquiries, contact J&S Group, LLC.</p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}