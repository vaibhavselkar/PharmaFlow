import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { updateMedicine } from "@/lib/data"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "distributor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const updates = await request.json()
    const { id } = await params

    const medicine = updateMedicine(id, updates)
    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }

    return NextResponse.json({ medicine })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
