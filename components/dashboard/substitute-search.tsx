"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FlaskConical } from "lucide-react"
import type { Medicine } from "@/lib/types"

export function SubstituteSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    const controller = new AbortController()
    const fetchSubstitutes = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/agent/substitutes?salt=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setResults(data.medicines)
          setSearched(true)
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Search failed")
        }
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(fetchSubstitutes, 400)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by salt name (e.g., Paracetamol, Amoxicillin)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Searching...</p>
        </div>
      ) : searched && results.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
          <FlaskConical className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No medicines found with salt name "{query}"</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Found {results.length} medicine{results.length > 1 ? "s" : ""} with matching salt name
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Salt Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">MRP</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell className="text-muted-foreground">{med.saltName}</TableCell>
                  <TableCell>{med.brand}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{med.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">Rs.{med.mrp}</TableCell>
                  <TableCell className="text-right">
                    <span className={med.stock < 50 ? "font-medium text-destructive" : ""}>
                      {med.stock}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
          <FlaskConical className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Enter a salt name to search for substitute medicines</p>
        </div>
      )}
    </div>
  )
}
