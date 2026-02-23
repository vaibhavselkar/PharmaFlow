"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const categories = ["Antibiotics", "Pain Relief", "Diabetes", "Cardiac", "Gastric", "Allergy", "Respiratory", "Other"]

interface AddMedicineDialogProps {
  onAdded: () => void
}

export function AddMedicineDialog({ onAdded }: AddMedicineDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    saltName: "",
    brand: "",
    mrp: "",
    stock: "",
    category: "",
    description: "",
  })

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.saltName || !form.brand || !form.mrp || !form.stock || !form.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          mrp: Number(form.mrp),
          stock: Number(form.stock),
        }),
      })

      if (res.ok) {
        toast.success("Medicine added successfully")
        setForm({ name: "", saltName: "", brand: "", mrp: "", stock: "", category: "", description: "" })
        setOpen(false)
        onAdded()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to add medicine")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>Add a new medicine to your inventory catalog.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-name">Medicine Name *</Label>
              <Input id="med-name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Amoxil 500" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-salt">Salt Name *</Label>
              <Input id="med-salt" value={form.saltName} onChange={(e) => updateField("saltName", e.target.value)} placeholder="e.g., Amoxicillin" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-brand">Brand *</Label>
              <Input id="med-brand" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="e.g., GSK" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-category">Category *</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger id="med-category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-mrp">MRP (Rs.) *</Label>
              <Input id="med-mrp" type="number" min={0} value={form.mrp} onChange={(e) => updateField("mrp", e.target.value)} placeholder="0.00" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="med-stock">Stock Quantity *</Label>
              <Input id="med-stock" type="number" min={0} value={form.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="med-desc">Description</Label>
            <Input id="med-desc" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Adding..." : "Add Medicine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
