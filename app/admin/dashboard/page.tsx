"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut, getCurrentUser } from "@/lib/supabase"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/admin/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [router])

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Signed out successfully")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome to PharmaFlow Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Pharmacies</CardTitle>
              <CardDescription>Registered pharmacies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">3</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Distributors</CardTitle>
              <CardDescription>Active distributors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>All time orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">5</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your platform</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button>Manage Pharmacies</Button>
              <Button variant="outline">Manage Distributors</Button>
              <Button variant="outline">View Orders</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
