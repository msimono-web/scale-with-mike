'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, TrendingUp, Zap, Calendar, FileText,
  MessageSquare, CreditCard, BarChart3, Settings, LogOut, Crown,
  CheckSquare2, Trophy, Menu, X,
} from 'lucide-react'
import { useSettings } from '@/lib/dashboard-settings'
import { useClient } from '@/lib/client-context'

interface NavItem { label: string; href: string; icon: React.ReactNode }
interface NavSection { title: string; items: NavItem[] }

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { isTabHidden } = useSettings()
  const { client } = useClient()

  // White-label: prefix all hrefs with /client/[slug] if in a client space
  const slugPrefix = client ? `/client/${client.slug}` : ''
  const brandName = client ? client.companyName : 'ScaleWithMike'
  const primaryColor = client ? client.primaryColor : '#3b82f6'

  const navSections: NavSection[] = [
    {
      title: 'PIPELINE',
      items: [
        { label: 'Pipeline CRM', href: `${slugPrefix}/pipeline`, icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Leads', href: `${slugPrefix}/leads`, icon: <Users className="w-4 h-4" /> },
        { label: 'Mes Tâches', href: `${slugPrefix}/tasks`, icon: <CheckSquare2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ÉQUIPE',
      items: [
        { label: 'Leaderboard', href: `${slugPrefix}/leaderboard`, icon: <Trophy className="w-4 h-4" /> },
        { label: 'Rendez-vous', href: `${slugPrefix}/appointments`, icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACQUISITION',
      items: [
        { label: 'Acquisition', href: `${slugPrefix}/acquisition`, icon: <Zap className="w-4 h-4" /> },
        { label: 'Articles SEO', href: `${slugPrefix}/articles`, icon: <FileText className="w-4 h-4" /> },
        { label: 'Communication', href: `${slugPrefix}/communication`, icon: <MessageSquare className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPÉRATIONS',
      items: [
        { label: 'Facturation', href: `${slugPrefix}/invoices`, icon: <CreditCard className="w-4 h-4" /> },
        { label: 'Analytics', href: `${slugPrefix}/analytics`, icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTÈME',
      items: [
        { label: 'Réglages', href: `${slugPrefix}/settings`, icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ]

  const isActive = (href: string) => pathname === href

  // Filter out hidden items (never hide /settings and /dashboard)
  const visibleSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.href === '/settings' || !isTabHidden(item.href)
      ),
    }))
    .filter(section => section.items.length > 0)

  const NavContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <Link href={`${slugPrefix}/dashboard`} className="flex items-center gap-2 font-bold text-lg" onClick={onNav}>
          {client?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt={brandName} className="w-7 h-7 rounded-lg object-contain bg-white p-0.5" />
          ) : (
            <Crown className="w-5 h-5 text-yellow-400" />
          )}
          <span className="truncate max-w-[140px]">{brandName}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <Link
            href={`${slugPrefix}/dashboard`}
            onClick={onNav}
            style={pathname === `${slugPrefix}/dashboard` ? { backgroundColor: primaryColor } : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === `${slugPrefix}/dashboard` ? 'text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </div>
        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-slate-400 px-3 mb-2">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNav}
                  style={isActive(item.href) ? { backgroundColor: primaryColor } : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href) ? 'text-white' : 'text-slate-300 hover:bg-slate-800'
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
      <div className="p-4 border-t border-slate-700">
        <Link
          href={client ? `/client/${client.slug}` : '/'}
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* ── Bouton hamburger (mobile uniquement) ── */}
      <button
        className="md:hidden fixed top-3.5 left-3 z-40 p-1.5 rounded-lg bg-slate-800 text-white"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Sidebar desktop (toujours visible ≥ md) ── */}
      <aside className="hidden md:flex flex-col bg-[#0f172a] text-white w-[220px] fixed left-0 top-0 z-20 h-screen">
        <NavContent />
      </aside>

      {/* ── Drawer mobile (overlay) ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          {/* Panel */}
          <aside className="relative flex flex-col bg-[#0f172a] text-white w-72 h-full overflow-y-auto">
            <button
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
