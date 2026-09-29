'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Se estiver na página de login, renderiza apenas o conteúdo sem a sidebar
  if (pathname === '/login') {
    return (
      <html lang="pt-BR">
        <body className="bg-gray-50 text-gray-900 h-screen overflow-hidden">
          {children}
        </body>
      </html>
    )
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 flex h-screen overflow-hidden">
        
        {/* Sidebar Esquerda com fundo branco suave */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
          <div>
            {/* Logo / Topo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-stone-900 text-white p-2 rounded-lg font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight text-gray-900">UCAB</h1>
                <span className="text-xs text-gray-400 tracking-wider">GESTÃO</span>
              </div>
            </div>

            {/* Navegação */}
            <nav className="space-y-1">
              <Link href="/" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${pathname === '/' ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                📊 Dashboard
              </Link>
              <Link href="/produtos" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${pathname === '/produtos' ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                📦 Produtos
              </Link>
              <Link href="/compras" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${pathname === '/compras' ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                🛍️ Compras
              </Link>
              <Link href="/vendas" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${pathname === '/vendas' ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                💳 Vendas
              </Link>
              <Link href="/relatorios" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${pathname === '/relatorios' ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                📈 Relatórios
              </Link>
            </nav>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center font-bold text-xs text-stone-700">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">Administradora</p>
                <p className="text-[11px] text-gray-400 truncate">admin@loja.com</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              🚪 Sair
            </button>
          </div>
        </aside>

        {/* Conteúdo Principal com fundo suave */}
        <main className="flex-1 overflow-y-auto p-10 bg-gray-50">
          {children}
        </main>

      </body>
    </html>
  )
}