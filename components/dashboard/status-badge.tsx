import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
  packed: {
    label: "Packed",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  },
}

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className, className)}>
      {config.label}
    </Badge>
  )
}
