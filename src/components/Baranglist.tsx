"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Barang {
  id: number
  nama: string
  jenis: string
  stok: number
}

export default function BarangList() {
  const [barang, setBarang] = useState<Barang[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  async function fetchBarang() {
    try {
      const res = await fetch("/api/barang")
      if (!res.ok) throw new Error("Gagal mengambil data")
      const data = await res.json()
      setBarang(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }
  fetchBarang()
}, [])


  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {barang.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.nama}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Jenis:</span> {item.jenis}</p>
            <p><span className="font-semibold">Stok:</span> {item.stok}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
