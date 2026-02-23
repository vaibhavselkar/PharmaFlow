"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface CheckoutDialogProps {
  cart: CartItem[]
  onOrderPlaced: () => void
  disabled?: boolean
}

export function CheckoutDialog({ cart, onOrderPlaced, disabled }: CheckoutDialogProps) {
  const [open, setOpen] = useState(false)
  const [instructions, setInstructions] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.medicine.mrp * item.quantity, 0)

  async function handlePlaceOrder() {
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            medicineId: item.medicineId,
            medicineName: item.medicine.name,
            quantity: item.quantity,
            unitPrice: item.medicine.mrp,
          })),
          specialInstructions: instructions || undefined,
          distributorId: "dist-1",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to place order")
        return
      }

      toast.success("Order placed successfully!")
      setInstructions("")
      setOpen(false)
      onOrderPlaced()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled || cart.length === 0} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Place Order ({cart.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription>
            Review your order before placing it. You are ordering {cart.length} item{cart.length > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
            {cart.map((item) => (
              <div key={item.medicineId} className="flex items-center justify-between border-b border-border px-3 py-2 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.medicine.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  Rs.{(item.medicine.mrp * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
            <span className="font-medium text-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">Rs.{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="instructions">Special Instructions (optional)</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Deliver before 10 AM, fragile items..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder} disabled={submitting}>
            {submitting ? "Placing Order..." : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
