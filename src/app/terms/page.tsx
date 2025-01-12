'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto prose prose-gray dark:prose-invert"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-6">
          Last updated: January 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Resume Refiner, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Permission is granted to temporarily use Resume Refiner for personal, 
                non-commercial purposes only.
              </li>
              <li>
                This license shall automatically terminate if you violate any of these restrictions.
              </li>
              <li>
                Upon terminating your viewing of these materials or upon the termination of this 
                license, you must destroy any downloaded materials in your possession.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The materials on Resume Refiner are provided on an 'as is' basis.
              </li>
              <li>
                We make no warranties, expressed or implied, and hereby disclaim and negate 
                all other warranties including, without limitation, implied warranties or 
                conditions of merchantability, fitness for a particular purpose, or 
                non-infringement of intellectual property.
              </li>
              <li>
                We do not guarantee employment or interview success through the use of our service.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information in your resume</li>
              <li>Not use the service for any unlawful purpose</li>
              <li>Not attempt to reverse engineer or exploit the service</li>
              <li>Not interfere with the proper working of the service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
            <p>
              In no event shall Resume Refiner or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to 
              business interruption) arising out of the use or inability to use Resume Refiner.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Revisions and Errata</h2>
            <p>
              The materials appearing on Resume Refiner could include technical, typographical, 
              or photographic errors. We do not warrant that any of the materials are accurate, 
              complete, or current. We may make changes to the materials at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the 
              laws of the United States, and you irrevocably submit to the exclusive 
              jurisdiction of the courts in that location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>
              For any questions regarding these Terms of Service, please contact J&S Group, LLC.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}