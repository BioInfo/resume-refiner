import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { supabase } from '@/lib/supabase'
import pdf from 'pdf-parse'

// Initialize OpenAI outside of the route handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Demo user ID for MVP (matches the one in schema.sql)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF')
    }
    
    return data.text
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to extract text from PDF')
  }
}

const SYSTEM_PROMPT = `You are a resume parsing assistant. Convert the provided resume text into a structured JSON format with the following fields:
- personal_info (name, email, phone, location)
- summary (professional summary or objective)
- work_experience (array of positions with company, title, dates, and accomplishments)
- education (array of degrees with school, degree, field, graduation date)
- skills (array of technical and soft skills)
- projects (array of relevant projects with name, description, and technologies used)
- certifications (array of professional certifications)

Extract as much information as possible from the text while maintaining accuracy.`

export async function POST(request: NextRequest) {
  console.log('POST /api/upload-resume/parse - Received request')
  console.log('Content-Type:', request.headers.get('content-type'))

  try {
    // Get the file from FormData
    const formData = await request.formData()
    console.log('FormData received')
    
    const file = formData.get('file') as File
    if (!file) {
      console.error('No file provided in form data')
      return NextResponse.json(
        { 
          error: 'No file provided',
          details: 'Please upload a PDF file'
        },
        { status: 400 }
      )
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        {
          error: 'Invalid file type',
          details: 'Please upload a PDF file'
        },
        { status: 400 }
      )
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('File converted to buffer')
    
    // Extract text from PDF
    let resumeText: string
    try {
      resumeText = await extractTextFromPDF(buffer)
      console.log('PDF text extracted successfully, length:', resumeText.length)
      console.log('First 100 chars:', resumeText.substring(0, 100))
    } catch (error: unknown) {
      console.error('PDF extraction error:', error)
      return NextResponse.json(
        {
          error: 'Failed to extract text from PDF',
          details: error instanceof Error ? error.message : 'Unable to read PDF content'
        },
        { status: 400 }
      )
    }

    // Use OpenAI to convert text to structured JSON
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: resumeText },
        ],
        temperature: 0.3,
      })
      console.log('OpenAI processing complete')
    } catch (error) {
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        {
          error: 'Failed to process resume with AI',
          details: error instanceof Error ? error.message : 'OpenAI API error'
        },
        { status: 500 }
      )
    }

    // Parse OpenAI's response with error handling
    let parsedResume;
    try {
      const content = completion.choices[0].message.content
      if (!content) {
        throw new Error('Empty response from OpenAI')
      }
      parsedResume = JSON.parse(content.trim())
      console.log('OpenAI response parsed successfully')
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      return NextResponse.json(
        {
          error: 'Failed to parse resume structure',
          details: parseError instanceof Error ? parseError.message : 'Invalid JSON structure'
        },
        { status: 500 }
      )
    }

    // Store in Supabase
    try {
      console.log('Storing data in Supabase...')
      const { data: resumeData, error: dbError } = await supabase
        .from('resume_data')
        .insert({
          user_id: DEMO_USER_ID,
          resume_text: resumeText,
          resume_json: parsedResume,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Supabase error:', dbError)
        throw dbError
      }

      console.log('Data stored in Supabase successfully')
      return NextResponse.json({
        success: true,
        text: resumeText,
        parsed: parsedResume,
        saved: resumeData,
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          error: 'Failed to save resume data',
          details: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing resume:', error)
    return NextResponse.json(
      {
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}