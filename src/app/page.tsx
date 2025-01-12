'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Resume Refiner
        </h1>
        <p className="mb-8 text-lg leading-8 text-gray-600">
          Upload your resume, paste a job description, and let AI help you create a
          perfectly tailored resume for your dream job.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/upload-resume" passHref>
            <Button size="lg" className="text-lg">
              Upload Your Resume
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
