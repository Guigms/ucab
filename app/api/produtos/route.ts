import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, tamanho, cor, sku, precoCusto, precoVenda, estoque } = body

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        tamanho,
        cor,
        sku: sku || null,
        precoCusto: parseFloat(precoCusto) || 0,
        precoVenda: parseFloat(precoVenda) || 0,
        estoque: parseFloat(estoque) || 0,
      },
    })

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar produto' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    }

    await prisma.produto.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Produto excluído com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir produto' }, { status: 500 })
  }
}