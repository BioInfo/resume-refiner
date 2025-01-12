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
    <main className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl py-12"
      >
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Upload Your Resume</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI analyze your resume and optimize it for your dream job. Upload your PDF resume below.
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-8 space-y-8">
          <FileUpload 
            onFileSelect={handleFileUpload}
            disabled={uploadState.status === 'uploading'}
          />

          {uploadState.status === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border bg-primary/5 p-6 text-primary"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-lg">Processing Your Resume</h2>
                  <p className="text-sm text-primary/80 mt-1">
                    Our AI is analyzing your resume. This typically takes about a minute.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {uploadState.status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-destructive"
            >
              <h2 className="text-lg font-semibold mb-2">Upload Failed</h2>
              <p className="text-destructive/90">{uploadState.error}</p>
              <button
                onClick={() => setUploadState({ status: 'idle' })}
                className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {uploadState.status === 'success' && uploadState.data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Resume Analysis Complete</h2>
                <div className="text-sm text-muted-foreground">
                  Redirecting to optimization...
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 overflow-hidden">
                <pre className="text-sm overflow-auto max-h-[300px]">
                  {JSON.stringify(uploadState.data.parsed, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}