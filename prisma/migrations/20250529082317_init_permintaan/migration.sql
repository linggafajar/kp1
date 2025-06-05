-- CreateTable
CREATE TABLE "PermintaanBarang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "keperluan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermintaanBarang_pkey" PRIMARY KEY ("id")
);
