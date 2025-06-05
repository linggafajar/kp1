// src/app/api/barang/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil semua data barang
export async function GET() {
  try {
    const barang = await prisma.barang.findMany();
    return NextResponse.json(barang);
  } catch (error) {
    console.error("Error fetching barang:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST: Tambah barang baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jenis, stok } = body;

    if (!nama || !jenis || stok == null) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const barangBaru = await prisma.barang.create({
      data: {
        nama,
        jenis,
        stok: Number(stok),
      },
    });

    return NextResponse.json(barangBaru, { status: 201 });
  } catch (error) {
    console.error("Error menambahkan barang:", error);
    return NextResponse.json({ error: "Gagal menambahkan barang" }, { status: 500 });
  }
}
