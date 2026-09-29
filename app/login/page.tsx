'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      const data = await res.json()
      setErro(data.error || 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl w-full max-w-md">
        
        {/* Logo / Topo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-stone-900 text-white p-2.5 rounded-xl font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-gray-900">Atelier</h1>
            <span className="text-xs text-gray-400 tracking-wider">GESTÃO</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-1">Entrar no sistema</h2>
        <p className="text-xs text-gray-500 mb-6">Insira suas credenciais para aceder ao painel.</p>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">E-mail</label>
            <input
              type="email"
              placeholder="admin@loja.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Palavra-passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white p-3 rounded-xl text-xs font-bold transition-all shadow-sm mt-2"
          >
            Aceder ao Painel
          </button>
        </form>

      </div>
    </div>
  )
}