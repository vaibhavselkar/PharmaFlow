"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { PharmacyList } from "@/components/dashboard/pharmacy-list"
import { SubstituteSearch } from "@/components/dashboard/substitute-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, UserX, FlaskConical } from "lucide-react"

interface PharmacyData {
  pharmacyId: string
  storeName: string
  ownerName: string
  address: string
  city: string
  state: string
  contactPhone: string
  lastOrderDate: string | null
  totalOrders: number
  isActive: boolean
  assignedAt: string
}

interface Metrics {
  totalAssigned: number
  activeCount: number
  inactiveCount: number
}

export default function AgentDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [pharmacies, setPharmacies] = useState<PharmacyData[]>([])
  const [metrics, setMetrics] = useState<Metrics>({ totalAssigned: 0, activeCount: 0, inactiveCount: 0 })
  const [activeTab, setActiveTab] = useState("pharmacies")

  useEffect(() => {
    async function fetchData() {
      const [userRes, perfRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/agent/performance"),
      ])
      if (userRes.ok) {
        const data = await userRes.json()
        setUser(data.user)
      }
      if (perfRes.ok) {
        const data = await perfRes.json()
        setPharmacies(data.pharmacies)
        setMetrics(data.metrics)
      }
    }
    fetchData()
  }, [])

  const navItems = [
    { label: "My Pharmacies", icon: Users, isActive: activeTab === "pharmacies", onClick: () => setActiveTab("pharmacies") },
    { label: "Substitute Search", icon: FlaskConical, isActive: activeTab === "substitutes", onClick: () => setActiveTab("substitutes") },
  ]

  return (
    <DashboardShell
      title="Agent Dashboard"
      subtitle="Monitor pharmacies and find substitutes"
      userName={user?.name || "Loading..."}
      userRole="Field Agent"
      navItems={navItems}
      navLabel="Tools"
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Assigned" value={metrics.totalAssigned} icon={Users} />
          <StatCard title="Active (7 days)" value={metrics.activeCount} icon={UserCheck} />
          <StatCard title="Inactive" value={metrics.inactiveCount} icon={UserX} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pharmacies">Assigned Pharmacies</TabsTrigger>
            <TabsTrigger value="substitutes">Substitute Search</TabsTrigger>
          </TabsList>

          <TabsContent value="pharmacies">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Pharmacies</CardTitle>
                <CardDescription>
                  Monitor activity of your assigned pharmacies. Pharmacies that haven{"'"}t ordered in 7 days are marked inactive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PharmacyList pharmacies={pharmacies} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="substitutes">
            <Card>
              <CardHeader>
                <CardTitle>Salt-Based Substitute Search</CardTitle>
                <CardDescription>
                  Search for medicines by salt name to find alternative brands and formulations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubstituteSearch />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
