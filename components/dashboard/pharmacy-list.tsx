"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Calendar, Package } from "lucide-react"

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

interface PharmacyListProps {
  pharmacies: PharmacyData[]
}

export function PharmacyList({ pharmacies }: PharmacyListProps) {
  if (pharmacies.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No pharmacies assigned</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pharmacies.map((pharmacy) => (
        <Card
          key={pharmacy.pharmacyId}
          className={`gap-0 py-0 transition-colors ${
            !pharmacy.isActive ? "border-destructive/30 bg-destructive/5" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{pharmacy.storeName}</h3>
                <p className="text-sm text-muted-foreground">{pharmacy.ownerName}</p>
              </div>
              <Badge
                variant={pharmacy.isActive ? "default" : "destructive"}
                className="shrink-0"
              >
                {pharmacy.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{pharmacy.address}, {pharmacy.city}, {pharmacy.state}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{pharmacy.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-3.5 w-3.5 shrink-0" />
                <span>{pharmacy.totalOrders} order{pharmacy.totalOrders !== 1 ? "s" : ""} total</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Last order:{" "}
                  {pharmacy.lastOrderDate
                    ? new Date(pharmacy.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Never"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
