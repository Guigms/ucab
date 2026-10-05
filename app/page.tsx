import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // 1. Verificação de Autenticação (Bloqueia quem não tem login)
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) {
    redirect('/login')
  }

  // 2. Carregamento dos dados do Dashboard
  let totalProdutos = 0
  let totalCompras = 0
  let totalVendas = 0
  let valorEstoque = 0
  let estoqueTotalPecas = 0
  let erroBanco = false

  try {
    totalProdutos = await prisma.produto.count()
    totalCompras = await prisma.compra.count()
    totalVendas = await prisma.venda.count()

    const produtos = await prisma.produto.findMany()
    valorEstoque = produtos.reduce((acc, p) => acc + ((p.estoque || 0) * (p.precoCusto || 0)), 0)
    estoqueTotalPecas = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0)
  } catch (error) {
    erroBanco = true
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visão Geral</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Métricas em tempo real do seu atelier e boutique.</p>
      </div>

      {erroBanco && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-6 text-xs font-semibold">
          ⚠️ Aviso: O sistema está a correr mas encontrou dificuldades para ler o banco de dados remoto. Verifique a conexão.
        </div>
      )}

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total de Produtos (SKUs)</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">{totalProdutos}</h3>
          <p className="text-xs text-gray-400 mt-1">cadastrados no sistema</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Peças em Estoque</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            {estoqueTotalPecas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-gray-400 mt-1">unidades disponíveis</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Valor em Estoque</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            R$ {valorEstoque.toFixed(2).replace('.', ',')}
          </h3>
          <p className="text-xs text-gray-400 mt-1">baseado no custo médio</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total de Vendas</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">{totalVendas}</h3>
          <p className="text-xs text-gray-400 mt-1">pedidos registados</p>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-base font-bold text-gray-900 mb-4">Ações Rápidas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/produtos" className="p-4 rounded-xl border border-gray-100 hover:border-stone-300 transition-all bg-gray-50/50 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">📦</span>
            <span className="text-xs font-bold text-gray-800">Gerir Produtos</span>
          </Link>
          <Link href="/compras" className="p-4 rounded-xl border border-gray-100 hover:border-stone-300 transition-all bg-gray-50/50 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">🛍️</span>
            <span className="text-xs font-bold text-gray-800">Registar Compra</span>
          </Link>
          <Link href="/vendas" className="p-4 rounded-xl border border-gray-100 hover:border-stone-300 transition-all bg-gray-50/50 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">💳</span>
            <span className="text-xs font-bold text-gray-800">Nova Venda</span>
          </Link>
          <Link href="/relatorios" className="p-4 rounded-xl border border-gray-100 hover:border-stone-300 transition-all bg-gray-50/50 flex flex-col items-center text-center">
            <span className="text-2xl mb-2">📈</span>
            <span className="text-xs font-bold text-gray-800">Ver Relatórios</span>
          </Link>
        </div>
      </div>
    </div>
  )
}