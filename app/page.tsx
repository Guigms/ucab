'use client'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    receitaTotal: 150.00,
    lucroTotal: 75.00,
    margem: '50%',
    totalInvestido: 300.15,
    estoqueAtual: '15,01 pçs',
    vendasRealizadas: 1
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho da Seção */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visão Geral</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Acompanhe vendas, lucro e estoque da sua boutique em tempo real.</p>
      </div>

      {/* Grid de Cards Superiores (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card Receita */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Receita Total</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">💲</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">R$ {stats.receitaTotal.toFixed(2).replace('.', ',')}</h3>
            <p className="text-xs text-gray-400 mt-1">Mês atual: R$ {stats.receitaTotal.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {/* Card Lucro Total */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lucro Total</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">📈</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">R$ {stats.lucroTotal.toFixed(2).replace('.', ',')}</h3>
            <p className="text-xs text-gray-400 mt-1">Mês atual: R$ {stats.lucroTotal.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {/* Card Margem */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Margem</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">%</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">{stats.margem}</h3>
            <p className="text-xs text-gray-400 mt-1">Lucro / Receita</p>
          </div>
        </div>

      </div>

      {/* Segunda linha de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Investido */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Investido em Compras</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">👛</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">R$ {stats.totalInvestido.toFixed(2).replace('.', ',')}</h3>
          </div>
        </div>

        {/* Estoque Atual */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estoque Atual</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">📦</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">{stats.estoqueAtual}</h3>
            <p className="text-xs text-gray-400 mt-1">Valor: R$ 225,15</p>
          </div>
        </div>

        {/* Vendas Realizadas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vendas Realizadas</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-xs">🛒</div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-black text-gray-900">{stats.vendasRealizadas}</h3>
            <p className="text-xs text-gray-400 mt-1">Mês atual: 1 venda(s)</p>
          </div>
        </div>

      </div>

      {/* Seção Inferior: Gráfico e Produtos Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bloco Gráfico (Simulado) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Últimos 30 Dias</span>
          <h4 className="text-base font-bold text-gray-900 mb-4">Receita x Custo x Lucro</h4>
          <div className="h-48 flex items-end gap-2 border-b border-gray-100 pb-2">
            {/* Barras de exemplo */}
            <div className="w-full bg-stone-100 h-24 rounded-t-lg relative flex items-end justify-center">
              <span className="text-[10px] text-gray-400 absolute -bottom-6">30</span>
            </div>
          </div>
        </div>

        {/* Bloco Mais Vendidos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mais Vendidos</span>
          <h4 className="text-base font-bold text-gray-900 mb-4">Top produtos</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400">1</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Blusa Cropped</p>
                  <p className="text-[11px] text-gray-400">5 pçs · Lucro R$ 75,00</p>
                </div>
              </div>
              <span className="text-xs font-black text-gray-900">R$ 150,00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}