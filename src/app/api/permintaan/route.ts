import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    // Contoh ambil userId dari token/session, sesuaikan implementasimu
    const userId = getUserIdFromRequest(req); // Buat fungsi ini sendiri sesuai autentikasi

    const body = await req.json();
    const { nama, jabatan, kelas, keperluan, barangId, jumlah, tanggal } = body;

    if (!userId) {
      return NextResponse.json({ message: "User tidak terautentikasi" }, { status: 401 });
    }

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
          userId: Number(userId),
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
