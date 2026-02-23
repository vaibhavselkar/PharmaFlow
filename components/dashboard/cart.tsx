"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (medicineId: string, quantity: number) => void
  onRemove: (medicineId: string) => void
}

export function Cart({ items, onUpdateQuantity, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.medicine.mrp * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">Your cart is empty. Browse medicines to add items.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.medicineId} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{item.medicine.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.medicine.brand} &middot; Rs.{item.medicine.mrp} each
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.medicineId, Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
              type="number"
              min={1}
              max={item.medicine.stock}
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                if (!isNaN(val) && val >= 1) {
                  onUpdateQuantity(item.medicineId, Math.min(val, item.medicine.stock))
                }
              }}
              className="h-7 w-14 text-center text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.medicineId, Math.min(item.medicine.stock, item.quantity + 1))}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <div className="w-20 text-right">
            <p className="text-sm font-medium text-foreground">
              Rs.{(item.medicine.mrp * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemove(item.medicineId)}>
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      <Separator />
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-muted-foreground">
          {items.length} item{items.length > 1 ? "s" : ""} in cart
        </span>
        <span className="text-lg font-bold text-foreground">
          Total: Rs.{total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  )
}
