'use client';

import { useEffect, useState } from 'react';

type PeminjamanBarang = {
  id: number;
  nama: string;
  jabatan: string;
  keperluan: string;
  kelas?: string;
  namaBarang: string;
  jumlahBarang: number;
  tanggalPengajuan: string;
  tanggalPengembalian: string;
  createdAt: string;
};

type PermintaanBarang = {
  id: number;
  nama: string;
  jabatan: string;
  kelas: string;
  keperluan: string;
  tanggal: string;
  jumlah: number;
  createdAt: string;
};

export default function DataBarangPage() {
  const [peminjaman, setPeminjaman] = useState<PeminjamanBarang[]>([]);
  const [permintaan, setPermintaan] = useState<PermintaanBarang[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPeminjaman = await fetch('/api/peminjaman');
        const resPermintaan = await fetch('/api/permintaan');

        const dataPeminjaman = await resPeminjaman.json();
        const dataPermintaan = await resPermintaan.json();

        setPeminjaman(dataPeminjaman);
        setPermintaan(dataPermintaan);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Bagian Peminjaman */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Data Peminjaman Barang</h2>
          <a
            href="/api/download/peminjaman"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Download Excel
          </a>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Jabatan</th>
              <th className="border px-2 py-1">Nama Barang</th>
              <th className="border px-2 py-1">Jumlah</th>
              <th className="border px-2 py-1">Tgl Pengajuan</th>
              <th className="border px-2 py-1">Tgl Pengembalian</th>
            </tr>
          </thead>
          <tbody>
            {peminjaman.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.nama}</td>
                <td className="border px-2 py-1">{item.jabatan}</td>
                <td className="border px-2 py-1">{item.namaBarang}</td>
                <td className="border px-2 py-1">{item.jumlahBarang}</td>
                <td className="border px-2 py-1">{new Date(item.tanggalPengajuan).toLocaleDateString()}</td>
                <td className="border px-2 py-1">{new Date(item.tanggalPengembalian).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bagian Permintaan */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Data Permintaan Barang</h2>
          <a
            href="/api/download/permintaan"
            className="bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Download Excel
          </a>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Jabatan</th>
              <th className="border px-2 py-1">Keperluan</th>
              <th className="border px-2 py-1">Jumlah</th>
              <th className="border px-2 py-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {permintaan.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.nama}</td>
                <td className="border px-2 py-1">{item.jabatan}</td>
                <td className="border px-2 py-1">{item.keperluan}</td>
                <td className="border px-2 py-1">{item.jumlah}</td>
                <td className="border px-2 py-1">{new Date(item.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
