import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { searchBySalt } from "@/lib/data"

export async function GET(request: Request) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const saltName = searchParams.get("salt") || ""

  if (!saltName) {
    return NextResponse.json({ medicines: [] })
  }

  const results = searchBySalt(saltName)
  return NextResponse.json({ medicines: results })
}
