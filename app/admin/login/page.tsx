"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Loader2 } from "lucide-react"
import { decodeToken } from "@/lib/token"
import type { AuthPayload } from "@/lib/types"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Check if already logged in
  useEffect(() => {
    function checkSession() {
      const cookie = document.cookie
      const match = cookie.match(/pharmaflow_token=([^;]+)/)
      if (match) {
        const auth = decodeToken(match[1]) as AuthPayload | null
        if (auth) {
          router.push("/admin/dashboard")
          return
        }
      }
      setInitializing(false)
    }
    checkSession()
  }, [router])


  async function handleEmailLogin() {
    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Invalid email or password")
        setLoading(false)
        return
      }

      toast.success("Login successful!")
      router.push("/admin/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Branding */}
        <div className="flex flex-1 flex-col items-center gap-4 lg:items-start lg:pt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ShieldCheck className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">PharmaFlow Admin</h1>
          </div>
          <p className="max-w-sm text-center text-muted-foreground leading-relaxed lg:text-left">
            Admin panel for managing the PharmaFlow platform. Sign in to access the admin dashboard.
          </p>
        </div>

        {/* Login form */}
        <Card className="w-full max-w-sm border-border shadow-lg">
          <CardHeader className="gap-1">
            <CardTitle className="text-xl text-foreground">Admin Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEmailLogin()
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
