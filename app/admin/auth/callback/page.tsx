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
    let attempts = 0
    const maxAttempts = 10
    
    const checkSession = async () => {
      attempts++
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const email = session.user.email || ""
        const name = session.user.user_metadata?.full_name || ""
        
        try {
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
          })
          
          if (response.ok) {
            // Use window.location to ensure full page reload with cookie
            window.location.href = "/admin/dashboard"
            return
          }
        } catch (e) {
          console.error("Failed to set auth cookie:", e)
        }
        
        // Fallback to router if fetch fails
        router.replace("/admin/dashboard")
        return
      }
      
      // If no session yet, try again (up to maxAttempts)
      if (attempts < maxAttempts) {
        setTimeout(checkSession, 1000)
      } else {
        setError("Authentication timed out - please try again")
        setLoading(false)
      }
    }
    
    // Start checking after a short delay to allow Supabase to process URL
    setTimeout(checkSession, 2000)
  }, [router])

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
