"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for errors in URL
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get("error")
    const errorDescription = params.get("error_description")

    if (errorParam) {
      setError(errorDescription || errorParam)
      return
    }

    // If no error, the session should be set automatically by Supabase
    // Just redirect to admin dashboard after a short delay
    const timer = setTimeout(() => {
      router.push("/admin/dashboard")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a 
            href="/admin/login" 
            className="text-primary hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
