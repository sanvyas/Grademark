import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in the ' +
      'credentials for the same Supabase project the GradeMark platform (Lovable) already uses — do not create a new project.',
  )
}

// persistSession: false — v1 has no login/account system, so there is no user session to persist.
export const supabase = createClient(supabaseUrl ?? 'https://placeholder.supabase.co', supabaseAnonKey ?? 'placeholder', {
  auth: { persistSession: false },
})
