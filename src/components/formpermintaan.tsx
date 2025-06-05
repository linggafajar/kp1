"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export default function PermintaanBarangForm() {
  const [nama, setNama] = useState("")
  const [jabatan, setJabatan] = useState("")
  const [kelas, setKelas] = useState("")
  const [keperluan, setKeperluan] = useState("")
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date())
  const [jumlah, setJumlah] = useState<number | "">(0)

  const [listBarang, setListBarang] = useState<{ id: number; nama: string; stok: number }[]>([])
  const [selectedBarangId, setSelectedBarangId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchBarang() {
      try {
        const res = await fetch("/api/barang")
        const data = await res.json()
        setListBarang(data)
        if (data.length > 0) setSelectedBarangId(data[0].id)
      } catch (error) {
        console.error("Gagal ambil data barang:", error)
      }
    }
    fetchBarang()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBarangId) {
      alert("Pilih barang terlebih dahulu")
      return
    }

    if (jumlah === "" || jumlah <= 0) {
      alert("Jumlah harus lebih dari 0")
      return
    }

    const data = {
      nama,
      jabatan,
      kelas,
      keperluan,
      tanggal: tanggal ? format(tanggal, "yyyy-MM-dd") : null,
      jumlah,
      barangId: selectedBarangId,
    }

    try {
      const res = await fetch("/api/permintaan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Gagal mengirim permintaan")

      const result = await someFunction();
      console.log(result); // atau gunakan untuk logika lain


      // Reset form
      setNama("")
      setJabatan("")
      setKelas("")
      setKeperluan("")
      setTanggal(undefined)
      setJumlah(0)
      setSelectedBarangId(listBarang.length > 0 ? listBarang[0].id : null)
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat submit")
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Nama */}
      <div>
        <Label htmlFor="nama">Nama</Label>
        <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>

      {/* Jabatan */}
      <div>
        <Label htmlFor="jabatan">Jabatan</Label>
        <select
          id="jabatan"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          required
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="" disabled>
            Pilih jabatan
          </option>
          <option value="Guru">Guru</option>
          <option value="Staf">Staf</option>
          <option value="Siswa">Siswa</option>
        </select>
      </div>

      {/* Kelas */}
      <div>
        <Label htmlFor="kelas">Kelas</Label>
        <Input
          id="kelas"
          type="text"
          placeholder="Masukkan kelas"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
        />
      </div>

      {/* Barang */}
      <div>
        <Label htmlFor="barang">Barang</Label>
        <select
          id="barang"
          value={selectedBarangId ?? ""}
          onChange={(e) => setSelectedBarangId(Number(e.target.value))}
          required
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {listBarang.length === 0 && <option value="">Tidak ada barang</option>}
          {listBarang.map((barang) => (
            <option key={barang.id} value={barang.id}>
              {barang.nama} (Stok: {barang.stok})
            </option>
          ))}
        </select>
      </div>

      {/* Keperluan */}
      <div>
        <Label htmlFor="keperluan">Keperluan</Label>
        <Textarea
          id="keperluan"
          placeholder="Tuliskan keperluan"
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          required
          rows={3}
        />
      </div>

      {/* Tanggal */}
      <div>
        <Label htmlFor="tanggal">Tanggal</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="tanggal"
              variant="outline"
              className="w-full justify-start text-left"
            >
              {tanggal ? format(tanggal, "dd MMM yyyy") : "Pilih tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={tanggal}
              onSelect={setTanggal}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Jumlah */}
      <div>
        <Label htmlFor="jumlah">Jumlah</Label>
        <Input
          id="jumlah"
          type="number"
          placeholder="Masukkan jumlah"
          value={jumlah}
          onChange={(e) => {
            const val = e.target.value
            if (val === "") setJumlah("")
            else setJumlah(Number(val))
          }}
          min={1}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
