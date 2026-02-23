import type {
  User,
  Distributor,
  Pharmacy,
  Agent,
  AgentAssignment,
  Medicine,
  Order,
  OrderStatus,
} from "./types"

// --- Seed Data ---

export const users: User[] = [
  {
    id: "user-1",
    email: "pharmacy@demo.com",
    password: "password",
    name: "Rajesh Patel",
    role: "pharmacy_owner",
    pharmacyId: "pharmacy-1",
  },
  {
    id: "user-2",
    email: "distributor@demo.com",
    password: "password",
    name: "Anita Sharma",
    role: "distributor",
    distributorId: "dist-1",
  },
  {
    id: "user-3",
    email: "agent@demo.com",
    password: "password",
    name: "Vikram Singh",
    role: "agent",
    agentId: "agent-1",
  },
  {
    id: "user-4",
    email: "pharmacy2@demo.com",
    password: "password",
    name: "Meena Gupta",
    role: "pharmacy_owner",
    pharmacyId: "pharmacy-2",
  },
  {
    id: "user-5",
    email: "pharmacy3@demo.com",
    password: "password",
    name: "Suresh Kumar",
    role: "pharmacy_owner",
    pharmacyId: "pharmacy-3",
  },
]

export const distributors: Distributor[] = [
  {
    id: "dist-1",
    agencyName: "MedSupply Distributors",
    contactEmail: "distributor@demo.com",
    contactPhone: "+91-9876543210",
    address: "42 Industrial Area, Phase 2",
    city: "Mumbai",
    state: "Maharashtra",
  },
]

export const pharmacies: Pharmacy[] = [
  {
    id: "pharmacy-1",
    storeName: "HealthFirst Pharmacy",
    ownerName: "Rajesh Patel",
    contactPhone: "+91-9812345678",
    email: "pharmacy@demo.com",
    address: "12 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    licenseNumber: "MH-PH-2024-001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "pharmacy-2",
    storeName: "City Care Pharmacy",
    ownerName: "Meena Gupta",
    contactPhone: "+91-9823456789",
    email: "pharmacy2@demo.com",
    address: "88 Station Road",
    city: "Pune",
    state: "Maharashtra",
    licenseNumber: "MH-PH-2024-002",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "pharmacy-3",
    storeName: "Green Cross Pharmacy",
    ownerName: "Suresh Kumar",
    contactPhone: "+91-9834567890",
    email: "pharmacy3@demo.com",
    address: "5 Civil Lines",
    city: "Nagpur",
    state: "Maharashtra",
    licenseNumber: "MH-PH-2024-003",
    createdAt: "2024-06-10T10:00:00Z",
  },
]

export const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Vikram Singh",
    contactPhone: "+91-9845678901",
    email: "agent@demo.com",
    distributorId: "dist-1",
  },
]

export const agentAssignments: AgentAssignment[] = [
  {
    id: "assign-1",
    agentId: "agent-1",
    pharmacyId: "pharmacy-1",
    assignedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "assign-2",
    agentId: "agent-1",
    pharmacyId: "pharmacy-2",
    assignedAt: "2024-04-01T10:00:00Z",
  },
]

