import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { identifier, password } = body // Ubah dari email ➝ identifier

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email/Username atau password salah' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email/Username atau password salah' },
        { status: 401 }
      )
    }

    // Kirim data user tanpa password
    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 })
  }
}
