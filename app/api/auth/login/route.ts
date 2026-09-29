import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.senha !== senha) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 })
    }

    // Define um cookie de autenticação simples
    (await
          // Define um cookie de autenticação simples
          cookies()).set('session_token', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    })

    return NextResponse.json({ message: 'Login realizado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
  }
}