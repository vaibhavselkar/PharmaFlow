import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { getUserById, getOrdersByPharmacy, getOrdersByDistributor, createOrder, pharmacies } from "@/lib/data"

export async function GET() {
  const auth = await getAuthFromCookie()
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = getUserById(auth.userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  let orders
  if (user.role === "pharmacy_owner" && user.pharmacyId) {
    orders = getOrdersByPharmacy(user.pharmacyId)
  } else if (user.role === "distributor" && user.distributorId) {
    orders = getOrdersByDistributor(user.distributorId)
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

    const pharmacy = pharmacies.find((p) => p.id === user.pharmacyId)
    const totalAmount = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0)

    const order = createOrder({
      pharmacyId: user.pharmacyId,
      pharmacyName: pharmacy?.storeName || "Unknown",
      distributorId: distributorId || "dist-1",
      status: "pending",
      specialInstructions: specialInstructions || undefined,
      items: items.map((item: { medicineId: string; medicineName: string; quantity: number; unitPrice: number }, idx: number) => ({
        id: `oi-new-${Date.now()}-${idx}`,
        orderId: "",
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalAmount,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
