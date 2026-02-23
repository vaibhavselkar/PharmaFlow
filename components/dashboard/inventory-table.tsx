"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, X } from "lucide-react"
import type { Medicine } from "@/lib/types"

interface InventoryTableProps {
  medicines: Medicine[]
  onRefresh: () => void
}

export function InventoryTable({ medicines, onRefresh }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState("")
  const [editMrp, setEditMrp] = useState("")

  function startEdit(med: Medicine) {
    setEditingId(med.id)
    setEditStock(String(med.stock))
    setEditMrp(String(med.mrp))
  }

  async function saveEdit(id: string) {
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Number(editStock), mrp: Number(editMrp) }),
      })
      if (res.ok) {
        toast.success("Medicine updated")
        setEditingId(null)
        onRefresh()
      } else {
        toast.error("Update failed")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  if (medicines.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No medicines in inventory</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Salt Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">MRP</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((med) => (
          <TableRow key={med.id}>
            <TableCell className="font-medium">{med.name}</TableCell>
            <TableCell className="text-muted-foreground">{med.saltName}</TableCell>
            <TableCell>{med.brand}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">{med.category}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {editingId === med.id ? (
                <Input
                  type="number"
                  value={editMrp}
                  onChange={(e) => setEditMrp(e.target.value)}
                  className="ml-auto h-7 w-20 text-right text-sm"
                />
              ) : (
                `Rs.${med.mrp}`
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === med.id ? (
                <Input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="ml-auto h-7 w-20 text-right text-sm"
                />
              ) : (
                <span className={med.stock < 50 ? "font-medium text-destructive" : ""}>
                  {med.stock}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === med.id ? (
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEdit(med.id)}>
                    <Check className="h-3.5 w-3.5" />
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(med)}>
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
