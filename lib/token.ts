import type { AuthPayload } from "./types"

export function encodeToken(payload: AuthPayload): string {
  const json = JSON.stringify(payload)
  return btoa(encodeURIComponent(json))
}

export function decodeToken(token: string): AuthPayload | null {
  try {
    const json = decodeURIComponent(atob(token))
    const payload = JSON.parse(json) as AuthPayload
    if (payload.userId && payload.role && payload.email) {
      return payload
    }
    return null
  } catch {
    return null
  }
}
