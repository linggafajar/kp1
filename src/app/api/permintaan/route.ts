// src/app/api/permintaan/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle GET - ambil semua data permintaan
export async function GET() {
  try {
    const data = await prisma.permintaanBarang.findMany({
      include: {
        barang: true, // jika ingin menampilkan info barang
      },
      orderBy: { tanggal: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal mengambil data permintaan:", error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

// Handle POST - buat permintaan baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nama,
      jabatan,
      kelas,
      keperluan,
      barangId,
      jumlah,
      tanggal,
    } = body;

    if (
      !nama ||
      !jabatan ||
      !keperluan ||
      barangId === undefined ||
      jumlah === undefined ||
      !tanggal
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

    if (barang.stok < Number(jumlah)) {
      return NextResponse.json({ message: "Stok tidak cukup" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.permintaanBarang.create({
        data: {
          nama,
          jabatan,
          kelas: kelas || "",
          keperluan,
          barangId: Number(barangId),
          jumlah: Number(jumlah),
          tanggal: new Date(tanggal),
        },
      }),
      prisma.barang.update({
        where: { id: Number(barangId) },
        data: { stok: barang.stok - Number(jumlah) },
      }),
    ]);

    return NextResponse.json({ message: "Permintaan berhasil, stok dikurangi" });
  } catch (error) {
    console.error("Error pada API permintaan:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
