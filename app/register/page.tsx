"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Store, Truck } from "lucide-react"
import { signUpWithEmail, signInWithEmail } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") as "pharmacy" | "agent" | null
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    licenseNumber: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Validate invite token
    if (!role || !token) {
      toast.error("Invalid invite link")
      router.push("/login")
    }
  }, [role, token, router])

  async function handleRegister() {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      // First, try to sign up
      const { data, error } = await signUpWithEmail(formData.email, formData.password)
      
      if (error) {
        // If user already exists, try to sign in
        if (error.message.includes("already been registered")) {
          const { error: signInError } = await signInWithEmail(formData.email, formData.password)
          if (signInError) {
            toast.error(signInError.message)
            return
          }
          // If sign in succeeds, redirect based on role
          toast.success("Welcome back!")
          router.push(role === "pharmacy" ? "/dashboard/pharmacy" : "/dashboard/agent")
          return
        }
        toast.error(error.message)
        return
      }

      toast.success("Registration successful! Please check your email to verify your account.")
      // For now, auto-login for demo purposes
      router.push(role === "pharmacy" ? "/dashboard/pharmacy" : "/dashboard/agent")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!role || !token) {
    return null
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">PharmaFlow</h1>
          </div>
          <p className="max-w-sm text-center text-muted-foreground leading-relaxed lg:text-left">
            Join the PharmaFlow platform as a {role === "pharmacy" ? "pharmacy owner" : "delivery agent"} and start managing your orders efficiently.
          </p>
        </div>

        {/* Registration form */}
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="gap-1">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              {role === "pharmacy" ? (
                <>
                  <Store className="h-5 w-5" />
                  Register as Pharmacy
                </>
              ) : (
                <>
                  <Truck className="h-5 w-5" />
                  Register as Delivery Agent
                </>
              )}
            </CardTitle>
            <CardDescription>Fill in your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRegister()
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name / Owner Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {role === "pharmacy" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Enter pharmacy store name"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91-9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {role === "pharmacy" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="MH-PH-2024-001"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
