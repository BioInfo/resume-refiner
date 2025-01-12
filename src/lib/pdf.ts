import pdf from 'pdf-parse'

export async function parsePDF(buffer: Buffer): Promise<string> {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('Invalid input: Buffer required')
  }

  try {
    // Pass buffer directly to pdf-parse, no options that might trigger file path usage
    const result = await pdf(buffer)
    
    if (!result || typeof result.text !== 'string') {
      throw new Error('No text content found in PDF')
    }
    
    return result.text.trim()
  } catch (error) {
    // Handle specific PDF parsing errors
    if (error instanceof Error) {
      // Don't expose internal ENOENT errors to clients
      if (error.message.includes('ENOENT')) {
        throw new Error('Failed to process PDF')
      }
      if (error.message.includes('password')) {
        throw new Error('PDF is password protected')
      }
      if (error.message.includes('encrypted')) {
        throw new Error('PDF is encrypted')
      }
      if (error.message.includes('extract text')) {
        throw new Error('Unable to extract text from PDF')
      }
      // Pass through other errors but sanitize the message
      throw new Error(`PDF processing error: ${error.message.split('\n')[0]}`)
    }
    throw new Error('Unknown PDF parsing error')
  }
}