export const medicines: Medicine[] = [
  {
    id: "med-1",
    distributorId: "dist-1",
    name: "Amoxil 500",
    saltName: "Amoxicillin",
    brand: "GSK",
    mrp: 125.0,
    stock: 500,
    category: "Antibiotics",
    description: "Broad-spectrum antibiotic",
  },
  {
    id: "med-2",
    distributorId: "dist-1",
    name: "Crocin Advance",
    saltName: "Paracetamol",
    brand: "GSK",
    mrp: 32.0,
    stock: 1200,
    category: "Pain Relief",
    description: "Fever and pain relief",
  },
  {
    id: "med-3",
    distributorId: "dist-1",
    name: "Glycomet 500",
    saltName: "Metformin",
    brand: "USV",
    mrp: 45.0,
    stock: 800,
    category: "Diabetes",
    description: "Type 2 diabetes management",
  },
  {
    id: "med-4",
    distributorId: "dist-1",
    name: "Atorva 10",
    saltName: "Atorvastatin",
    brand: "Zydus",
    mrp: 98.0,
    stock: 350,
    category: "Cardiac",
    description: "Cholesterol management",
  },
  {
    id: "med-5",
    distributorId: "dist-1",
    name: "Omez 20",
    saltName: "Omeprazole",
    brand: "Dr. Reddy's",
    mrp: 65.0,
    stock: 900,
    category: "Gastric",
    description: "Acid reflux and ulcer treatment",
  },
  {
    id: "med-6",
    distributorId: "dist-1",
    name: "Ciplox 500",
    saltName: "Ciprofloxacin",
    brand: "Cipla",
    mrp: 78.0,
    stock: 420,
    category: "Antibiotics",
    description: "Fluoroquinolone antibiotic",
  },
  {
    id: "med-7",
    distributorId: "dist-1",
    name: "Brufen 400",
    saltName: "Ibuprofen",
    brand: "Abbott",
    mrp: 38.0,
    stock: 1500,
    category: "Pain Relief",
    description: "Anti-inflammatory pain relief",
  },
  {
    id: "med-8",
    distributorId: "dist-1",
    name: "Stamlo 5",
    saltName: "Amlodipine",
    brand: "Dr. Reddy's",
    mrp: 55.0,
    stock: 600,
    category: "Cardiac",
    description: "Blood pressure management",
  },
  {
    id: "med-9",
    distributorId: "dist-1",
    name: "Repace 50",
    saltName: "Losartan",
    brand: "Sun Pharma",
    mrp: 82.0,
    stock: 300,
    category: "Cardiac",
    description: "Hypertension treatment",
  },
  {
    id: "med-10",
    distributorId: "dist-1",
    name: "Alerid 10",
    saltName: "Cetirizine",
    brand: "Cipla",
    mrp: 28.0,
    stock: 2000,
    category: "Allergy",
    description: "Antihistamine for allergies",
  },
  {
    id: "med-11",
    distributorId: "dist-1",
    name: "Azithral 500",
    saltName: "Azithromycin",
    brand: "Alembic",
    mrp: 110.0,
    stock: 250,
    category: "Antibiotics",
    description: "Macrolide antibiotic",
  },
  {
    id: "med-12",
    distributorId: "dist-1",
    name: "Pan 40",
    saltName: "Pantoprazole",
    brand: "Alkem",
    mrp: 72.0,
    stock: 700,
    category: "Gastric",
    description: "Proton pump inhibitor",
  },
  {
    id: "med-13",
    distributorId: "dist-1",
    name: "Montair 10",
    saltName: "Montelukast",
    brand: "Cipla",
    mrp: 145.0,
    stock: 180,
    category: "Respiratory",
    description: "Asthma and allergy management",
  },
  {
    id: "med-14",
    distributorId: "dist-1",
    name: "Doxt-SL",
    saltName: "Doxycycline",
    brand: "Dr. Reddy's",
    mrp: 92.0,
    stock: 330,
    category: "Antibiotics",
    description: "Tetracycline antibiotic",
  },
  {
    id: "med-15",
    distributorId: "dist-1",
    name: "Zinetac 150",
    saltName: "Ranitidine",
    brand: "GSK",
    mrp: 25.0,
    stock: 400,
    category: "Gastric",
    description: "H2 receptor antagonist",
  },
  {
    id: "med-16",
    distributorId: "dist-1",
    name: "Mox 500",
    saltName: "Amoxicillin",
    brand: "Ranbaxy",
    mrp: 95.0,
    stock: 380,
    category: "Antibiotics",
    description: "Broad-spectrum antibiotic",
  },
  {
    id: "med-17",
    distributorId: "dist-1",
    name: "Dolo 650",
    saltName: "Paracetamol",
    brand: "Micro Labs",
    mrp: 30.0,
    stock: 2500,
    category: "Pain Relief",
    description: "Fever and pain relief",
  },
]

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString()

