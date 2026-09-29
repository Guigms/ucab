'use client'
import { useState, useEffect } from 'react'

export default function VendasPage() {
  const [vendas, setVendas] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [cliente, setCliente] = useState('')
  const [formaPagto, setFormaPagto] = useState('PIX')
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split('T')[0])
  const [carrinho, setCarrinho] = useState<any[]>([])

  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState('')

  useEffect(() => {
    fetch('/api/vendas')
      .then(res => res.json())
      .then(data => {
        // Garante que se a API retornar erro ou algo diferente de array, mantemos uma lista vazia
        if (Array.isArray(data)) {
          setVendas(data)
        } else {
          setVendas([])
        }
      })
      .catch(() => setVendas([]))

    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProdutos(data)
        } else {
          setProdutos([])
        }
      })
      .catch(() => setProdutos([]))
  }, [])

  // Proteção para o reduce funcionar apenas se vendas for um array válido
  const receitaTotal = Array.isArray(vendas) 
    ? vendas.reduce((acc: number, item: any) => acc + (item.valorTotal || 0), 0)
    : 0

  const handleAddCarrinho = () => {
    if (!produtoSelecionado || !quantidade) return
    const prod: any = produtos.find((p: any) => p.id === parseInt(produtoSelecionado))
    if (!prod) return

    const qtd = parseFloat(quantidade)
    const subtotal = qtd * prod.precoVenda

    setCarrinho([
      ...carrinho,
      {
        produtoId: prod.id,
        nome: prod.nome,
        tamanho: prod.tamanho,
        cor: prod.cor,
        quantidade: qtd,
        precoVenda: prod.precoVenda,
        subtotal
      }
    ])
    setProdutoSelecionado('')
    setQuantidade('')
  }

  const handleRemoveCarrinho = (index: number) => {
    setCarrinho(carrinho.filter((_, i) => i !== index))
  }

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.subtotal, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (carrinho.length === 0) {
      alert('Adicione pelo menos um produto à venda.')
      return
    }

    await fetch('/api/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente,
        formaPagto,
        dataVenda,
        itens: carrinho.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade }))
      })
    })

    setIsModalOpen(false)
    setCarrinho([])
    setCliente('')
    window.location.reload()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja excluir esta venda e estornar os itens para o estoque?')) {
      await fetch(`/api/vendas?id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Saídas de Estoque</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Vendas</h2>
          <p className="text-sm text-gray-500">Registre cada venda com múltiplos produtos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-400 hover:bg-stone-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          + Nova venda
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 max-w-sm">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Receita Total</span>
        <h3 className="text-3xl font-black text-gray-900 mt-2">
          R$ {receitaTotal.toFixed(2).replace('.', ',')}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{vendas.length} venda(s)</p>
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Data</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Itens / Produtos</th>
              <th className="p-4">Pagamento</th>
              <th className="p-4">Total</th>
              <th className="p-4 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {vendas.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            ) : (
              vendas.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 text-gray-600">
                    {new Date(v.dataVenda).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-gray-600">{v.cliente || '-'}</td>
                  <td className="p-4 text-gray-900">
                    {v.itens?.map((i: any, idx: number) => (
                      <div key={idx}>
                        {i.quantidade}x {i.produto?.nome} ({i.produto?.tamanho} - {i.produto?.cor})
                      </div>
                    ))}
                  </td>
                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {v.formaPagto}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">R$ {v.valorTotal.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Venda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-gray-900">Registrar nova venda</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cliente</label>
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Forma de Pagamento</label>
                  <select
                    value={formaPagto}
                    onChange={e => setFormaPagto(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Data da Venda</label>
                <input
                  type="date"
                  value={dataVenda}
                  onChange={e => setDataVenda(e.target.value)}
                  required
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              {/* Seção de Adicionar Produtos ao Carrinho */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Adicionar Produtos à Venda</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Produto</label>
                    <select
                      value={produtoSelecionado}
                      onChange={e => setProdutoSelecionado(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-2.5 text-xs text-gray-900"
                    >
                      <option value="">Selecione...</option>
                      {produtos.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} ({p.tamanho}-{p.cor}) [Preço: R$ {p.precoVenda.toFixed(2)}]
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantidade</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="1"
                      value={quantidade}
                      onChange={e => setQuantidade(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-2.5 text-xs text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={handleAddCarrinho}
                      className="w-full bg-stone-800 hover:bg-stone-900 text-white p-2.5 rounded-xl text-xs font-bold"
                    >
                      + Incluir item
                    </button>
                  </div>
                </div>

                {/* Lista do Carrinho */}
                <div className="mt-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2">
                  {carrinho.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-2">Nenhum produto adicionado ainda.</p>
                  ) : (
                    carrinho.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 text-xs">
                        <div>
                          <span className="font-bold text-gray-900">{item.quantidade}x {item.nome}</span>
                          <span className="text-gray-400 ml-2">({item.tamanho} - {item.cor}) · R$ {item.precoVenda.toFixed(2)} un (Cadastro)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">R$ {item.subtotal.toFixed(2)}</span>
                          <button type="button" onClick={() => handleRemoveCarrinho(idx)} className="text-red-500 font-bold">✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 px-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Valor Total da Venda:</span>
                  <span className="text-lg font-black text-gray-900">R$ {totalCarrinho.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Finalizar e Registrar Venda
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}