import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Demo user ID (from currentTask.md)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('resume_data')
      .select('resume_json')
      .eq('user_id', DEMO_USER_ID)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resume data' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No resume found. Please upload a resume first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}