export const orders: Order[] = [
  {
    id: "order-1",
    pharmacyId: "pharmacy-1",
    pharmacyName: "HealthFirst Pharmacy",
    distributorId: "dist-1",
    status: "delivered",
    items: [
      { id: "oi-1", orderId: "order-1", medicineId: "med-1", medicineName: "Amoxil 500", quantity: 50, unitPrice: 125.0 },
      { id: "oi-2", orderId: "order-1", medicineId: "med-2", medicineName: "Crocin Advance", quantity: 100, unitPrice: 32.0 },
    ],
    totalAmount: 9450.0,
    specialInstructions: "Deliver before 10 AM",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
  },
  {
    id: "order-2",
    pharmacyId: "pharmacy-1",
    pharmacyName: "HealthFirst Pharmacy",
    distributorId: "dist-1",
    status: "out_for_delivery",
    items: [
      { id: "oi-3", orderId: "order-2", medicineId: "med-5", medicineName: "Omez 20", quantity: 30, unitPrice: 65.0 },
      { id: "oi-4", orderId: "order-2", medicineId: "med-10", medicineName: "Alerid 10", quantity: 80, unitPrice: 28.0 },
    ],
    totalAmount: 4190.0,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: "order-3",
    pharmacyId: "pharmacy-2",
    pharmacyName: "City Care Pharmacy",
    distributorId: "dist-1",
    status: "packed",
    items: [
      { id: "oi-5", orderId: "order-3", medicineId: "med-3", medicineName: "Glycomet 500", quantity: 40, unitPrice: 45.0 },
      { id: "oi-6", orderId: "order-3", medicineId: "med-8", medicineName: "Stamlo 5", quantity: 25, unitPrice: 55.0 },
      { id: "oi-7", orderId: "order-3", medicineId: "med-12", medicineName: "Pan 40", quantity: 60, unitPrice: 72.0 },
    ],
    totalAmount: 7495.0,
    specialInstructions: "Fragile items - handle with care",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "order-4",
    pharmacyId: "pharmacy-1",
    pharmacyName: "HealthFirst Pharmacy",
    distributorId: "dist-1",
    status: "pending",
    items: [
      { id: "oi-8", orderId: "order-4", medicineId: "med-11", medicineName: "Azithral 500", quantity: 20, unitPrice: 110.0 },
      { id: "oi-9", orderId: "order-4", medicineId: "med-7", medicineName: "Brufen 400", quantity: 50, unitPrice: 38.0 },
    ],
    totalAmount: 4100.0,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "order-5",
    pharmacyId: "pharmacy-3",
    pharmacyName: "Green Cross Pharmacy",
    distributorId: "dist-1",
    status: "pending",
    items: [
      { id: "oi-10", orderId: "order-5", medicineId: "med-4", medicineName: "Atorva 10", quantity: 30, unitPrice: 98.0 },
      { id: "oi-11", orderId: "order-5", medicineId: "med-9", medicineName: "Repace 50", quantity: 15, unitPrice: 82.0 },
      { id: "oi-12", orderId: "order-5", medicineId: "med-13", medicineName: "Montair 10", quantity: 10, unitPrice: 145.0 },
    ],
    totalAmount: 5620.0,
    specialInstructions: "Call before delivery",
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
]

// --- Helper functions ---

let orderCounter = orders.length

export function getOrdersByPharmacy(pharmacyId: string): Order[] {
  return orders.filter((o) => o.pharmacyId === pharmacyId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getOrdersByDistributor(distributorId: string): Order[] {
  return orders.filter((o) => o.distributorId === distributorId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getMedicinesByDistributor(distributorId: string): Medicine[] {
  return medicines.filter((m) => m.distributorId === distributorId)
}

export function searchMedicines(query: string, distributorId?: string): Medicine[] {
  const q = query.toLowerCase()
  return medicines.filter(
    (m) =>
      (m.name.toLowerCase().includes(q) ||
        m.saltName.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)) &&
      (!distributorId || m.distributorId === distributorId)
  )
}

export function searchBySalt(saltName: string): Medicine[] {
  const q = saltName.toLowerCase()
  return medicines.filter((m) => m.saltName.toLowerCase().includes(q))
}

export function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  orderCounter++
  const newOrder: Order = {
    ...order,
    id: `order-${orderCounter}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  orders.unshift(newOrder)
  // Reduce stock
  for (const item of newOrder.items) {
    const med = medicines.find((m) => m.id === item.medicineId)
    if (med) {
      med.stock = Math.max(0, med.stock - item.quantity)
    }
  }
  return newOrder
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const order = orders.find((o) => o.id === orderId)
  if (!order) return null
  order.status = status
  order.updatedAt = new Date().toISOString()
  return order
}

export function addMedicine(medicine: Omit<Medicine, "id">): Medicine {
  const newMed: Medicine = {
    ...medicine,
    id: `med-${medicines.length + 1}`,
  }
  medicines.push(newMed)
  return newMed
}

export function updateMedicine(id: string, updates: Partial<Medicine>): Medicine | null {
  const med = medicines.find((m) => m.id === id)
  if (!med) return null
  Object.assign(med, updates)
  return med
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email)
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function getPharmacyById(id: string): Pharmacy | undefined {
  return pharmacies.find((p) => p.id === id)
}

export function getDistributorById(id: string): Distributor | undefined {
  return distributors.find((d) => d.id === id)
}

export function getAgentAssignments(agentId: string): AgentAssignment[] {
  return agentAssignments.filter((a) => a.agentId === agentId)
}

export function getPharmacyLastOrder(pharmacyId: string): Order | undefined {
  const pOrders = getOrdersByPharmacy(pharmacyId)
  return pOrders.length > 0 ? pOrders[0] : undefined
}
