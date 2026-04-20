'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, Bell, LogOut, LayoutDashboard, Users, TrendingUp, Zap, Calendar, FileText, MessageSquare, CreditCard, BarChart3, Settings, Trophy, CheckSquare2, BellRing, Phone, Mail, RefreshCw, Clock, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Lead, LeadReminder } from '@/lib/types'

/* ── Searchable pages ─────────────────────────────────── */
const PAGES = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, keywords: 'accueil home overview kpis' },
  { label: 'Pipeline CRM', href: '/pipeline', icon: <TrendingUp className="w-4 h-4" />, keywords: 'kanban drag drop statuts' },
  { label: 'Leads', href: '/leads', icon: <Users className="w-4 h-4" />, keywords: 'contacts prospects clients liste' },
  { label: 'Mes Tâches', href: '/tasks', icon: <CheckSquare2 className="w-4 h-4" />, keywords: 'todo actions rappels' },
  { label: 'Leaderboard', href: '/leaderboard', icon: <Trophy className="w-4 h-4" />, keywords: 'classement agents performance' },
  { label: 'Rendez-vous', href: '/appointments', icon: <Calendar className="w-4 h-4" />, keywords: 'rdv meeting agenda calendrier' },
  { label: 'Acquisition', href: '/acquisition', icon: <Zap className="w-4 h-4" />, keywords: 'intégrations facebook instagram linkedin' },
  { label: 'Articles SEO', href: '/articles', icon: <FileText className="w-4 h-4" />, keywords: 'blog contenu référencement' },
  { label: 'Communication', href: '/communication', icon: <MessageSquare className="w-4 h-4" />, keywords: 'templates whatsapp email sms' },
  { label: 'Facturation', href: '/invoices', icon: <CreditCard className="w-4 h-4" />, keywords: 'factures paiement argent' },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" />, keywords: 'statistiques funnel sources conversion' },
  { label: 'Réglages', href: '/settings', icon: <Settings className="w-4 h-4" />, keywords: 'paramètres configuration équipe invitations onglets' },
]

