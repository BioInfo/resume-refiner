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

    // Validate and limit input size
    const resumeStr = JSON.stringify(resumeData);
    const jobStr = JSON.stringify(jobDetails);
    if (resumeStr.length > 6000 || jobStr.length > 4000) {
      return NextResponse.json(
        { error: 'Input data too large' },
        { status: 400 }
      );
    }

    try {
      // Use OpenAI to refine the resume based on job requirements
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume writer. Your task is to refine the provided resume to better match the job requirements.
              Focus on:
              1. Highlighting relevant skills and experiences
              2. Using industry-specific keywords from the job description
              3. Quantifying achievements where possible
              4. Maintaining truthfulness (no fabrication)
              
              Return a JSON object with the same structure as the input resume.`
          },
          {
            role: 'user',
            content: `Input Resume: ${resumeStr}
              Job Details: ${jobStr}
              
              Please refine this resume to better match the job requirements.`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      let refinedResume;
      try {
        refinedResume = JSON.parse(completion.choices[0].message.content || '{}');
      } catch (jsonError) {
        console.error('Failed to parse OpenAI response:', jsonError);
        return NextResponse.json(
          { 
            error: 'Invalid response format from AI model',
            details: 'Failed to parse AI response as JSON'
          },
          { status: 500 }
        );
      }

      // Validate the parsed response has the expected structure
      if (!refinedResume || typeof refinedResume !== 'object') {
        console.error('Invalid resume structure:', refinedResume);
        return NextResponse.json(
          { 
            error: 'Invalid resume structure in AI response',
            details: 'Response missing required fields'
          },
          { status: 500 }
        );
      }

      // Store in Supabase
      try {
        const { data, error } = await supabase
          .from('refined_resume_data')
          .insert({
            user_id: DEMO_USER_ID,
            resume_json: resumeData,
            job_id: jobDetails.id,
            refined_json: refinedResume
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json(
            { 
              error: 'Failed to store refined resume',
              details: error.message
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: refinedResume
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { 
            error: 'Database operation failed',
            details: dbError instanceof Error ? dbError.message : 'Unknown database error'
          },
          { status: 500 }
        );
      }

    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      return NextResponse.json(
        { 
          error: 'Failed to refine resume with AI',
          details: openaiError instanceof Error ? openaiError.message : 'Unknown AI error'
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