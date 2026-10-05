'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Se estiver na página de login, renderiza apenas o conteúdo sem a sidebar
  if (pathname === '/login') {
    return (
      <html lang="pt-BR">
        <body className="bg-gray-50 text-gray-900 min-h-screen">
          {children}
        </body>
      </html>
    )
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const navItems = [
    { href: '/', label: '📊 Dashboard' },
    { href: '/produtos', label: '📦 Produtos' },
    { href: '/compras', label: '🛍️ Compras' },
    { href: '/vendas', label: '💳 Vendas' },
    { href: '/relatorios', label: '📈 Relatórios' },
  ]

  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 flex flex-col md:flex-row min-h-screen overflow-x-hidden">
        
        {/* Barra Superior Mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-lg font-bold text-xs">
              A
            </div>
            <div>
              <h1 className="font-bold text-xs leading-tight text-gray-900">UCAB</h1>
              <span className="text-[10px] text-gray-400 tracking-wider">GESTÃO</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-bold"
          >
            {mobileMenuOpen ? '✕ Fechar' : '☰ Menu'}
          </button>
        </div>

        {/* Sidebar Esquerda (Desktop fixo / Mobile deslizante) */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6 transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div>
            {/* Logo / Topo (Desktop) */}
            <div className="hidden md:flex items-center gap-3 mb-10">
              <div className="bg-stone-900 text-white p-2 rounded-lg font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight text-gray-900">UCAB</h1>
                <span className="text-xs text-gray-400 tracking-wider">GESTÃO</span>
              </div>
            </div>

            {/* Navegação */}
            <nav className="space-y-1 mt-6 md:mt-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm ${
                      isActive ? 'bg-stone-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="border-t border-gray-100 pt-4 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center font-bold text-xs text-stone-700">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">Administradora</p>
                <p className="text-[11px] text-gray-400 truncate"></p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              🚪 Sair
            </button>
          </div>
        </aside>

        {/* Overlay escuro ao abrir menu mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Conteúdo Principal Responsivo */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-gray-50 w-full max-w-full">
          {children}
        </main>

      </body>
    </html>
  )
}