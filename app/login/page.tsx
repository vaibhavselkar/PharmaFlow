"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Pill, ShieldCheck, Truck, User } from "lucide-react"

const demoAccounts = [
  {
    label: "Pharmacy Owner",
    email: "pharmacy@demo.com",
    password: "password",
    icon: Pill,
    description: "Browse medicines, place orders, track deliveries",
  },
  {
    label: "Distributor",
    email: "distributor@demo.com",
    password: "password",
    icon: Truck,
    description: "Manage orders, update inventory, track fulfillment",
  },
  {
    label: "Field Agent",
    email: "agent@demo.com",
    password: "password",
    icon: User,
    description: "Monitor pharmacies, search substitutes",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(loginEmail: string, loginPassword: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Login failed")
        return
      }
      toast.success(`Welcome back, ${data.user.name}!`)
      const roleRoutes: Record<string, string> = {
        pharmacy_owner: "/dashboard/pharmacy",
        distributor: "/dashboard/distributor",
        agent: "/dashboard/agent",
      }
      router.push(roleRoutes[data.user.role] || "/login")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
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
            Streamline your pharmacy ordering and distribution. Manage medicines, track orders, and monitor your supply chain - all in one place.
          </p>

          {/* Demo accounts */}
          <div className="mt-4 w-full max-w-sm">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Quick access with demo accounts:</p>
            <div className="flex flex-col gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon
                return (
                  <button
                    key={account.email}
                    onClick={() => handleLogin(account.email, account.password)}
                    disabled={loading}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{account.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{account.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Login form */}
        <Card className="w-full max-w-sm border-border shadow-lg">
          <CardHeader className="gap-1">
            <CardTitle className="text-xl text-foreground">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin(email, password)
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
            <Separator className="my-4" />
            <p className="text-center text-xs text-muted-foreground">
              Demo mode - use the quick-access buttons or sign in with any demo account
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
