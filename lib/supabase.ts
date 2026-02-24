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

// Database operations for distributors
export async function getDistributors() {
  return await supabase.from('distributors').select('*').order('created_at', { ascending: false })
}

export async function getDistributorCount() {
  const { count } = await supabase
    .from('distributors')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

// Database operations for analytics
export async function getOrderStats() {
  // Get all orders with details
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error("Error fetching orders:", error)
    return { orders: [], totalRevenue: 0, deliveredCount: 0, pendingCount: 0 }
  }

  const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0
  const deliveredCount = orders?.filter(o => o.status === 'delivered').length || 0
  const pendingCount = orders?.filter(o => o.status === 'pending').length || 0

  return { orders: orders || [], totalRevenue, deliveredCount, pendingCount }
}

// Get orders by month for charts
export async function getOrdersByMonth() {
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total_amount, status')
    .order('created_at', { ascending: true })

  // Group by month
  const monthlyData: Record<string, { revenue: number; count: number }> = {}
  
  orders?.forEach(order => {
    const date = new Date(order.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    
    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { revenue: 0, count: 0 }
    }
    monthlyData[monthName].revenue += Number(order.total_amount) || 0
    monthlyData[monthName].count += 1
  })

  return monthlyData
}

// Get agent delivery stats
export async function getAgentStats() {
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
  
  const { data: assignments } = await supabase
    .from('agent_assignments')
    .select('*')

  // Get order counts per agent (via pharmacy assignments)
  const { data: orders } = await supabase
    .from('orders')
    .select('pharmacy_id, status')

  const agentStats = agents?.map(agent => {
    // Find pharmacies assigned to this agent
    const assignedPharmacyIds = assignments
      ?.filter(a => a.agent_id === agent.id)
      .map(a => a.pharmacy_id) || []

    // Count orders for these pharmacies
    const agentOrders = orders?.filter(o => 
      assignedPharmacyIds.includes(o.pharmacy_id)
    ) || []

    const delivered = agentOrders.filter(o => o.status === 'delivered').length
    const total = agentOrders.length

    return {
      ...agent,
      totalDeliveries: total,
      completedDeliveries: delivered
    }
  }) || []

  return agentStats
}
