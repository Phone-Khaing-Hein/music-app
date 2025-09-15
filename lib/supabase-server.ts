import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types_db'

// Create a Supabase client for server-side operations
// This uses the service role key to bypass RLS for public data
export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
