"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
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

        router.replace("/admin/dashboard")
      } else {
        router.replace("/admin/login?error=auth_failed")
      }
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}
