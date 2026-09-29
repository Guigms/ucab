import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Lista todos os produtos cadastrados
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(produtos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

// POST: Cadastra uma nova blusa
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, tamanho, cor, precoCusto, precoVenda, estoque } = body

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        tamanho,
        cor,
        precoCusto: parseFloat(precoCusto),
        precoVenda: parseFloat(precoVenda),
        estoque: parseInt(estoque),
      },
    })

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar produto' }, { status: 500 })
  }
}