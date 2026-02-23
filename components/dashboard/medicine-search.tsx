"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Package } from "lucide-react"
import type { Medicine, CartItem } from "@/lib/types"

interface MedicineSearchProps {
  cart: CartItem[]
  onAddToCart: (medicine: Medicine) => void
}

export function MedicineSearch({ cart, onAddToCart }: MedicineSearchProps) {
  const [query, setQuery] = useState("")
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const fetchMedicines = async () => {
      setLoading(true)
      try {
        const url = query ? `/api/medicines?q=${encodeURIComponent(query)}` : "/api/medicines"
        const res = await fetch(url, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setMedicines(data.medicines)
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Failed to fetch medicines")
        }
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(fetchMedicines, 300)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  const cartMedicineIds = new Set(cart.map((item) => item.medicineId))

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medicines by name, salt, brand, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse gap-0 py-0">
              <CardContent className="p-4">
                <div className="h-4 w-2/3 rounded-sm bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded-sm bg-muted" />
                <div className="mt-3 h-8 w-full rounded-sm bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : medicines.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
          <Package className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No medicines found</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {medicines.map((medicine) => {
            const inCart = cartMedicineIds.has(medicine.id)
            return (
              <Card key={medicine.id} className="gap-0 py-0">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{medicine.name}</p>
                      <p className="text-xs text-muted-foreground">{medicine.brand}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {medicine.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Salt: {medicine.saltName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">Rs.{medicine.mrp}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Stock: {medicine.stock > 0 ? medicine.stock : "Out of stock"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={inCart ? "secondary" : "default"}
                      disabled={medicine.stock === 0 || inCart}
                      onClick={() => onAddToCart(medicine)}
                    >
                      {inCart ? (
                        "In Cart"
                      ) : (
                        <>
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
