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

    // Extract job details using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Extract key details from the job description into a structured JSON format. Include:
            - role_title: The job title
            - required_skills: Array of required technical skills
            - preferred_skills: Array of preferred/optional skills
            - responsibilities: Array of key job responsibilities
            - qualifications: Array of required qualifications (education, experience)
            - company_info: Basic company details if provided
            Format as valid JSON with these exact keys.`
        },
        {
          role: 'user',
          content: jobDescription
        }
      ]
    });

    const extractedDetails = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      data: extractedDetails
    });

  } catch (error) {
    console.error('Error processing job description:', error);
    return NextResponse.json(
      { error: 'Failed to process job description' },
      { status: 500 }
    );
  }
}