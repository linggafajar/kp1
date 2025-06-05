import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { name, username, email, password, role } = body;

  const dataToUpdate: any = { name, username, email, role };

  if (password && password.trim().length > 0) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  const deleted = await prisma.user.delete({ where: { id } });
  return NextResponse.json(deleted);
}