export function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch leads for search
  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(setLeads)
      .catch(() => {})
  }, [])

  // Keyboard shortcut: Cmd+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setFocused(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const q = query.toLowerCase().trim()

  // Filter pages
  const matchedPages = q
    ? PAGES.filter(p =>
        p.label.toLowerCase().includes(q) ||
        p.keywords.includes(q)
      )
    : []

  // Filter leads
  const matchedLeads = q && q.length >= 2
    ? leads.filter(l =>
        l.prenom.toLowerCase().includes(q) ||
        l.nom.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.telephone.includes(q) ||
        l.entreprise.toLowerCase().includes(q)
      ).slice(0, 5)
    : []

  const totalResults = matchedPages.length + matchedLeads.length
  const showDropdown = focused && q.length > 0 && totalResults > 0

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(0) }, [q])

  const navigateTo = (href: string) => {
    setQuery('')
    setFocused(false)
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIdx < matchedPages.length) {
        navigateTo(matchedPages[selectedIdx].href)
      } else {
        const leadIdx = selectedIdx - matchedPages.length
        navigateTo(`/leads?search=${encodeURIComponent(matchedLeads[leadIdx].prenom + ' ' + matchedLeads[leadIdx].nom)}`)
      }
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 h-14 fixed top-0 md:left-[220px] left-0 right-0 flex items-center justify-between px-3 sm:px-6 z-30 shadow-sm pl-14 md:pl-6">
      {/* Barre de recherche */}
      <div className="flex-1 max-w-xs sm:max-w-md relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher... ⌘K"
            className="pl-10 h-9 text-sm"
          />
        </div>

        {/* Search results dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            {/* Pages */}
            {matchedPages.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pages</p>
                {matchedPages.map((page, i) => (
                  <button
                    key={page.href}
                    onClick={() => navigateTo(page.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      selectedIdx === i ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-slate-400">{page.icon}</span>
                    <span className="font-medium">{page.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Leads */}
            {matchedLeads.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">Leads</p>
                {matchedLeads.map((lead, i) => {
                  const idx = matchedPages.length + i
                  return (
                    <button
                      key={lead.id}
                      onClick={() => navigateTo(`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        selectedIdx === idx ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {lead.prenom[0]}{lead.nom?.[0] || ''}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{lead.prenom} {lead.nom}</p>
                        <p className="text-xs text-slate-400 truncate">{lead.email || lead.telephone} · {lead.status.replace(/_/g, ' ')}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {focused && q.length > 0 && totalResults === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 p-6 text-center">
            <p className="text-sm text-slate-400">Aucun résultat pour &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Actions à droite */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Notification Center */}
        <NotificationCenter leads={leads} />

        {/* Initiales agent */}
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          MS
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

/* ── Notification Center ──────────────────────────────── */
function NotificationCenter({ leads }: { leads: Lead[] }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const now = new Date()

  // Collect all rappels across all leads
  type RappelWithLead = { rappel: LeadReminder; lead: Lead }
  const allRappels: RappelWithLead[] = []
  leads.forEach(lead => {
    (lead.rappels || []).forEach(rappel => {
      if (!rappel.done) {
        allRappels.push({ rappel, lead })
      }
    })
  })

  // Sort by date+heure
  allRappels.sort((a, b) => `${a.rappel.date}T${a.rappel.heure}`.localeCompare(`${b.rappel.date}T${b.rappel.heure}`))

  const overdueRappels = allRappels.filter(r => new Date(`${r.rappel.date}T${r.rappel.heure}`) < now)
  const todayRappels = allRappels.filter(r => r.rappel.date === today && new Date(`${r.rappel.date}T${r.rappel.heure}`) >= now)
  const upcomingRappels = allRappels.filter(r => r.rappel.date > today).slice(0, 5)

  const totalActive = overdueRappels.length + todayRappels.length

  // Also: leads inactive > 5 days
  const staleLeads = leads.filter(l => {
    if (['signe', 'perdu'].includes(l.status)) return false
    const daysSince = Math.floor((Date.now() - new Date(l.derniereAction).getTime()) / 86400000)
    return daysSince >= 5
  }).slice(0, 5)

  const totalNotifs = totalActive + staleLeads.length

  const typeIcons: Record<string, React.ReactNode> = {
    appel: <Phone className="w-3 h-3" />,
    email: <Mail className="w-3 h-3" />,
    relance: <RefreshCw className="w-3 h-3" />,
    rdv: <Calendar className="w-3 h-3" />,
    autre: <BellRing className="w-3 h-3" />,
  }

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setOpen(!open)} className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
        <Bell className="w-5 h-5" />
        {totalNotifs > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {totalNotifs > 9 ? '9+' : totalNotifs}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><BellRing className="w-4 h-4 text-blue-600" /> Notifications</h3>
            <span className="text-xs text-slate-400">{totalNotifs} actives</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {/* Overdue */}
            {overdueRappels.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">🔴 En retard</p>
                {overdueRappels.map(({ rappel, lead }) => (
                  <button key={rappel.id} onClick={() => { setOpen(false); router.push(`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      {typeIcons[rappel.type] || typeIcons.autre}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{rappel.label}</p>
                      <p className="text-[10px] text-slate-400">{lead.prenom} {lead.nom} · {rappel.date} {rappel.heure}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Today */}
            {todayRappels.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-amber-600 uppercase tracking-widest">🟡 Aujourd&apos;hui</p>
                {todayRappels.map(({ rappel, lead }) => (
                  <button key={rappel.id} onClick={() => { setOpen(false); router.push(`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-amber-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      {typeIcons[rappel.type] || typeIcons.autre}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{rappel.label}</p>
                      <p className="text-[10px] text-slate-400">{lead.prenom} {lead.nom} · à {rappel.heure}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Upcoming */}
            {upcomingRappels.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest">🔵 À venir</p>
                {upcomingRappels.map(({ rappel, lead }) => (
                  <button key={rappel.id} onClick={() => { setOpen(false); router.push(`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      {typeIcons[rappel.type] || typeIcons.autre}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{rappel.label}</p>
                      <p className="text-[10px] text-slate-400">{lead.prenom} {lead.nom} · {rappel.date} {rappel.heure}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Stale leads */}
            {staleLeads.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-100">⚠️ Leads inactifs (+5 jours)</p>
                {staleLeads.map(lead => {
                  const daysSince = Math.floor((Date.now() - new Date(lead.derniereAction).getTime()) / 86400000)
                  return (
                    <button key={lead.id} onClick={() => { setOpen(false); router.push(`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                        {lead.prenom[0]}{lead.nom?.[0] || ''}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{lead.prenom} {lead.nom}</p>
                        <p className="text-[10px] text-slate-400">Inactif depuis {daysSince} jours · {lead.status.replace(/_/g, ' ')}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Empty */}
            {totalNotifs === 0 && (
              <div className="text-center py-10 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-200" />
                <p className="text-sm font-medium text-green-600">Tout est à jour !</p>
                <p className="text-xs">Aucun rappel en attente</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
