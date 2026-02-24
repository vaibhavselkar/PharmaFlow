import { NextResponse } from "next/server"
import { signUpWithEmail, createPharmacy, createAgent } from "@/lib/supabase"
import { setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, role, storeName, name, phone, address, city, state, licenseNumber } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 })
    }

    // Sign up with Supabase Auth
    const { data: authData, error } = await signUpWithEmail(email, password)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Save to database based on role
    if (role === "pharmacy") {
      const { error: pharmacyError } = await createPharmacy({
        store_name: storeName,
        owner_name: name,
        contact_phone: phone,
        email,
        address,
        city,
        state,
        license_number: licenseNumber,
      })
      
      if (pharmacyError) {
        console.error("Error creating pharmacy:", pharmacyError)
      }
    } else if (role === "agent") {
      const { error: agentError } = await createAgent({
        name,
        contact_phone: phone,
        email,
      })
      
      if (agentError) {
        console.error("Error creating agent:", agentError)
      }
    }

    // Set auth cookie with user info
    const displayName = role === "pharmacy" ? storeName : name
    await setAuthCookie({
      userId: authData.user?.id || email,
      role: role === "pharmacy" ? "pharmacy_owner" : "agent",
      email,
      name: displayName,
    })

    return NextResponse.json({
      success: true,
      user: {
        email,
        name: displayName,
        role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
