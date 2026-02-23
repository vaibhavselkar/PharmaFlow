import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { updateOrderStatus } from "@/lib/data"
import type { OrderStatus } from "@/lib/types"

const validStatuses: OrderStatus[] = ["pending", "packed", "out_for_delivery", "delivered"]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "distributor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { status } = await request.json()
    const { id } = await params

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const order = updateOrderStatus(id, status)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
