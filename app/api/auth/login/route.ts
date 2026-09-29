import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@loja.com'
    const adminSenha = process.env.ADMIN_SENHA || '123'

    // Valida se o e-mail e a senha batem com o .env
    if (email !== adminEmail || senha !== adminSenha) {
      return NextResponse.json({ error: 'E-mail ou palavra-passe inválidos' }, { status: 401 })
    }

    // Define o cookie de sessão por 1 semana
    (await
          // Define o cookie de sessão por 1 semana
          cookies()).set('session_token', adminEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ message: 'Login realizado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
  }
}