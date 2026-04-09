'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Zap,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  CheckSquare2,
  Trophy,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

export function Sidebar() {
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: 'PIPELINE',
      items: [
        { label: 'Pipeline CRM', href: '/pipeline', icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Leads', href: '/leads', icon: <Users className="w-4 h-4" /> },
        { label: 'Mes Tâches', href: '/tasks', icon: <CheckSquare2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ÉQUIPE',
      items: [
        { label: 'Leaderboard', href: '/leaderboard', icon: <Trophy className="w-4 h-4" /> },
        { label: 'Rendez-vous', href: '/appointments', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACQUISITION',
      items: [
        { label: 'Acquisition', href: '/acquisition', icon: <Zap className="w-4 h-4" /> },
        { label: 'Articles SEO', href: '/articles', icon: <FileText className="w-4 h-4" /> },
        { label: 'Communication', href: '/communication', icon: <MessageSquare className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPÉRATIONS',
      items: [
        { label: 'Facturation', href: '/invoices', icon: <CreditCard className="w-4 h-4" /> },
        { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTÈME',
      items: [
        { label: 'Réglages', href: '/settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <aside className="bg-[#0f172a] text-white w-[220px] h-screen fixed left-0 top-7 overflow-y-auto z-20" style={{height: 'calc(100vh - 28px)'}}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>ScaleWithMike</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {/* Dashboard Home */}
        <div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </div>

        {/* Sections */}
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-slate-400 px-3 mb-2">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  )
}
