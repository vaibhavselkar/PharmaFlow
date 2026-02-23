import { NextResponse } from "next/server"
import { getAuthFromCookie } from "@/lib/auth"
import { getUserById, searchMedicines, getMedicinesByDistributor, addMedicine, medicines } from "@/lib/data"

export async function GET(request: Request) {
  const auth = await getAuthFromCookie()
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (query) {
    const results = searchMedicines(query)
    return NextResponse.json({ medicines: results })
  }

  const user = getUserById(auth.userId)
  if (user?.role === "distributor" && user.distributorId) {
    const results = getMedicinesByDistributor(user.distributorId)
    return NextResponse.json({ medicines: results })
  }

  return NextResponse.json({ medicines })
}

export async function POST(request: Request) {
  const auth = await getAuthFromCookie()
  if (!auth || auth.role !== "distributor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const user = getUserById(auth.userId)
  if (!user?.distributorId) {
    return NextResponse.json({ error: "Distributor not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { name, saltName, brand, mrp, stock, category, description } = body

    if (!name || !saltName || !brand || !mrp || stock === undefined || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const medicine = addMedicine({
      distributorId: user.distributorId,
      name,
      saltName,
      brand,
      mrp: Number(mrp),
      stock: Number(stock),
      category,
      description: description || undefined,
    })

    return NextResponse.json({ medicine }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
