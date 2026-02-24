"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import type { Order, CartItem, Medicine } from "@/lib/types"

interface EditOrderDialogProps {
  order: Order
  onOrderUpdated: () => void
}

export function EditOrderDialog({ order, onOrderUpdated }: EditOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [instructions, setInstructions] = useState("")
  const [fetchingOrder, setFetchingOrder] = useState(false)

  // Fetch order details when dialog opens
  useEffect(() => {
    if (open && order) {
      fetchOrderDetails()
    }
  }, [open, order])

  async function fetchOrderDetails() {
    setFetchingOrder(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`)
      if (res.ok) {
        const data = await res.json()
        const orderData = data.order
        setInstructions(orderData.specialInstructions || "")
        setItems(orderData.items.map((item: any) => ({
          medicineId: item.medicine_id,
          medicine: {
            id: item.medicine_id,
            name: item.medicine_name,
            mrp: item.unit_price,
          } as Medicine,
          quantity: item.quantity,
        })))
      } else {
        toast.error("Failed to load order details")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Failed to load order details")
    } finally {
      setFetchingOrder(false)
    }
  }

  function updateQuantity(medicineId: string, quantity: number) {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      )
    )
  }

  function removeItem(medicineId: string) {
    setItems((prev) => prev.filter((item) => item.medicineId !== medicineId))
  }

  async function handleSaveOrder() {
    if (items.length === 0) {
      toast.error("Order must have at least one item")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            medicineId: item.medicineId,
            medicineName: item.medicine.name,
            quantity: item.quantity,
            unitPrice: item.medicine.mrp,
          })),
          specialInstructions: instructions || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to update order")
        return
      }

      toast.success("Order updated successfully!")
      setOpen(false)
      onOrderUpdated()
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelOrder() {
    if (!confirm("Are you sure you want to cancel this order?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to cancel order")
        return
      }

      toast.success("Order cancelled successfully!")
      setOpen(false)
      onOrderUpdated()
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.medicine.mrp * item.quantity,
    0
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Modify your order items or special instructions. Only pending orders can be edited.
          </DialogDescription>
        </DialogHeader>

        {fetchingOrder ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Order Items */}
            <div className="flex flex-col gap-2">
              <Label>Order Items</Label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                {items.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex items-center justify-between border-b border-border px-3 py-2 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.medicine.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rs.{item.medicine.mrp} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.medicineId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="h-8 w-16"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.medicineId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No items in order
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                Rs.{total.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Special Instructions */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Deliver before 10 AM, fragile items..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={loading || fetchingOrder}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Cancel Order
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={handleSaveOrder}
              disabled={loading || fetchingOrder || items.length === 0}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
