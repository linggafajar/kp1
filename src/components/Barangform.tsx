"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Barang {
  id: number
  nama: string
  jenis: string
  stok: number
}

export default function BarangManager() {
  const [barang, setBarang] = useState<Barang[]>([])
  const [nama, setNama] = useState("")
  const [jenis, setJenis] = useState("Permintaan") // default pilihannya
  const [stok, setStok] = useState<number>(0)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchBarang()
  }, [])

  async function fetchBarang() {
    const res = await fetch("/api/barang")
    const data = await res.json()
    setBarang(data)
  }

  async function handleAddOrUpdate() {
    if (!nama.trim()) {
      alert("Nama barang harus diisi")
      return
    }
    if (stok < 0) {
      alert("Stok tidak boleh negatif")
      return
    }

    if (editingId !== null) {
      // Update barang
      await fetch(`/api/barang/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, jenis, stok }),
      })
    } else {
      // Tambah barang
      await fetch("/api/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, jenis, stok }),
      })
    }

    resetForm()
    fetchBarang()
  }

  function resetForm() {
    setNama("")
    setJenis("Permintaan")
    setStok(0)
    setEditingId(null)
  }

  function handleEdit(item: Barang) {
    setNama(item.nama)
    setJenis(item.jenis)
    setStok(item.stok)
    setEditingId(item.id)
  }

  async function handleDelete(id: number) {
    if (confirm("Yakin ingin menghapus barang ini?")) {
      await fetch(`/api/barang/${id}`, { method: "DELETE" })
      fetchBarang()
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Tambah / Edit */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Barang" : "Tambah Barang"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Nama Barang" value={nama} onChange={(e) => setNama(e.target.value)} />
          
          {/* Ganti Input jenis jadi select */}
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            <option value="Permintaan">Permintaan</option>
            <option value="Peminjaman">Peminjaman</option>
          </select>

          <Input
            type="number"
            placeholder="Stok"
            value={stok}
            onChange={(e) => setStok(Number(e.target.value))}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddOrUpdate}>
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Batal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daftar Barang */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barang.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.nama}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Jenis: {item.jenis}</p>
              <p>Stok: {item.stok}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Hapus</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
