import { cookies } from "next/headers"
import type { AuthPayload } from "./types"
import { encodeToken, decodeToken } from "./token"

export { encodeToken, decodeToken }

const COOKIE_NAME = "pharmaflow_token"

export async function setAuthCookie(payload: AuthPayload): Promise<void> {
  const token = encodeToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthFromCookie(): Promise<AuthPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return decodeToken(token)
}

export function getTokenFromHeader(cookieHeader: string | null): AuthPayload | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) return null
  return decodeToken(match[1])
}
