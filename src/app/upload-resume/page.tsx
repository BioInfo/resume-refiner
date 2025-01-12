'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileUpload } from '@/components/ui/file-upload'
import { useRouter } from 'next/navigation'

interface ParsedResume {
  personal_info: {
    name?: string
    email?: string
    phone?: string
    location?: string
  }
  summary?: string
  work_experience: Array<{
    company?: string
    title?: string
    dates?: string
    accomplishments?: string[]
  }>
  education: Array<{
    school?: string
    degree?: string
    field?: string
    graduation_date?: string
  }>
  skills: string[]
  projects: Array<{
    name?: string
    description?: string
    technologies?: string[]
  }>
  certifications: string[]
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
  data?: {
    parsed: ParsedResume
    dbRecord: any
  }
}

export default function UploadResumePage() {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle'
  })
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
        redirectTimeoutRef.current = null
      }
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      // Reset state
      setUploadState({ status: 'uploading' })
      
      // Cleanup any existing controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      // Create new controller
      abortControllerRef.current = new AbortController()

      // Create FormData with the file
      const formData = new FormData()
      formData.append('file', file)

      // Upload and parse the resume with abort signal
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal
      })

      // Get the response text first to check for HTML
      const responseText = await response.text()

      // Try to parse as JSON
      let jsonData
      try {
        jsonData = JSON.parse(responseText)
      } catch (e) {
        console.error('Response is not JSON:', responseText)
        throw new Error('Server returned invalid JSON response')
      }

      // Check if the response contains an error
      if (!response.ok || jsonData.error) {
        throw new Error(jsonData.error || 'Failed to upload resume')
      }

      // Update state with success
      setUploadState({
        status: 'success',
        data: {
          parsed: jsonData.parsed,
          dbRecord: jsonData.dbRecord
        }
      })

      // Wait a moment to show success state, then redirect
      redirectTimeoutRef.current = setTimeout(() => {
        try {
          router.push('/refine')
        } catch (routerError) {
          console.error('Navigation error:', routerError)
          // If navigation fails, stay on the page but show success state
          setUploadState(prev => ({
            ...prev,
            error: 'Navigation failed, but resume was processed successfully.'
          }))
        }
      }, 2000)

    } catch (error) {
      console.error('Error processing resume:', error)
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setUploadState({
            status: 'error',
            error: 'Upload cancelled - please try again'
          })
        } else if (error.message.includes('storage is not allowed')) {
          setUploadState({
            status: 'error',
            error: 'Please refresh the page and try again'
          })
        } else if (error.message.includes('message channel closed')) {
          setUploadState({
            status: 'error',
            error: 'Connection interrupted - please try again'
          })
        } else {
          setUploadState({
            status: 'error',
            error: error.message
          })
        }
      } else {
        setUploadState({
          status: 'error',
          error: 'An unknown error occurred'
        })
      }
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <h1 className="mb-4 text-center text-3xl font-bold">Upload Your Resume</h1>
        
        <div className="mb-8 text-center text-gray-600">
          <p>Upload your resume in PDF format.</p>
          <p className="text-sm mt-2">
            Note: The upload and information extraction process can take up to 1 minute.
            Please wait while we analyze your resume.
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload 
            onFileSelect={handleFileUpload}
            disabled={uploadState.status === 'uploading'}
          />

          {uploadState.status === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border bg-blue-50 p-4 text-blue-600"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <div>
                  <h2 className="font-semibold">Processing Resume</h2>
                  <p className="text-sm mt-1">
                    Please wait while we upload and extract information from your resume.
                    This process can take up to 1 minute.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {uploadState.status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600"
            >
              <h2 className="mb-2 font-semibold">Error</h2>
              <p>{uploadState.error}</p>
              <button
                onClick={() => setUploadState({ status: 'idle' })}
                className="mt-2 text-sm text-blue-500 hover:text-blue-600"
              >
                Try again
              </button>
            </motion.div>
          )}

          {uploadState.status === 'success' && uploadState.data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg border bg-white p-4"
            >
              <h2 className="mb-4 text-xl font-semibold">Parsed Resume Data</h2>
              <pre className="max-h-96 overflow-auto rounded bg-gray-50 p-4 text-sm">
                {JSON.stringify(uploadState.data.parsed, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}