'use client'

import { motion } from 'framer-motion'

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto prose prose-gray dark:prose-invert"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">Cookie Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          Last updated: January 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when 
              you visit our website. They help us make the site work better and improve our service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for the operation of our website, 
                including session management and security.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact 
                with our website by collecting anonymous information.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences and settings 
                to enhance your experience.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser.
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Remain on your device for a set period or until 
                manually deleted.
              </li>
              <li>
                <strong>Third-Party Cookies:</strong> Set by third-party services we use, such as 
                analytics providers.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Specific Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Authentication:</strong> To keep you signed in and maintain your session.
              </li>
              <li>
                <strong>Preferences:</strong> To remember your settings and choices.
              </li>
              <li>
                <strong>Analytics:</strong> To understand how our site is used and improve our service.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p>You can control cookies through your browser settings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Block all cookies</li>
              <li>Delete existing cookies</li>
              <li>Allow only certain types of cookies</li>
              <li>Set preferences for different websites</li>
            </ul>
            <p className="mt-4">
              Please note that blocking some types of cookies may impact your experience on our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on 
              this page with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact J&S Group, LLC.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}