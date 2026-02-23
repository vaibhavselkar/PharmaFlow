import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { getUserById } from "@/lib/data"

export async function GET() {
  const auth = await getAuthFromCookie()
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = getUserById(auth.userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      pharmacyId: user.pharmacyId,
      distributorId: user.distributorId,
      agentId: user.agentId,
    },
  })
}
