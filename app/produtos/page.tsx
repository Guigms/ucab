'use client'
import { useState, useEffect } from 'react'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    tamanho: '',
    cor: '',
    sku: '',
    precoCusto: '',
    precoVenda: '',
    estoque: ''
  })

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        // Garante que só define como array se os dados forem válidos
        if (Array.isArray(data)) {
          setProdutos(data)
        } else {
          setProdutos([])
        }
      })
      .catch(() => setProdutos([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setIsModalOpen(false)
    setForm({ nome: '', tamanho: '', cor: '', sku: '', precoCusto: '', precoVenda: '', estoque: '' })
    window.location.reload()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      await fetch(`/api/produtos?id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  // Garantia adicional de segurança antes de mapear
  const produtosLista = Array.isArray(produtos) ? produtos : []

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catálogo</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Produtos</h2>
          <p className="text-sm text-gray-500">Gerencie o seu catálogo de roupas e estoque.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-400 hover:bg-stone-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          + Novo produto
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Nome / SKU</th>
              <th className="p-4">Tamanho</th>
              <th className="p-4">Cor</th>
              <th className="p-4">Custo</th>
              <th className="p-4">Venda</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Valor em Estoque</th>
              <th className="p-4 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {produtosLista.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  Nenhum produto cadastrado ainda ou falha na conexão com o banco.
                </td>
              </tr>
            ) : (
              produtosLista.map((p: any) => {
                const valorEstoque = (p.estoque || 0) * (p.precoCusto || 0)
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-gray-900">{p.nome}</div>
                      <div className="text-[10px] text-gray-400">{p.sku || 'Sem SKU'}</div>
                    </td>
                    <td className="p-4 text-gray-600">{p.tamanho}</td>
                    <td className="p-4 text-gray-600">{p.cor}</td>
                    <td className="p-4 text-gray-600">R$ {(p.precoCusto || 0).toFixed(2).replace('.', ',')}</td>
                    <td className="p-4 font-bold text-gray-900">R$ {(p.precoVenda || 0).toFixed(2).replace('.', ',')}</td>
                    <td className="p-4 font-semibold text-gray-900">{(p.estoque || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-gray-600">R$ {valorEstoque.toFixed(2).replace('.', ',')}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal / Popup de Novo Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-gray-900">Cadastrar novo produto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  placeholder="Ex: Blusa Regata Sutil"
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tamanho *</label>
                  <input
                    type="text"
                    placeholder="Ex: M ou Único"
                    value={form.tamanho}
                    onChange={e => setForm({ ...form, tamanho: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cor *</label>
                  <input
                    type="text"
                    placeholder="Ex: Branco Off"
                    value={form.cor}
                    onChange={e => setForm({ ...form, cor: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">SKU (Código Interno)</label>
                <input
                  type="text"
                  placeholder="Ex: BLU-OFF-01"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoCusto}
                    onChange={e => setForm({ ...form, precoCusto: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoVenda}
                    onChange={e => setForm({ ...form, precoVenda: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={form.estoque}
                    onChange={e => setForm({ ...form, estoque: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Salvar produto
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}