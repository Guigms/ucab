import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const compras = await prisma.compra.findMany({
      include: { produto: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(compras)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar compras' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { produtoId, quantidade, custoUnit, fornecedor, dataCompra } = body

    const qtd = parseFloat(quantidade)
    const custo = parseFloat(custoUnit)
    const totalCompra = qtd * custo

    // Registra a compra e atualiza o estoque do produto em uma transação
    const novaCompra = await prisma.$transaction(async (tx) => {
      const compra = await tx.compra.create({
        data: {
          produtoId: parseInt(produtoId),
          quantidade: qtd,
          custoUnit: custo,
          total: totalCompra,
          fornecedor: fornecedor || null,
          dataCompra: dataCompra ? new Date(dataCompra) : new Date(),
        },
      })

      // Atualiza o estoque atual do produto somando a entrada
      await tx.produto.update({
        where: { id: parseInt(produtoId) },
        data: {
          estoque: {
            increment: qtd,
          },
          precoCusto: custo, // Atualiza para o custo mais recente, se desejar
        },
      })

      return compra
    })

    return NextResponse.json(novaCompra, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar compra' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID não informado' }, { status: 400 })

    const compraId = parseInt(id)
    const compra = await prisma.compra.findUnique({ where: { id: compraId } })

    if (!compra) return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 })

    // Estorna o estoque ao excluir a compra
    await prisma.$transaction(async (tx) => {
      await tx.produto.update({
        where: { id: compra.produtoId },
        data: {
          estoque: {
            decrement: compra.quantidade,
          },
        },
      })
      await tx.compra.delete({ where: { id: compraId } })
    })

    return NextResponse.json({ message: 'Compra excluída e estoque estornado' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir compra' }, { status: 500 })
  }
}