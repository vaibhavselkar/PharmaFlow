"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Store, Truck, Users, Link as LinkIcon, Plus, Loader2, Package, ShoppingCart, Mail, MapPin, Phone, Calendar, Warehouse, IndianRupee, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPharmacies, getAgents, getDistributors, getOrders, getPharmacyCount, getAgentCount, getDistributorCount, getOrderCount, getOrderStats, getOrdersByMonth, getAgentStats } from "@/lib/supabase"

interface InviteLink {
  id: string
  role: "pharmacy" | "agent" | "distributor"
  token: string
  createdAt: string
  expiresAt: string
  used: boolean
}

interface Pharmacy {
  id: string
  store_name: string
  owner_name: string
  contact_phone: string
  email: string
  address: string
  city: string
  state: string
  license_number: string
  created_at: string
}

interface Agent {
  id: string
  name: string
  contact_phone: string
  email: string
  distributor_id: string
  created_at: string
}

interface Distributor {
  id: string
  agency_name: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  state: string
  created_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newInviteRole, setNewInviteRole] = useState<"pharmacy" | "agent" | "distributor">("pharmacy")
  
  // Data from database
  const [pharmacyCount, setPharmacyCount] = useState(0)
  const [agentCount, setAgentCount] = useState(0)
  const [distributorCount, setDistributorCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  
  // Analytics data
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [deliveredCount, setDeliveredCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [monthlyData, setMonthlyData] = useState<Record<string, { revenue: number; count: number }>>({})
  const [agentDeliveryStats, setAgentDeliveryStats] = useState<any[]>([])

  // Fetch data from database
  async function fetchDashboardData() {
    try {
      const [pharmacyCountVal, agentCountVal, distributorCountVal, orderCountVal] = await Promise.all([
        getPharmacyCount(),
        getAgentCount(),
        getDistributorCount(),
        getOrderCount()
      ])
      
      setPharmacyCount(pharmacyCountVal)
      setAgentCount(agentCountVal)
      setDistributorCount(distributorCountVal)
      setOrderCount(orderCountVal)
      
      // Also fetch the actual records for display
      const { data: pharmaciesData } = await getPharmacies()
      if (pharmaciesData) setPharmacies(pharmaciesData)
      
      const { data: agentsData } = await getAgents()
      if (agentsData) setAgents(agentsData)
      
      const { data: distributorsData } = await getDistributors()
      if (distributorsData) setDistributors(distributorsData)
      
      // Fetch analytics data
      const orderStats = await getOrderStats()
      setTotalRevenue(orderStats.totalRevenue)
      setDeliveredCount(orderStats.deliveredCount)
      setPendingCount(orderStats.pendingCount)
      
      const monthly = await getOrdersByMonth()
      setMonthlyData(monthly)
      
      const agentStats = await getAgentStats()
      setAgentDeliveryStats(agentStats)
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Check auth using our cookie
  useEffect(() => {
    function checkAuth() {
      const cookie = document.cookie
      const match = cookie.match(/pharmaflow_token=([^;]+)/)
      if (!match) {
        router.push("/admin/login")
        return
      }
      
      // Decode the token to get user info
      try {
        const token = match[1]
        const decoded = JSON.parse(decodeURIComponent(atob(token)))
        setUser({ email: decoded.email, user_metadata: { full_name: decoded.name } })
        setLoading(false)
        // Fetch dashboard data after auth
        fetchDashboardData()
      } catch (e) {
        router.push("/admin/login")
      }
    }
    
    checkAuth()
  }, [router])

  function generateInviteToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  function createInviteLink(role: "pharmacy" | "agent" | "distributor") {
    const token = generateInviteToken()
    const newLink: InviteLink = {
      id: `invite-${Date.now()}`,
      role,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toJSON(),
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
    // Clear our auth cookie
    document.cookie = "pharmaflow_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
            <span className="text-sm text-muted-foreground">{user?.user_metadata?.full_name || user?.email}</span>
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
            <TabsTrigger value="distributors">Distributors</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
            <TabsTrigger value="agents">Delivery Agents</TabsTrigger>
            <TabsTrigger value="invites">Invite Links</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Analytics Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Analytics & Revenue</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : `₹${totalRevenue.toLocaleString('en-IN')}`}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Delivered Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : deliveredCount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : pendingCount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : orderCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Platform Stats Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Distributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-5 w-5 text-indigo-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : distributorCount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pharmacies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-blue-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : pharmacyCount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-green-500" />
                      <p className="text-3xl font-bold">{statsLoading ? "..." : agentCount}</p>
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
            </div>

            {/* Agent Performance Section */}
            {agentDeliveryStats.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Delivery Agent Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agentDeliveryStats.map((agent) => (
                    <Card key={agent.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                        <CardDescription>{agent.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{agent.completedDeliveries || 0}</p>
                            <p className="text-xs text-muted-foreground">Delivered</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{agent.totalDeliveries || 0}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distributors Tab */}
          <TabsContent value="distributors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Distributors</CardTitle>
                    <CardDescription>Distributors supplying medicines to pharmacies</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setNewInviteRole("distributor")
                    setIsCreateDialogOpen(true)
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Distributor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {distributors.length === 0 ? (
                  <div className="text-center py-12">
                    <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No distributors registered yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Add a distributor to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {distributors.map((distributor) => (
                      <div key={distributor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <Warehouse className="h-6 w-6 text-indigo-500" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{distributor.agency_name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {distributor.contact_email}
                              </span>
                              {distributor.contact_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {distributor.contact_phone}
                                </span>
                              )}
                            </div>
                            {(distributor.city || distributor.state) && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {[distributor.address, distributor.city, distributor.state].filter(Boolean).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">Distributor</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(distributor.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {pharmacies.length === 0 ? (
                  <div className="text-center py-12">
                    <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pharmacies registered yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Create an invite link to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pharmacies.map((pharmacy) => (
                      <div key={pharmacy.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Store className="h-6 w-6 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{pharmacy.store_name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {pharmacy.owner_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {pharmacy.email}
                              </span>
                              {pharmacy.contact_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {pharmacy.contact_phone}
                                </span>
                              )}
                            </div>
                            {(pharmacy.city || pharmacy.state) && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {[pharmacy.address, pharmacy.city, pharmacy.state].filter(Boolean).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {pharmacy.license_number && (
                            <Badge variant="outline">{pharmacy.license_number}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(pharmacy.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {agents.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No delivery agents yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Create an invite link to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Truck className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{agent.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {agent.email}
                              </span>
                              {agent.contact_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {agent.contact_phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">Agent</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(agent.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <div className="text-center py-12">
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
                            <Plus className="mr-2 h-4 w-4" />
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
                  variant={newInviteRole === "distributor" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewInviteRole("distributor")}
                >
                  <Warehouse className="mr-2 h-4 w-4" />
                  Distributor
                </Button>
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
                  Agent
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
