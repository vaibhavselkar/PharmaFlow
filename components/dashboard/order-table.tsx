"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import type { Order } from "@/lib/types"

interface OrderTableProps {
  orders: Order[]
  showPharmacy?: boolean
  renderActions?: (order: Order) => React.ReactNode
}

export function OrderTable({ orders, showPharmacy = false, renderActions }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          {showPharmacy && <TableHead>Pharmacy</TableHead>}
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          {renderActions && <TableHead className="text-right">Actions</TableHead>}
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
                year: "numeric",
              })}
            </TableCell>
            {showPharmacy && <TableCell className="font-medium">{order.pharmacyName}</TableCell>}
            <TableCell>
              <div className="flex flex-col gap-0.5">
                {order.items.slice(0, 2).map((item) => (
                  <span key={item.id} className="text-sm">
                    {item.medicineName} x{item.quantity}
                  </span>
                ))}
                {order.items.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{order.items.length - 2} more
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {"Rs."}{order.totalAmount.toLocaleString("en-IN")}
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            {renderActions && <TableCell className="text-right">{renderActions(order)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
