import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getUserById } from "@/lib/data"
import type { Order } from "@/lib/types"

export async function GET() {
  const auth = await getAuthFromCookie()
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = getUserById(auth.userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  let orders: Order[] = []
  if (user.role === "pharmacy_owner" && user.pharmacyId) {
    // Get orders from Supabase for this pharmacy
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('pharmacy_id', user.pharmacyId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
    
    // Get order items for each order
    orders = await Promise.all((data || []).map(async (order) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)
      
      return {
        id: order.id,
        pharmacyId: order.pharmacy_id,
        pharmacyName: order.pharmacy_name,
        distributorId: order.distributor_id,
        status: order.status,
        specialInstructions: order.special_instructions,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: items || []
      }
    }))
  } else if (user.role === "distributor" && user.distributorId) {
    // Get orders from Supabase for this distributor
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('distributor_id', user.distributorId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
    
    // Get order items for each order
    orders = await Promise.all((data || []).map(async (order) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)
      
      return {
        id: order.id,
        pharmacyId: order.pharmacy_id,
        pharmacyName: order.pharmacy_name,
        distributorId: order.distributor_id,
        status: order.status,
        specialInstructions: order.special_instructions,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: items || []
      }
    }))
  } else {
    orders = []
  }

  return NextResponse.json({ orders })
}

export async function POST(request: Request) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "pharmacy_owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const user = getUserById(auth.userId)
  if (!user || !user.pharmacyId) {
    return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
  }

  try {
    const { items, specialInstructions, distributorId } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 })
    }

    const totalAmount = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0)

    // Get pharmacy name from Supabase
    const { data: pharmacyData } = await supabase
      .from('pharmacies')
      .select('store_name')
      .eq('id', user.pharmacyId)
      .single()

    const pharmacyName = pharmacyData?.store_name || "Unknown Pharmacy"

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        pharmacy_id: user.pharmacyId,
        pharmacy_name: pharmacyName,
        distributor_id: distributorId || "dist-1",
        status: "pending",
        special_instructions: specialInstructions || null,
        total_amount: totalAmount
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items in Supabase
    const orderItems = items.map((item: { medicineId: string; medicineName: string; quantity: number; unitPrice: number }) => ({
      order_id: order.id,
      medicine_id: item.medicineId,
      medicine_name: item.medicineName,
      quantity: item.quantity,
      unit_price: item.unitPrice
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback - delete the order if items fail
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({ 
      order: {
        id: order.id,
        pharmacyId: order.pharmacy_id,
        pharmacyName: order.pharmacy_name,
        distributorId: order.distributor_id,
        status: order.status,
        specialInstructions: order.special_instructions,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: orderItems
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
