"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { AddMedicineDialog } from "@/components/dashboard/add-medicine-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ClipboardList, Package, Boxes, TruckIcon, Search } from "lucide-react"
import type { Order, Medicine, OrderStatus } from "@/lib/types"

const statusFlow: OrderStatus[] = ["pending", "packed", "out_for_delivery", "delivered"]

export default function DistributorDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [activeTab, setActiveTab] = useState("orders")
  const [inventorySearch, setInventorySearch] = useState("")

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

  const fetchMedicines = useCallback(async () => {
    try {
      const res = await fetch("/api/medicines")
      if (res.ok) {
        const data = await res.json()
        setMedicines(data.medicines)
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    }
    fetchUser()
    fetchOrders()
    fetchMedicines()
  }, [fetchOrders, fetchMedicines])

  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
    )

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast.success(`Order updated to ${newStatus.replace(/_/g, " ")}`)
      } else {
        toast.error("Failed to update order status")
        fetchOrders() // Rollback
      }
    } catch {
      toast.error("Something went wrong")
      fetchOrders()
    }
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const packedOrders = orders.filter((o) => o.status === "packed").length
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length

  const filteredMedicines = inventorySearch
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
          m.saltName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
          m.brand.toLowerCase().includes(inventorySearch.toLowerCase())
      )
    : medicines

  const navItems = [
    { label: "Orders", icon: ClipboardList, isActive: activeTab === "orders", onClick: () => setActiveTab("orders") },
    { label: "Inventory", icon: Boxes, isActive: activeTab === "inventory", onClick: () => setActiveTab("inventory") },
  ]

  return (
    <DashboardShell
      title="Distributor Dashboard"
      subtitle="Manage orders and inventory"
      userName={user?.name || "Loading..."}
      userRole="Distributor"
      navItems={navItems}
      navLabel="Management"
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Orders" value={totalOrders} icon={Package} />
          <StatCard title="Pending" value={pendingOrders} icon={ClipboardList} />
          <StatCard title="Packed" value={packedOrders} icon={Boxes} />
          <StatCard title="Delivered" value={deliveredOrders} icon={TruckIcon} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory ({medicines.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Pharmacy</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">{order.id}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </TableCell>
                          <TableCell className="font-medium">{order.pharmacyName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              {order.items.slice(0, 2).map((item) => (
                                <span key={item.id} className="text-sm">
                                  {item.medicineName} x{item.quantity}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{order.items.length - 2} more</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            Rs.{order.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            {order.status === "delivered" ? (
                              <span className="text-xs text-muted-foreground">Completed</span>
                            ) : (
                              <Select
                                value={order.status}
                                onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                              >
                                <SelectTrigger size="sm" className="h-8 w-[160px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusFlow.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Medicine Inventory</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search inventory..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="pl-9 sm:w-64"
                      />
                    </div>
                    <AddMedicineDialog onAdded={fetchMedicines} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InventoryTable medicines={filteredMedicines} onRefresh={fetchMedicines} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
