'use client'
import { useState, useEffect } from 'react'

export default function ComprasPage() {
  const [compras, setCompras] = useState([])
  const [produtos, setProdutos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [form, setForm] = useState({
    produtoId: '',
    quantidade: '',
    custoUnit: '',
    fornecedor: '',
    dataCompra: new Date().toISOString().split('T')[0]
  })

  // Buscar compras e produtos cadastrados
  useEffect(() => {
    fetch('/api/compras')
      .then(res => res.json())
      .then(data => setCompras(data))

    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
  }, [])

  const totalInvestido = compras.reduce((acc: number, item: any) => acc + item.total, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/compras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setIsModalOpen(false)
    setForm({ produtoId: '', quantidade: '', custoUnit: '', fornecedor: '', dataCompra: new Date().toISOString().split('T')[0] })
    window.location.reload()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja excluir esta compra e estornar o estoque?')) {
      await fetch(`/api/compras?id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entradas de Estoque</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Compras</h2>
          <p className="text-sm text-gray-500">Registre cada pedido feito ao fornecedor. O custo médio é atualizado automaticamente.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-400 hover:bg-stone-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          + Nova compra
        </button>
      </div>

      {/* Card Total Investido */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 max-w-sm">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Investido</span>
        <h3 className="text-3xl font-black text-gray-900 mt-2">
          R$ {totalInvestido.toFixed(2).replace('.', ',')}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{compras.length} compra(s) registrada(s)</p>
      </div>

      {/* Tabela de Compras */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Data</th>
              <th className="p-4">Produto</th>
              <th className="p-4">Fornecedor</th>
              <th className="p-4">Qtd</th>
              <th className="p-4">Custo unit.</th>
              <th className="p-4">Total</th>
              <th className="p-4 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {compras.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  Nenhuma compra registrada ainda.
                </td>
              </tr>
            ) : (
              compras.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 text-gray-600">
                    {new Date(c.dataCompra).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 font-bold text-gray-900">{c.produto?.nome}</td>
                  <td className="p-4 text-gray-600">{c.fornecedor || '-'}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    {c.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-gray-600">R$ {c.custoUnit.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 font-bold text-gray-900">R$ {c.total.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
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

      {/* Modal / Popup de Nova Compra */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-gray-900">Registrar compra</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Produto *
                </label>
                <select
                  value={form.produtoId}
                  onChange={e => setForm({ ...form, produtoId: e.target.value })}
                  required
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.tamanho} - {p.cor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={form.quantidade}
                    onChange={e => setForm({ ...form, quantidade: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Custo unitário (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.custoUnit}
                    onChange={e => setForm({ ...form, custoUnit: e.target.value })}
                    required
                    className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Fornecedor
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={form.fornecedor}
                  onChange={e => setForm({ ...form, fornecedor: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={form.dataCompra}
                  onChange={e => setForm({ ...form, dataCompra: e.target.value })}
                  required
                  className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Registrar compra
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}