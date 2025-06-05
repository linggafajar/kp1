"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function PeminjamanForm() {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [kelas, setKelas] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [jumlah, setJumlah] = useState<number | "">(0);
  const [tglPinjam, setTglPinjam] = useState<Date | undefined>(undefined);
  const [tglKembali, setTglKembali] = useState<Date | undefined>(undefined);

  // List barang dari API
  const [listBarang, setListBarang] = useState<{ id: number; nama: string; stok: number }[]>([]);
  const [selectedBarangId, setSelectedBarangId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBarang() {
      try {
        const res = await fetch("/api/barang");
        const data = await res.json();
        setListBarang(data);
        if (data.length > 0) setSelectedBarangId(data[0].id);
      } catch (error) {
        console.error("Gagal load barang:", error);
      }
    }
    fetchBarang();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!nama.trim()) return alert("Nama wajib diisi");
    if (!jabatan) return alert("Jabatan wajib dipilih");
    if (!keperluan.trim()) return alert("Keperluan wajib diisi");
    if (!selectedBarangId) return alert("Pilih barang terlebih dahulu");
    if (jumlah === "" || jumlah <= 0) return alert("Jumlah harus lebih dari 0");
    if (!tglPinjam) return alert("Tanggal peminjaman wajib dipilih");
    if (!tglKembali) return alert("Tanggal pengembalian wajib dipilih");
    if (tglKembali < tglPinjam) return alert("Tanggal pengembalian tidak boleh sebelum tanggal peminjaman");

    const data = {
      nama: nama.trim(),
      jabatan,
      kelas: kelas.trim(),
      keperluan: keperluan.trim(),
      barangId: selectedBarangId,
      jumlahBarang: Number(jumlah),
      tanggalPengajuan: format(tglPinjam, "yyyy-MM-dd"),
      tanggalPengembalian: format(tglKembali, "yyyy-MM-dd"),
    };

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Peminjaman berhasil");
        // Reset form
        setNama("");
        setJabatan("");
        setKelas("");
        setKeperluan("");
        setJumlah(0);
        setTglPinjam(undefined);
        setTglKembali(undefined);

        // Reload list barang (stok terbaru)
        const resBarang = await fetch("/api/barang");
        const updatedBarang = await resBarang.json();
        setListBarang(updatedBarang);
        if (updatedBarang.length > 0) setSelectedBarangId(updatedBarang[0].id);
      } else {
        const errorData = await res.json();
        alert("Gagal menyimpan: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan saat submit data");
    }
  };

  return (
    <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
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

      <div>
        <Label htmlFor="jabatan">Jabatan</Label>
        <select
          id="jabatan"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          required
          className="w-full border border-input rounded-md px-3 py-2"
        >
          <option value="">Pilih jabatan</option>
          <option value="Guru">Guru</option>
          <option value="Staf">Staf</option>
          <option value="Siswa">Siswa</option>
        </select>
      </div>

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

      <div>
        <Label htmlFor="namaBarang">Nama Barang</Label>
        <select
          id="namaBarang"
          value={selectedBarangId ?? ""}
          onChange={(e) => setSelectedBarangId(Number(e.target.value))}
          required
          className="w-full border border-input rounded-md px-3 py-2"
        >
          <option value="" disabled>
            Pilih barang
          </option>
          {listBarang.map((barang) => (
            <option key={barang.id} value={barang.id}>
              {barang.nama} (Stok: {barang.stok})
            </option>
          ))}
        </select>
      </div>

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

      <div>
        <Label htmlFor="jumlah">Jumlah</Label>
        <Input
          id="jumlah"
          type="number"
          placeholder="Masukkan jumlah"
          value={jumlah}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setJumlah("");
            else setJumlah(Number(val));
          }}
          min={1}
          required
        />
      </div>

      <div>
        <Label htmlFor="tglPinjam">Tanggal Peminjaman</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="tglPinjam"
              variant="outline"
              className="w-full justify-start text-left"
            >
              {tglPinjam ? format(tglPinjam, "dd MMM yyyy") : "Pilih tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={tglPinjam}
              onSelect={setTglPinjam}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="tglKembali">Tanggal Pengembalian</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="tglKembali"
              variant="outline"
              className="w-full justify-start text-left"
            >
              {tglKembali ? format(tglKembali, "dd MMM yyyy") : "Pilih tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={tglKembali}
              onSelect={setTglKembali}
              disabled={(date) => (tglPinjam ? date < tglPinjam : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
