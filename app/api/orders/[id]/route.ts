import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getUserById } from "@/lib/data"
import type { Order } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie()
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = getUserById(auth.userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { id } = await params

  try {
    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if the user owns this order (for pharmacy owners)
    if (user.role === "pharmacy_owner" && order.pharmacy_id !== user.pharmacyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get order items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)

    const formattedOrder: Order = {
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

    return NextResponse.json({ order: formattedOrder })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "pharmacy_owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const user = getUserById(auth.userId)
  if (!user || !user.pharmacyId) {
    return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { items, specialInstructions } = body

    // Get the existing order
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if the user owns this order
    if (existingOrder.pharmacy_id !== user.pharmacyId) {
      return NextResponse.json({ error: "Unauthorized - you can only edit your own orders" }, { status: 403 })
    }

    // Only allow editing if order is still pending
    if (existingOrder.status !== 'pending') {
      return NextResponse.json({ error: "Can only edit orders with 'pending' status" }, { status: 400 })
    }

    // If updating items, recalculate total and update order items
    if (items && Array.isArray(items)) {
      const totalAmount = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => 
        sum + item.quantity * item.unitPrice, 0
      )

      // Update order with new items and total
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          special_instructions: specialInstructions || existingOrder.special_instructions,
          total_amount: totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
      }

      // Delete existing order items
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id)

      // Insert new order items
      const orderItems = items.map((item: { medicineId: string; medicineName: string; quantity: number; unitPrice: number }) => ({
        order_id: id,
        medicine_id: item.medicineId,
        medicine_name: item.medicineName,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error updating order items:', itemsError)
        return NextResponse.json({ error: "Failed to update order items" }, { status: 500 })
      }
    } else if (specialInstructions !== undefined) {
      // Just update special instructions
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          special_instructions: specialInstructions,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
      }
    }

    // Fetch the updated order
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    const { data: updatedItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)

    return NextResponse.json({
      order: {
        id: updatedOrder?.id,
        pharmacyId: updatedOrder?.pharmacy_id,
        pharmacyName: updatedOrder?.pharmacy_name,
        distributorId: updatedOrder?.distributor_id,
        status: updatedOrder?.status,
        specialInstructions: updatedOrder?.special_instructions,
        totalAmount: parseFloat(updatedOrder?.total_amount),
        createdAt: updatedOrder?.created_at,
        updatedAt: updatedOrder?.updated_at,
        items: updatedItems || []
      }
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// Also allow DELETE for pending orders (cancel order)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "pharmacy_owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const user = getUserById(auth.userId)
  if (!user || !user.pharmacyId) {
    return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
  }

  const { id } = await params

  try {
    // Get the existing order
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if the user owns this order
    if (existingOrder.pharmacy_id !== user.pharmacyId) {
      return NextResponse.json({ error: "Unauthorized - you can only cancel your own orders" }, { status: 403 })
    }

    // Only allow deleting/canceling if order is still pending
    if (existingOrder.status !== 'pending') {
      return NextResponse.json({ error: "Can only cancel orders with 'pending' status" }, { status: 400 })
    }

    // Delete order items first (due to foreign key)
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id)

    // Delete the order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting order:', deleteError)
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
    }

    return NextResponse.json({ message: "Order cancelled successfully" })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
