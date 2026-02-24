"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Store, Package, ShoppingCart, CheckCircle, Clock, ArrowLeft, Loader2, Calendar, Phone, Mail, Users } from "lucide-react"
import { getAgents, getAgentLogistics, getAgentAnalytics } from "@/lib/supabase"

interface Agent {
  id: string
  name: string
  email: string
  contact_email: string
  contact_phone: string
  created_at: string
}

interface Pharmacy {
  id: string
  store_name: string
  owner_name: string
}

interface Order {
  id: string
  pharmacy_name: string
  status: string
  total_amount: number
  created_at: string
}

export default function AgentLogisticsPage() {
  const router = useRouter()
  const params = useParams()
  const agentId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [logistics, setLogistics] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')

  useEffect(() => {
    async function fetchData() {
      if (!agentId) return
      
      try {
        const { data: agents } = await getAgents()
        const foundAgent = agents?.find(a => a.id === agentId)
        
        if (foundAgent) {
          setAgent(foundAgent)
          
          const logisticsData = await getAgentLogistics(agentId)
          setLogistics(logisticsData)
          
          const analyticsData = await getAgentAnalytics(agentId, timePeriod)
          setAnalytics(analyticsData)
        }
      } catch (error) {
        console.error("Error fetching agent data:", error)
        toast.error("Failed to load agent data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [agentId, timePeriod])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Agent not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{agent.name}</h1>
              <p className="text-sm text-muted-foreground">Delivery Agent Logistics Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Agent Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Agent Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{agent.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{agent.contact_phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pharmacies Assigned</p>
                  <p className="font-medium">{logistics?.stats?.pharmaciesCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="font-medium">{logistics?.stats?.totalDeliveries || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.totalDeliveries || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.deliveredOrders || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <p className="text-3xl font-bold">{(logistics?.stats?.packedOrders || 0) + (logistics?.stats?.outForDeliveryOrders || 0)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.pendingOrders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Performance Analytics</h2>
          <div className="flex gap-2">
            <Button
              variant={timePeriod === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('daily')}
            >
              Daily
            </Button>
            <Button
              variant={timePeriod === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={timePeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {analytics?.totalDeliveries || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total deliveries ({timePeriod})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {analytics?.completedDeliveries || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Successfully delivered ({timePeriod})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Pharmacies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Assigned Pharmacies
            </CardTitle>
            <CardDescription>Pharmacies this agent delivers to</CardDescription>
          </CardHeader>
          <CardContent>
            {logistics?.assignedPharmacies?.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pharmacies assigned yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logistics?.assignedPharmacies?.map((pharmacy: Pharmacy) => (
                  <div key={pharmacy.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{pharmacy.store_name}</p>
                    <p className="text-sm text-muted-foreground">{pharmacy.owner_name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Latest deliveries by this agent</CardDescription>
          </CardHeader>
          <CardContent>
            {logistics?.orders?.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No deliveries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logistics?.orders?.slice(0, 10).map((order: Order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">{order.pharmacy_name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'packed' ? 'outline' :
                        'destructive'
                      }
                      className={
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'packed' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
