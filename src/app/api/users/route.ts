import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, username: true, email: true, role: true } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, username, email, password, role } = body;

  if (!password) {
    return NextResponse.json({ error: 'Password harus diisi' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, email, password: hashedPassword, role },
  });

  return NextResponse.json(user);
}
