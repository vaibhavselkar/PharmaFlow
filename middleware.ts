import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decodeToken } from "@/lib/token"

const publicPaths = ["/login", "/api/auth/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and static files
  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get("pharmaflow_token")?.value
  const auth = token ? decodeToken(token) : null

  // If not authenticated, redirect to login
  if (!auth) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Role-based route protection
  if (pathname.startsWith("/dashboard/pharmacy") && auth.role !== "pharmacy_owner") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/dashboard/distributor") && auth.role !== "distributor") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/dashboard/agent") && auth.role !== "agent") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
