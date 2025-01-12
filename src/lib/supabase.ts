import { createClient } from '@supabase/supabase-js'

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables')
}

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase instance with service role key
// Note: For MVP, we'll use the anon key for both client and server
// In production, you would use a service role key for server operations
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)