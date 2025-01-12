import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { supabaseServer } from '@/lib/supabase'
import { parsePDF } from '@/lib/pdf'

// Initialize OpenAI outside of the route handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

const SYSTEM_PROMPT = `You are a resume parsing assistant. Convert the provided resume text into a structured JSON format with the following fields:
- personal_info (name, email, phone, location)
- summary (professional summary or objective)
- work_experience (array of positions with company, title, dates, and accomplishments)
- education (array of degrees with school, degree, field, graduation date)
- skills (array of technical and soft skills)
- projects (array of relevant projects with name, description, and technologies used)
- certifications (array of professional certifications)

Extract as much information as possible from the text while maintaining accuracy.`

export async function POST(request: Request) {
  try {
    // Parse the multipart form data using Next.js built-in functionality
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Parse PDF to text
      let resumeText: string
      try {
        resumeText = await parsePDF(buffer)
      } catch (error) {
        return NextResponse.json(
          { 
            error: error instanceof Error ? error.message : 'Failed to parse PDF file',
            details: 'Please ensure the PDF is not corrupted or password protected'
          },
          { status: 400 }
        )
      }

      // Validate extracted text
      if (!resumeText || resumeText.trim().length === 0) {
        return NextResponse.json(
          { 
            error: 'No text content found in PDF',
            details: 'The PDF file appears to be empty or contains no extractable text'
          },
          { status: 400 }
        )
      }

      try {
        // Use OpenAI to convert text to structured JSON
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: resumeText },
          ],
          temperature: 0.3,
        })

        let parsedResume
        try {
          parsedResume = JSON.parse(completion.choices[0].message.content || '{}')
        } catch (jsonError) {
          console.error('JSON Parse Error:', jsonError)
          return NextResponse.json(
            { 
              error: 'Failed to parse resume structure',
              details: 'The AI response could not be properly formatted'
            },
            { status: 500 }
          )
        }

        try {
          // Store in Supabase using server client
          const { data: dbData, error: dbError } = await supabaseServer
            .from('resume_data')
            .insert({
              user_id: DEMO_USER_ID, // Use the demo user UUID
              resume_text: resumeText,
              resume_json: parsedResume,
              created_at: new Date().toISOString()
            })
            .select()
            .single()

          if (dbError) {
            console.error('Database Error:', dbError)
            
            // Handle specific database errors
            let errorMessage = 'Failed to save to database'
            let errorDetails = dbError.message
            
            if (dbError.code === '23505') { // Unique violation
              errorMessage = 'Resume already exists'
              errorDetails = 'A resume with this content has already been uploaded'
            } else if (dbError.code === '42P01') { // Undefined table
              errorMessage = 'Database setup error'
              errorDetails = 'Please ensure the database tables are properly configured'
            } else if (dbError.code === '23503') { // Foreign key violation
              errorMessage = 'Invalid user reference'
              errorDetails = 'Please ensure the database is properly configured with the demo user'
            }
            
            return NextResponse.json(
              { 
                error: errorMessage,
                details: errorDetails
              },
              { status: 500 }
            )
          }

          // Return success with all data
          return NextResponse.json({
            success: true,
            text: resumeText,
            parsed: parsedResume,
            dbRecord: dbData
          })

        } catch (dbError) {
          console.error('Database Operation Error:', dbError)
          return NextResponse.json(
            { 
              error: 'Database operation failed',
              details: dbError instanceof Error ? dbError.message : 'Unknown database error'
            },
            { status: 500 }
          )
        }

      } catch (openaiError) {
        console.error('OpenAI Error:', openaiError)
        return NextResponse.json(
          { 
            error: 'Failed to analyze resume with AI',
            details: openaiError instanceof Error 
              ? openaiError.message 
              : 'Error communicating with OpenAI service'
          },
          { status: 500 }
        )
      }

    } catch (error) {
      console.error('PDF Processing Error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to process PDF file',
          details: error instanceof Error 
            ? error.message 
            : 'Error processing the uploaded file'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unhandled Error:', error)
    return NextResponse.json(
      { 
        error: 'Unhandled server error',
        details: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}