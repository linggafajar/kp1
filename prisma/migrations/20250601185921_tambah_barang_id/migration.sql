/*
  Warnings:

  - You are about to drop the column `namaBarang` on the `PeminjamanBarang` table. All the data in the column will be lost.
  - Added the required column `barangId` to the `PeminjamanBarang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangId` to the `PermintaanBarang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PeminjamanBarang" DROP COLUMN "namaBarang",
ADD COLUMN     "barangId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PermintaanBarang" ADD COLUMN     "barangId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PeminjamanBarang" ADD CONSTRAINT "PeminjamanBarang_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanBarang" ADD CONSTRAINT "PermintaanBarang_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
