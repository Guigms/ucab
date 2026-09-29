import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vendas = await prisma.venda.findMany({
      include: { itens: { include: { produto: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(vendas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cliente, formaPagto, dataVenda, itens } = body

    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: 'Nenhum produto adicionado à venda' }, { status: 400 })
    }

    let valorTotalGeral = 0
    const itensProcessados: { produtoId: number; quantidade: number; valorUnit: number; subtotal: number }[] = []

    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: parseInt(item.produtoId) },
      })

      if (!produto) {
        return NextResponse.json({ error: `Produto ID ${item.produtoId} não encontrado` }, { status: 404 })
      }

      const qtd = parseFloat(item.quantidade)
      const valorUnit = produto.precoVenda
      const subtotal = qtd * valorUnit

      valorTotalGeral += subtotal
      itensProcessados.push({
        produtoId: produto.id,
        quantidade: qtd,
        valorUnit,
        subtotal,
      })
    }

    const novaVenda = await prisma.$transaction(async (tx) => {
      const venda = await tx.venda.create({
        data: {
          cliente: cliente || null,
          valorTotal: valorTotalGeral,
          formaPagto: formaPagto || 'PIX',
          dataVenda: dataVenda ? new Date(dataVenda) : new Date(),
          itens: {
            create: itensProcessados,
          },
        },
        include: { itens: true },
      })

      for (const item of itensProcessados) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        })
      }

      return venda
    })

    return NextResponse.json(novaVenda, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar venda' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID não informado' }, { status: 400 })

    const vendaId = parseInt(id)
    const venda = await prisma.venda.findUnique({
      where: { id: vendaId },
      include: { itens: true },
    })

    if (!venda) return NextResponse.json({ error: 'Venda não encontrada' }, { status: 404 })

    // Estorna o estoque de cada item da venda e exclui o registro
    await prisma.$transaction(async (tx) => {
      for (const item of venda.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              increment: item.quantidade,
            },
          },
        })
      }
      await tx.venda.delete({ where: { id: vendaId } })
    })

    return NextResponse.json({ message: 'Venda excluída e estoque estornado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir venda' }, { status: 500 })
  }
}