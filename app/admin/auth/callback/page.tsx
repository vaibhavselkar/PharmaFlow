"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for auth state changes - Supabase will process the URL and set session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
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

        router.replace("/admin/dashboard")
      } else if (event === 'SIGNED_OUT') {
        setError("Authentication failed")
        setLoading(false)
      }
    })

    // Also check after a timeout in case the event doesn't fire
    setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && loading) {
          const email = session.user.email || ""
          const name = session.user.user_metadata?.full_name || ""
          
          fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
          }).then(() => {
            router.replace("/admin/dashboard")
          })
        } else if (loading) {
          setError("Authentication failed - no session found")
          setLoading(false)
        }
      })
    }, 3000)

    return () => {
      subscription.unsubscribe()
    }
  }, [router, loading])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive">{error}</p>
          <a href="/admin/login" className="text-primary hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}
