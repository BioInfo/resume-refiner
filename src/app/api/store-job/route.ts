import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Demo user ID (from currentTask.md)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function POST(request: Request) {
  try {
    const { jobDescription, extractedDetails } = await request.json();
    
    if (!jobDescription || !extractedDetails) {
      return NextResponse.json(
        { error: 'Job description and extracted details are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('job_data')
      .insert({
        user_id: DEMO_USER_ID,
        job_description: jobDescription,
        extracted_details: extractedDetails
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store job details' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error storing job:', error);
    return NextResponse.json(
      { error: 'Failed to store job' },
      { status: 500 }
    );
  }
}