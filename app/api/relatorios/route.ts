import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany()
    const compras = await prisma.compra.findMany()
    const vendas = await prisma.venda.findMany({
      include: { itens: { include: { produto: true } } }
    })

    // 1. Métricas de Estoque
    const estoqueAtual = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0)
    const valorEstoque = produtos.reduce((acc, p) => acc + ((p.estoque || 0) * (p.precoCusto || 0)), 0)
    const skusCadastrados = produtos.length

    // 2. Agrupamento por Mês
    const mesesMap: { [key: string]: { custo: number; receita: number; lucro: number } } = {}

    compras.forEach(c => {
      const data = new Date(c.dataCompra || c.createdAt)
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (!mesesMap[mesAno]) mesesMap[mesAno] = { custo: 0, receita: 0, lucro: 0 }
      mesesMap[mesAno].custo += (c.total || 0)
    })

    vendas.forEach(v => {
      const data = new Date(v.dataVenda || v.createdAt)
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (!mesesMap[mesAno]) mesesMap[mesAno] = { custo: 0, receita: 0, lucro: 0 }
      
      const receitaVenda = v.valorTotal || 0
      mesesMap[mesAno].receita += receitaVenda

      // Calcula o lucro estimado da venda com base no custo dos itens vendidos
      let lucroVenda = 0
      v.itens?.forEach(i => {
        const custoUnit = i.produto?.precoCusto || 0
        const subtotalCusto = i.quantidade * custoUnit
        lucroVenda += i.subtotal - subtotalCusto
      })
      mesesMap[mesAno].lucro += lucroVenda
    })

    const evolucaoMensal = Object.keys(mesesMap).map(mes => ({
      mes,
      custo: mesesMap[mes].custo || 0,
      receita: mesesMap[mes].receita || 0,
      lucro: mesesMap[mes].lucro || 0,
    }))

    // 3. Mix de Pagamentos
    const pagamentosMap: { [key: string]: number } = {}
    let totalReceitaGeral = 0

    vendas.forEach(v => {
      const forma = v.formaPagto || 'Outro'
      const val = v.valorTotal || 0
      pagamentosMap[forma] = (pagamentosMap[forma] || 0) + val
      totalReceitaGeral += val
    })

    const mixPagamentos = Object.keys(pagamentosMap).map(forma => ({
      forma,
      total: pagamentosMap[forma],
      porcentagem: totalReceitaGeral > 0 ? (pagamentosMap[forma] / totalReceitaGeral) * 100 : 0,
    }))

    return NextResponse.json({
      resumo: {
        estoqueAtual,
        valorEstoque,
        skusCadastrados,
      },
      evolucaoMensal,
      mixPagamentos,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao gerar relatórios' }, { status: 500 })
  }
}