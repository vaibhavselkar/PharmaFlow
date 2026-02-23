export type UserRole = "pharmacy_owner" | "distributor" | "agent"

export type OrderStatus = "pending" | "packed" | "out_for_delivery" | "delivered"

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  distributorId?: string
  pharmacyId?: string
  agentId?: string
}

export interface Distributor {
  id: string
  agencyName: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  state: string
}

export interface Pharmacy {
  id: string
  storeName: string
  ownerName: string
  contactPhone: string
  email: string
  address: string
  city: string
  state: string
  licenseNumber: string
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  contactPhone: string
  email: string
  distributorId: string
}

export interface AgentAssignment {
  id: string
  agentId: string
  pharmacyId: string
  assignedAt: string
}

export interface Medicine {
  id: string
  distributorId: string
  name: string
  saltName: string
  brand: string
  mrp: number
  stock: number
  category: string
  description?: string
}

export interface OrderItem {
  id: string
  orderId: string
  medicineId: string
  medicineName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  pharmacyId: string
  pharmacyName: string
  distributorId: string
  status: OrderStatus
  specialInstructions?: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  medicineId: string
  medicine: Medicine
  quantity: number
}

export interface AuthPayload {
  userId: string
  role: UserRole
  email: string
  name: string
}
