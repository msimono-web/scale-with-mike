import { createClient } from '@supabase/supabase-js'
import type { Lead, Agent } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types Supabase ───────────────────────────────────────────────────────────

export type LeadRow = Omit<Lead, 'historique'> & {
  historique: Lead['historique'] // stored as JSONB
}
