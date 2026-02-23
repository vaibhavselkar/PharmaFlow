import { NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // For Google OAuth users, we create a basic token
    // You may want to map this to an existing user in your data or create a new flow
    await setAuthCookie({
      userId: `google-${email}`,
      role: "pharmacy_owner", // Default role for Google users - adjust as needed
      email,
      name: name || email.split("@")[0],
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
