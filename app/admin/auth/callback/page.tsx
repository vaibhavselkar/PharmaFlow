"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

// This page handles the case where Supabase sends back a #hash fragment
// (Implicit flow) instead of ?code= (PKCE flow)
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // getSession() will automatically parse the #access_token hash from the URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
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