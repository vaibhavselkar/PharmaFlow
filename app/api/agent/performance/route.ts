import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { getUserById, getAgentAssignments, getPharmacyById, getPharmacyLastOrder, getOrdersByPharmacy } from "@/lib/data"

export async function GET() {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const user = getUserById(auth.userId)
  if (!user?.agentId) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  const assignments = getAgentAssignments(user.agentId)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

  const pharmacyData = assignments.map((assignment) => {
    const pharmacy = getPharmacyById(assignment.pharmacyId)
    const lastOrder = getPharmacyLastOrder(assignment.pharmacyId)
    const allOrders = getOrdersByPharmacy(assignment.pharmacyId)
    const isActive = lastOrder ? new Date(lastOrder.createdAt) >= sevenDaysAgo : false

    return {
      pharmacyId: assignment.pharmacyId,
      storeName: pharmacy?.storeName || "Unknown",
      ownerName: pharmacy?.ownerName || "Unknown",
      address: pharmacy?.address || "",
      city: pharmacy?.city || "",
      state: pharmacy?.state || "",
      contactPhone: pharmacy?.contactPhone || "",
      lastOrderDate: lastOrder?.createdAt || null,
      totalOrders: allOrders.length,
      isActive,
      assignedAt: assignment.assignedAt,
    }
  })

  const totalAssigned = pharmacyData.length
  const activeCount = pharmacyData.filter((p) => p.isActive).length
  const inactiveCount = totalAssigned - activeCount

  return NextResponse.json({
    pharmacies: pharmacyData,
    metrics: {
      totalAssigned,
      activeCount,
      inactiveCount,
    },
  })
}
