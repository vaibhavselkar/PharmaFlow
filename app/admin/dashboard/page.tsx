"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { signOut, supabase } from "@/lib/supabase"
import { Copy, Link as LinkIcon, Plus, Users, Store, Truck, Loader2 } from "lucide-react"

interface InviteLink {
  id: string
  role: "pharmacy" | "agent"
  token: string
  createdAt: string
  expiresAt: string
  used: boolean
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newInviteRole, setNewInviteRole] = useState<"pharmacy" | "agent">("pharmacy")

  // Set up auth state listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login")
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login")
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  function generateInviteToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  function createInviteLink(role: "pharmacy" | "agent") {
    const token = generateInviteToken()
    const newLink: InviteLink = {
      id: `invite-${Date.now()}`,
      role,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      used: false,
    }
    setInviteLinks([newLink, ...inviteLinks])
    toast.success(`Invite link for ${role} created!`)
    setIsCreateDialogOpen(false)
  }

  function copyInviteLink(token: string, role: string) {
    const inviteUrl = `${window.location.origin}/register?role=${role}&token=${token}`
    navigator.clipboard.writeText(inviteUrl)
    toast.success("Invite link copied to clipboard!")
  }

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white px-8 py-4">
        <div className="mx-auto max-w-6xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">PharmaFlow Admin</h1>
            <p className="text-sm text-muted-foreground">Manage your platform</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
            <TabsTrigger value="agents">Delivery Agents</TabsTrigger>
            <TabsTrigger value="invites">Invite Links</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Pharmacies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-500" />
                    <p className="text-3xl font-bold">3</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-500" />
                    <p className="text-3xl font-bold">1</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <p className="text-3xl font-bold">5</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Invites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-orange-500" />
                    <p className="text-3xl font-bold">{inviteLinks.filter(l => !l.used).length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invite Link
                </Button>
                <Button variant="outline">View All Orders</Button>
                <Button variant="outline">Platform Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pharmacies Tab */}
          <TabsContent value="pharmacies">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Pharmacies</CardTitle>
                    <CardDescription>Pharmacies using the PharmaFlow platform</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setNewInviteRole("pharmacy")
                    setIsCreateDialogOpen(true)
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pharmacy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">HealthFirst Pharmacy</p>
                      <p className="text-sm text-muted-foreground">Mumbai, Maharashtra</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Rajesh Patel</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">City Care Pharmacy</p>
                      <p className="text-sm text-muted-foreground">Pune, Maharashtra</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Meena Gupta</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Green Cross Pharmacy</p>
                      <p className="text-sm text-muted-foreground">Nagpur, Maharashtra</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Suresh Kumar</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Delivery Agents</CardTitle>
                    <CardDescription>Agents managing deliveries for pharmacies</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setNewInviteRole("agent")
                    setIsCreateDialogOpen(true)
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Agent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Vikram Singh</p>
                      <p className="text-sm text-muted-foreground">+91-9845678901</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">MedSupply Distributors</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invite Links Tab */}
          <TabsContent value="invites">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Invite Links</CardTitle>
                    <CardDescription>Generate invite links for new registrations</CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {inviteLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No invite links yet</p>
                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                      Create your first invite link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inviteLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{link.role} Invitation</p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(link.createdAt).toLocaleDateString()} | 
                            Expires: {new Date(link.expiresAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Status: {link.used ? "Used" : "Active"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyInviteLink(link.token, link.role)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Invite Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invite Link</DialogTitle>
            <DialogDescription>
              Generate an invite link for new users to register on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <div className="flex gap-4">
                <Button
                  variant={newInviteRole === "pharmacy" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewInviteRole("pharmacy")}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Pharmacy
                </Button>
                <Button
                  variant={newInviteRole === "agent" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewInviteRole("agent")}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Delivery Agent
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This link will be valid for 7 days and can be used once to register a new {newInviteRole} account.
              </p>
            </div>
            <Button className="w-full" onClick={() => createInviteLink(newInviteRole)}>
              Generate Invite Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
