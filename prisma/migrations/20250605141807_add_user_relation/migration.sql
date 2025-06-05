/*
  Warnings:

  - Added the required column `userId` to the `PeminjamanBarang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PermintaanBarang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PeminjamanBarang" ADD COLUMN     "catatan" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PermintaanBarang" ADD COLUMN     "catatan" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PeminjamanBarang" ADD CONSTRAINT "PeminjamanBarang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanBarang" ADD CONSTRAINT "PermintaanBarang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
