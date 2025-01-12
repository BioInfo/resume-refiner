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
    const { resumeData, jobDetails } = await request.json();
    
    if (!resumeData || !jobDetails) {
      return NextResponse.json(
        { error: 'Resume data and job details are required' },
        { status: 400 }
      );
    }

    if (!jobDetails.id) {
      return NextResponse.json(
        { error: 'Job ID is required in job details' },
        { status: 400 }
      );
    }

    // Use OpenAI to refine the resume based on job requirements
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional resume writer. Your task is to refine the provided resume to better match the job requirements.
            Focus on:
            1. Highlighting relevant skills and experiences
            2. Using industry-specific keywords from the job description
            3. Quantifying achievements where possible
            4. Maintaining truthfulness (no fabrication)
            
            IMPORTANT: You must return ONLY a valid JSON object with the same structure as the input resume.
            Do not include any explanatory text or prefixes. The response must be parseable by JSON.parse().`
        },
        {
          role: 'user',
          content: `Input Resume: ${JSON.stringify(resumeData)}
            Job Details: ${JSON.stringify(jobDetails)}
            
            Please refine this resume to better match the job requirements. Return only the refined resume as a JSON object.`
        }
      ]
    });
    const content = completion.choices[0].message.content || '{}';

    let refinedResume;
try {
  refinedResume = JSON.parse(content);
} catch (error) {
  console.error('Failed to parse OpenAI response as JSON:', content);
  return NextResponse.json(
    { error: 'Invalid response format from AI model' },
    { status: 500 }
  );
}

// Validate the parsed response has the expected structure
if (!refinedResume || typeof refinedResume !== 'object') {
  console.error('Invalid resume structure:', refinedResume);
  return NextResponse.json(
    { error: 'Invalid resume structure in AI response' },
    { status: 500 }
  );
}

    // Store in Supabase
    const { data, error } = await supabase
      .from('refined_resume_data')
      .insert({
        user_id: DEMO_USER_ID,
        resume_json: resumeData,
        job_id: jobDetails.id, // Assuming job_id is available in jobDetails
        refined_json: refinedResume
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store refined resume' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: refinedResume
    });

  } catch (error) {
    console.error('Error refining resume:', error);
    return NextResponse.json(
      { error: 'Failed to refine resume' },
      { status: 500 }
    );
  }
}