import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check for our custom auth cookie FIRST
  const pharmaflowToken = request.cookies.get("pharmaflow_token")?.value
  let isAuthenticated = false
  
  if (pharmaflowToken) {
    try {
      // Decode the token (base64 -> json)
      const decoded = JSON.parse(decodeURIComponent(atob(pharmaflowToken)))
      if (decoded.userId && decoded.role && decoded.email) {
        isAuthenticated = true
      }
    } catch (e) {
      // Invalid token
    }
  }
  
  // Also check Supabase auth as fallback
  if (!isAuthenticated) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthenticated = true
    }
  }

  const pathname = request.nextUrl.pathname

  // Never block the auth callback
  if (pathname.startsWith("/admin/auth/callback")) {
    return supabaseResponse
  }

  // Protect dashboard — redirect to login if not authenticated
  if (!isAuthenticated && pathname.startsWith("/admin/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // Already logged in — skip login page
  if (isAuthenticated && pathname === "/admin/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
