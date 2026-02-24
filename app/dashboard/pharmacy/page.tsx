"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { OrderTable } from "@/components/dashboard/order-table"
import { MedicineSearch } from "@/components/dashboard/medicine-search"
import { Cart } from "@/components/dashboard/cart"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, ShoppingCart, Package, ClipboardList, IndianRupee } from "lucide-react"
import type { Order, CartItem, Medicine } from "@/lib/types"
import { getPharmacyByEmail } from "@/lib/supabase"

export default function PharmacyDashboard() {
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null)
  const [storeName, setStoreName] = useState<string>("")
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState("browse")

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
      }
    } catch {
      // silently fail for polling
    }
  }, [])

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        
        // Fetch pharmacy details from Supabase to get store name
        if (data.user.email) {
          const { data: pharmacyData } = await getPharmacyByEmail(data.user.email)
          if (pharmacyData) {
            setStoreName(pharmacyData.store_name)
          }
        }
      }
    }
    fetchUser()
    fetchOrders()
  }, [fetchOrders])

  // Poll orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  function addToCart(medicine: Medicine) {
    if (cart.find((item) => item.medicineId === medicine.id)) {
      toast.info("Already in cart")
      return
    }
    setCart((prev) => [...prev, { medicineId: medicine.id, medicine, quantity: 1 }])
    toast.success(`${medicine.name} added to cart`)
  }

  function updateCartQuantity(medicineId: string, quantity: number) {
    setCart((prev) => prev.map((item) => (item.medicineId === medicineId ? { ...item, quantity } : item)))
  }

  function removeFromCart(medicineId: string) {
    setCart((prev) => prev.filter((item) => item.medicineId !== medicineId))
  }

  function handleOrderPlaced() {
    setCart([])
    setActiveTab("orders")
    fetchOrders()
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length
  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const navItems = [
    { label: "Browse Medicines", icon: Pill, isActive: activeTab === "browse", onClick: () => setActiveTab("browse") },
    {
      label: "Cart",
      icon: ShoppingCart,
      isActive: activeTab === "cart",
      onClick: () => setActiveTab("cart"),
    },
    { label: "My Orders", icon: ClipboardList, isActive: activeTab === "orders", onClick: () => setActiveTab("orders") },
  ]

  return (
    <DashboardShell
      title="Pharmacy Dashboard"
      subtitle="Browse medicines, manage orders"
      userName={storeName || user?.name || "Loading..."}
      userRole="Pharmacy Owner"
      navItems={navItems}
      navLabel="Navigation"
    >
      <div className="flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Orders" value={totalOrders} icon={Package} />
          <StatCard title="Pending" value={pendingOrders} icon={ClipboardList} />
          <StatCard title="Delivered" value={deliveredOrders} icon={Package} />
          <StatCard title="Total Spend" value={`Rs.${totalSpend.toLocaleString("en-IN")}`} icon={IndianRupee} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="browse">Browse Medicines</TabsTrigger>
              <TabsTrigger value="cart">
                Cart {cart.length > 0 && `(${cart.length})`}
              </TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>
            {activeTab === "cart" && (
              <CheckoutDialog cart={cart} onOrderPlaced={handleOrderPlaced} />
            )}
          </div>

          <TabsContent value="browse">
            <MedicineSearch cart={cart} onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="cart">
            <Cart items={cart} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTable orders={orders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
