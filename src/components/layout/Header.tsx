'use client'

import Link from 'next/link'
import { Search, Bell, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 h-14 fixed top-7 left-[220px] right-0 flex items-center justify-between px-6 z-30 shadow-sm">
      {/* Barre de recherche */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher un lead, agent..."
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* Actions à droite */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Initiales agent */}
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          MD
        </div>

        {/* Déconnexion */}
        <Link
          href="/"
          className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </header>
  )
}
