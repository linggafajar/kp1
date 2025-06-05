-- CreateTable
CREATE TABLE "PeminjamanBarang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "keperluan" TEXT NOT NULL,
    "kelas" TEXT,
    "namaBarang" TEXT NOT NULL,
    "jumlahBarang" INTEGER NOT NULL,
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL,
    "tanggalPengembalian" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeminjamanBarang_pkey" PRIMARY KEY ("id")
);
