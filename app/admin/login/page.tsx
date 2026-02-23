"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Loader2 } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import { signInWithEmail, signUpWithEmail, signInWithGoogle, supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Check if already logged in
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/admin/dashboard")
        return
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
      const { data, error } = isRegistering
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password)

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if session exists
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        if (isRegistering) {
          toast.success("Registration successful! Please check your email to verify.")
        } else {
          toast.success("Login successful!")
        }
        router.push("/admin/dashboard")
      } else {
        toast.error("Authentication failed. Please try again.")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error.message)
        setLoading(false)
      }
      // Redirect will happen automatically via OAuth
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
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
            Admin panel for managing the PharmaFlow platform. Register or sign in to access the admin dashboard.
          </p>
        </div>

        {/* Login/Register form */}
        <Card className="w-full max-w-sm border-border shadow-lg">
          <CardHeader className="gap-1">
            <CardTitle className="text-xl text-foreground">
              {isRegistering ? "Create Admin Account" : "Admin Sign In"}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Enter your details to create an admin account" 
                : "Enter your credentials to access the admin panel"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRegistering && (
              <div className="mb-4">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
                {loading 
                  ? (isRegistering ? "Creating account..." : "Signing in...") 
                  : (isRegistering ? "Create Account" : "Sign in")}
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full"
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setEmail("")
                  setPassword("")
                  setName("")
                }}
                className="text-primary hover:underline"
              >
                {isRegistering ? "Sign in" : "Register"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
