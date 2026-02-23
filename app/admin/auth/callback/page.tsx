"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function handleCallback() {
      try {
        // Check for errors in URL
        const params = new URLSearchParams(window.location.search)
        const errorParam = params.get("error")
        const errorDescription = params.get("error_description")

        if (errorParam) {
          setError(errorDescription || errorParam)
          setLoading(false)
          return
        }

        // Supabase OAuth returns tokens in URL hash (#)
        // The Supabase client should automatically handle this
        // Let's wait a bit and check if session is established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setError(sessionError.message)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Get user info from Supabase session
          const email = session.user.email || ""
          const name = session.user.user_metadata?.full_name || ""

          // Call our API to set the pharmaflow_token cookie
          try {
            await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name }),
            })
          } catch (e) {
            console.error("Failed to set auth cookie:", e)
          }

          router.push("/admin/dashboard")
        } else {
          // No session - check if we have tokens in the hash
          if (window.location.hash) {
            // The hash contains tokens - give it a moment for Supabase to process
            setTimeout(() => {
              router.push("/admin/dashboard")
            }, 1000)
          } else {
            setError("Authentication failed. No session established.")
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during authentication")
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
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
