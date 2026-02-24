"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Warehouse, Truck, Store, Package, ShoppingCart, IndianRupee, CheckCircle, Clock, ArrowLeft, Loader2, Calendar, MapPin, Phone, Mail } from "lucide-react"
import { getDistributors, getDistributorLogistics, getDistributorAnalytics } from "@/lib/supabase"

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

interface Order {
  id: string
  pharmacy_name: string
  status: string
  total_amount: number
  created_at: string
}

export default function DistributorLogisticsPage() {
  const router = useRouter()
  const params = useParams()
  const distributorId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [distributor, setDistributor] = useState<Distributor | null>(null)
  const [logistics, setLogistics] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')

  useEffect(() => {
    async function fetchData() {
      if (!distributorId) return
      
      try {
        const { data: distributors } = await getDistributors()
        const foundDistributor = distributors?.find(d => d.id === distributorId)
        
        if (foundDistributor) {
          setDistributor(foundDistributor)
          
          const logisticsData = await getDistributorLogistics(distributorId)
          setLogistics(logisticsData)
          
          const analyticsData = await getDistributorAnalytics(distributorId, timePeriod)
          setAnalytics(analyticsData)
        }
      } catch (error) {
        console.error("Error fetching distributor data:", error)
        toast.error("Failed to load distributor data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [distributorId, timePeriod])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!distributor) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Distributor not found</p>
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
              <h1 className="text-2xl font-bold text-foreground">{distributor.agency_name}</h1>
              <p className="text-sm text-muted-foreground">Distributor Logistics Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Distributor Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Distributor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{distributor.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{distributor.contact_phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{distributor.city}, {distributor.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Medicines</p>
                  <p className="font-medium">{logistics?.stats?.totalMedicines || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.totalOrders || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <p className="text-3xl font-bold">₹{(logistics?.stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pharmacies Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.pharmaciesServed || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-3xl font-bold">{logistics?.stats?.deliveredOrders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-bold">{logistics?.stats?.pendingOrders || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Packed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <p className="text-2xl font-bold">{logistics?.stats?.packedOrders || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Out for Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold">{logistics?.stats?.outForDeliveryOrders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Analytics</h2>
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
              <CardTitle>Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                ₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total revenue generated ({timePeriod})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {analytics?.totalOrders || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total orders processed ({timePeriod})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from this distributor</CardDescription>
          </CardHeader>
          <CardContent>
            {logistics?.orders?.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
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
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          ₹{Number(order.total_amount).toLocaleString('en-IN')}
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
