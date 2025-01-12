'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in bytes
  disabled?: boolean
}

export function FileUpload({ 
  onFileSelect, 
  accept = '.pdf', 
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false
}: FileUploadProps) {
  const [status, setStatus] = useState<FileUploadStatus>('idle')
  const [error, setError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file')
      setStatus('error')
      return
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      setStatus('error')
      return
    }

    try {
      setStatus('uploading')
      await onFileSelect(file)
      setStatus('success')
    } catch (err) {
      console.error('File upload error:', err)
      // Handle specific storage access errors
      if (err instanceof Error && err.message.includes('storage is not allowed')) {
        setError('Storage access error. Please try again.')
      } else if (err instanceof Error && err.message.includes('message channel closed')) {
        setError('Upload interrupted. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to upload file')
      }
      setStatus('error')
    }
  }, [maxSize, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (!disabled && e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile, disabled])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile, disabled])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <label
        className={`group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-all ${
          disabled 
            ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50' 
            : dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          accept={accept}
          onChange={handleChange}
          disabled={disabled || status === 'uploading'}
        />
        
        <div 
          className="pointer-events-none space-y-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {status === 'idle' && (
            <>
              <Upload className={`mx-auto h-12 w-12 transition-colors ${
                disabled ? 'text-gray-400' : dragActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
              }`} />
              <div>
                <p className={`text-base transition-colors ${
                  disabled ? 'text-gray-500' : dragActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                }`}>
                  {disabled 
                    ? 'File upload is disabled'
                    : 'Drag and drop your resume PDF here, or click to browse'
                  }
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  PDF up to {maxSize / 1024 / 1024}MB
                </p>
              </div>
            </>
          )}

          {status === 'uploading' && (
            <>
              <FileText className="mx-auto h-12 w-12 animate-pulse text-blue-500" />
              <p className="text-base text-blue-600">Uploading and parsing resume...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-base text-green-600">Resume uploaded successfully!</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="text-base text-red-600">{error}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-sm text-blue-500 hover:text-blue-600"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </label>
    </motion.div>
  )
}