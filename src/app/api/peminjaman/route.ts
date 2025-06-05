// src/app/api/peminjaman/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.peminjamanBarang.findMany({
      include: {
        barang: true,
      },
      orderBy: {
        tanggalPengajuan: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal mengambil data peminjaman:", error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nama,
      jabatan,
      kelas,
      keperluan,
      barangId,
      jumlahBarang,
      tanggalPengajuan,
      tanggalPengembalian,
      userId, // ✅ pastikan frontend mengirimkan ini
    } = body;

    if (
      !nama ||
      !jabatan ||
      !keperluan ||
      barangId === undefined ||
      jumlahBarang === undefined ||
      !tanggalPengajuan ||
      !tanggalPengembalian ||
      userId === undefined // ✅ tambahkan validasi userId
    ) {
      return NextResponse.json(
        { message: "Field yang dibutuhkan tidak lengkap" },
        { status: 400 }
      );
    }

    const barang = await prisma.barang.findUnique({
      where: { id: Number(barangId) },
    });

    if (!barang) {
      return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
    }

    if (barang.stok < Number(jumlahBarang)) {
      return NextResponse.json({ message: "Stok tidak cukup" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.peminjamanBarang.create({
        data: {
          nama,
          jabatan,
          kelas,
          keperluan,
          barangId: Number(barangId),
          jumlahBarang: Number(jumlahBarang),
          tanggalPengajuan: new Date(tanggalPengajuan),
          tanggalPengembalian: new Date(tanggalPengembalian),
          userId: Number(userId), // ✅ ini baris yang paling penting
        },
      }),
      prisma.barang.update({
        where: { id: Number(barangId) },
        data: { stok: barang.stok - Number(jumlahBarang) },
      }),
    ]);

    return NextResponse.json({ message: "Peminjaman berhasil, stok dikurangi" });
  } catch (error) {
    console.error("Error di API peminjaman:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
