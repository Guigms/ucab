'use client'
import { useState, useEffect } from 'react'

export default function RelatoriosPage() {
  const [dados, setDados] = useState<any>(null)

  useEffect(() => {
    fetch('/api/relatorios')
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(() => setDados(null))
  }, [])

  if (!dados) {
    return <div className="p-10 text-xs text-gray-400">A carregar relatórios...</div>
  }

  // Função auxiliar para formatar com segurança
  const formatMoney = (val: number) => {
    const num = Number(val) || 0
    return num.toFixed(2).replace('.', ',')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Análises</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Relatórios</h2>
        <p className="text-sm text-gray-500">Lucratividade, evolução mensal e composição do estoque.</p>
      </div>

      {/* Cartões Superiores de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estoque Atual</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            {(dados.resumo?.estoqueAtual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-gray-400 mt-1">peças disponíveis</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Valor em Estoque</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            R$ {formatMoney(dados.resumo?.valorEstoque)}
          </h3>
          <p className="text-xs text-gray-400 mt-1">a custo médio</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">SKUs Cadastrados</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">
            {dados.resumo?.skusCadastrados || 0}
          </h3>
          <p className="text-xs text-gray-400 mt-1">produtos diferentes</p>
        </div>
      </div>

      {/* Bloco de Evolução Mensal */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Evolução Mensal</span>
        <h4 className="text-base font-bold text-gray-900 mb-6">Receita, Custo e Lucro por mês</h4>

        {!dados.evolucaoMensal || dados.evolucaoMensal.length === 0 ? (
          <p className="text-xs text-gray-400 py-10 text-center">Ainda não existem dados suficientes de compras ou vendas.</p>
        ) : (
          <div className="space-y-6">
            {dados.evolucaoMensal.map((item: any, idx: number) => (
              <div key={idx} className="border-b border-gray-50 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">{item.mes}</span>
                  <div className="flex gap-4 text-[11px] font-semibold text-gray-600">
                    <span>Custo: R$ {formatMoney(item.custo)}</span>
                    <span>Lucro: R$ {formatMoney(item.lucro)}</span>
                    <span>Receita: R$ {formatMoney(item.receita)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 h-8">
                  <div className="bg-stone-800 rounded-lg flex items-center px-3 text-[11px] text-white font-bold">
                    Custo: R$ {formatMoney(item.custo)}
                  </div>
                  <div className="bg-stone-500 rounded-lg flex items-center px-3 text-[11px] text-white font-bold">
                    Lucro: R$ {formatMoney(item.lucro)}
                  </div>
                  <div className="bg-stone-400 rounded-lg flex items-center px-3 text-[11px] text-white font-bold">
                    Receita: R$ {formatMoney(item.receita)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legenda do Gráfico */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-stone-800 rounded-xs inline-block"></span> Custo</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-stone-500 rounded-xs inline-block"></span> Lucro</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-stone-400 rounded-xs inline-block"></span> Receita</div>
        </div>
      </div>

      {/* Bloco Mix de Pagamentos */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receita por Forma de Pagamento</span>
        <h4 className="text-base font-bold text-gray-900 mb-6">Mix de pagamentos</h4>

        {!dados.mixPagamentos || dados.mixPagamentos.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">Nenhum pagamento registrado.</p>
        ) : (
          <div className="space-y-4">
            {dados.mixPagamentos.map((mix: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                  <span>{mix.forma}</span>
                  <span>R$ {formatMoney(mix.total)} · {(Number(mix.porcentagem) || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-stone-500 h-full rounded-full" style={{ width: `${Math.min(mix.porcentagem || 0, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}