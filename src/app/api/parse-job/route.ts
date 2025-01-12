import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Demo user ID (from currentTask.md)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json();
    
    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Limit job description length
    const limitedJobDescription = jobDescription.slice(0, 4000);

    try {
      // Extract job details using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: `Extract key details from the job description into a structured JSON format. Include:
              - role_title: The job title (string)
              - required_skills: Array of required technical skills
              - preferred_skills: Array of preferred/optional skills
              - responsibilities: Array of key job responsibilities
              - qualifications: Array of required qualifications
              - company_info: Object with company details
              
              Ensure all array fields are valid arrays, even if empty.
              Format as valid JSON with these exact keys.`
          },
          {
            role: 'user',
            content: limitedJobDescription
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      let extractedDetails;
      try {
        const parsed = JSON.parse(completion.choices[0].message.content || '{}');
        
        // Validate and transform the response structure
        extractedDetails = {
          role_title: typeof parsed.role_title === 'string' ? parsed.role_title : 'Untitled Position',
          required_skills: Array.isArray(parsed.required_skills) ? parsed.required_skills : [],
          preferred_skills: Array.isArray(parsed.preferred_skills) ? parsed.preferred_skills : [],
          responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
          qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
          company_info: typeof parsed.company_info === 'object' && parsed.company_info !== null 
            ? parsed.company_info 
            : {}
        };

        // Validate all arrays contain only strings
        extractedDetails.required_skills = extractedDetails.required_skills.map(String);
        extractedDetails.preferred_skills = extractedDetails.preferred_skills.map(String);
        extractedDetails.responsibilities = extractedDetails.responsibilities.map(String);
        extractedDetails.qualifications = extractedDetails.qualifications.map(String);

      } catch (jsonError) {
        console.error('Failed to parse OpenAI response:', jsonError);
        return NextResponse.json(
          { 
            error: 'Failed to parse job details',
            details: 'The AI response was not in valid JSON format'
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: extractedDetails
      });

    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { 
          error: 'Failed to analyze job description',
          details: openaiError instanceof Error ? openaiError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Invalid request format'
      },
      { status: 400 }
    );
  }
}