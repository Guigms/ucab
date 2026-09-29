'use client'
import { useState, useEffect } from 'react'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([])
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

  // Buscar produtos da API
  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
  }, [])

  // Cadastrar novo produto
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

  // Deletar produto
  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      await fetch(`/api/produtos?id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho da Seção */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catálogo</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Produtos</h2>
          <p className="text-sm text-gray-500">Gerencie modelos, tamanhos e cores das suas t-shirts.</p>
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
              <th className="p-4 pl-6">Produto</th>
              <th className="p-4">Tamanho</th>
              <th className="p-4">Cor</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Custo médio</th>
              <th className="p-4">Valor estoque</th>
              <th className="p-4 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {produtos.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            ) : (
              produtos.map((p: any) => {
                const valorEstoque = p.estoque * p.precoCusto
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-900">{p.nome}</td>
                    <td className="p-4 text-gray-600">{p.tamanho}</td>
                    <td className="p-4 text-gray-600">{p.cor}</td>
                    <td className="p-4 text-gray-400">{p.sku || '-'}</td>
                    <td className="p-4 font-semibold text-gray-900">
                      {p.estoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-gray-600">
                      R$ {p.precoCusto.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      R$ {valorEstoque.toFixed(2).replace('.', ',')}
                    </td>
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
            
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-gray-900">Novo produto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nome do produto *
                </label>
                <input
                  type="text"
                  placeholder="Ex: T-shirt Floral Rosé"
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Tamanho
                  </label>
                  <input
                    type="text"
                    placeholder="P / M / G"
                    value={form.tamanho}
                    onChange={e => setForm({ ...form, tamanho: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Cor
                  </label>
                  <input
                    type="text"
                    placeholder="Rosé"
                    value={form.cor}
                    onChange={e => setForm({ ...form, cor: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoCusto}
                    onChange={e => setForm({ ...form, precoCusto: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoVenda}
                    onChange={e => setForm({ ...form, precoVenda: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Estoque Inic.
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={form.estoque}
                    onChange={e => setForm({ ...form, estoque: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                />
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