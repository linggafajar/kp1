import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.permintaanBarang.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Permintaan');

    // Header
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nama', key: 'nama', width: 25 },
      { header: 'Jabatan', key: 'jabatan', width: 20 },
      { header: 'Kelas', key: 'kelas', width: 15 },
      { header: 'Keperluan', key: 'keperluan', width: 25 },
      { header: 'Jumlah', key: 'jumlah', width: 10 },
      { header: 'Tanggal', key: 'tanggal', width: 20 },
    ];

    // Data
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=permintaan.xlsx',
      },
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Gagal export Excel' }, { status: 500 });
  }
}
