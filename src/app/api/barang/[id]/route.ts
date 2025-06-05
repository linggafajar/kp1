import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const barang = await prisma.barang.findUnique({
      where: { id },
    });

    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(barang);
  } catch (error) {
    console.error("Error get barang:", error);
    return NextResponse.json({ error: "Gagal mengambil barang" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { nama, jenis, stok } = body;

    if (!nama || !jenis || stok == null) {
      return NextResponse.json({ error: "Field harus lengkap" }, { status: 400 });
    }

    const barangUpdate = await prisma.barang.update({
      where: { id },
      data: {
        nama,
        jenis,
        stok: Number(stok),
      },
    });

    return NextResponse.json(barangUpdate);
  } catch (error) {
    console.error("Error update barang:", error);
    return NextResponse.json({ error: "Gagal update barang" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Hapus relasi di peminjamanBarang
    await prisma.peminjamanBarang.deleteMany({
      where: { barangId: id },
    });

    // Hapus relasi di permintaanBarang
    await prisma.permintaanBarang.deleteMany({
      where: { barangId: id },
    });

    // Baru hapus barang
    await prisma.barang.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus barang:", error);
    return NextResponse.json({ error: "Gagal hapus barang" }, { status: 500 });
  }
}
