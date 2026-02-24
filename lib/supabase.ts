import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',          // ✅ Forces ?code= param instead of #access_token hash
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  }
})

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
  return await supabase.auth.signUp({ email, password })
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/admin/auth/callback`,
    },
  })
}


export async function signOut() {
  return await supabase.auth.signOut()
}

// Database operations for pharmacies
export async function createPharmacy(data: {
  store_name: string
  owner_name: string
  contact_phone?: string
  email: string
  address?: string
  city?: string
  state?: string
  license_number?: string
}) {
  return await supabase.from('pharmacies').insert(data).select()
}

export async function getPharmacies() {
  return await supabase.from('pharmacies').select('*').order('created_at', { ascending: false })
}

export async function getPharmacyCount() {
  const { count } = await supabase
    .from('pharmacies')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

// Database operations for agents
export async function createAgent(data: {
  name: string
  contact_phone?: string
  email: string
  distributor_id?: string
}) {
  return await supabase.from('agents').insert(data).select()
}

export async function getAgents() {
  return await supabase.from('agents').select('*').order('created_at', { ascending: false })
}

export async function getAgentCount() {
  const { count } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

// Database operations for orders
export async function getOrders() {
  return await supabase.from('orders').select('*').order('created_at', { ascending: false })
}

export async function getOrderCount() {
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

// Get pharmacy by email
export async function getPharmacyByEmail(email: string) {
  return await supabase
    .from('pharmacies')
    .select('*')
    .eq('email', email)
    .single()
}

// Get agent by email
export async function getAgentByEmail(email: string) {
  return await supabase
    .from('agents')
    .select('*')
    .eq('email', email)
    .single()
}
