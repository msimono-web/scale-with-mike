'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Lead, RdvStatus } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus, Calendar, Loader2, Link2, ChevronLeft, ChevronRight,
  Clock, User, Phone, Mail, Trash2, CheckCircle2, XCircle, AlertTriangle,
  ExternalLink, MessageSquare, FileText,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────── */
interface Rdv {
  id: string
  leadId: string
  date: string      // YYYY-MM-DD
  heure: string     // HH:mm
  duree: number     // minutes
  status: RdvStatus
  lienVisio?: string
  notes?: string
  commentaire?: string
}

const STATUS_CONFIG: Record<RdvStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  prevu: { label: 'Prévu', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300', icon: <Clock className="w-3 h-3" /> },
  fait: { label: 'Fait', color: 'text-green-700', bg: 'bg-green-100 border-green-300', icon: <CheckCircle2 className="w-3 h-3" /> },
  no_show: { label: 'No show', color: 'text-red-700', bg: 'bg-red-100 border-red-300', icon: <AlertTriangle className="w-3 h-3" /> },
  annule: { label: 'Annulé', color: 'text-slate-500', bg: 'bg-slate-100 border-slate-300', icon: <XCircle className="w-3 h-3" /> },
}

const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

type ViewMode = 'month' | 'week'

/* ── Helpers ───────────────────────────────────── */
const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}
function getMonday(d: Date) {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

/* ── Page ──────────────────────────────────────── */
export default function AppointmentsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [rdvs, setRdvs] = useState<Rdv[]>([])

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedRdv, setSelectedRdv] = useState<Rdv | null>(null)

  // Create modal
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ leadId: '', date: '', heure: '10:00', duree: '30', lienVisio: '', notes: '' })

  // Google Calendar
  const [googleConnected, setGoogleConnected] = useState(false)

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setLeads(data)
        const rdvLeads = data.filter((l: Lead) => ['rdv_pris', 'rdv_fait'].includes(l.status))
        const builtRdvs: Rdv[] = rdvLeads.map((l: Lead) => ({
          id: `rdv-${l.id}`,
          leadId: l.id,
          date: l.derniereAction?.split('T')[0] ?? toDateStr(new Date()),
          heure: '10:00',
          duree: 30,
          status: (l.status === 'rdv_fait' ? 'fait' : 'prevu') as RdvStatus,
          lienVisio: '',
          notes: '',
        }))
        setRdvs(builtRdvs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // ── Stats ──────────────────────────────────────
  const stats = {
    total: rdvs.length,
    prevu: rdvs.filter(r => r.status === 'prevu').length,
    fait: rdvs.filter(r => r.status === 'fait').length,
    noShow: rdvs.filter(r => r.status === 'no_show').length,
    today: rdvs.filter(r => r.date === toDateStr(new Date()) && r.status === 'prevu').length,
  }

  // ── Calendar grid generation ───────────────────
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthDays = useMemo(() => {
    const first = new Date(year, month, 1)
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1 // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days: { date: Date; str: string; currentMonth: boolean }[] = []

    // Previous month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i)
      days.push({ date: d, str: toDateStr(d), currentMonth: false })
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i)
      days.push({ date: d, str: toDateStr(d), currentMonth: true })
    }
    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push({ date: d, str: toDateStr(d), currentMonth: false })
    }
    return days
  }, [year, month])

  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return { date: d, str: toDateStr(d) }
    })
  }, [currentDate])

  const rdvsByDate = useMemo(() => {
    const map: Record<string, Rdv[]> = {}
    rdvs.forEach(r => {
      if (!map[r.date]) map[r.date] = []
      map[r.date].push(r)
    })
    // Sort by time
    Object.values(map).forEach(arr => arr.sort((a, b) => a.heure.localeCompare(b.heure)))
    return map
  }, [rdvs])

  const todayStr = toDateStr(new Date())

  // ── Navigation ─────────────────────────────────
  const nav = (dir: -1 | 1) => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + dir)
    else d.setDate(d.getDate() + dir * 7)
    setCurrentDate(d)
  }

  // ── Create RDV ─────────────────────────────────
  const handleCreate = async () => {
    if (!form.leadId || !form.date) return
    await fetch(`/api/leads/${form.leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rdv_pris' }),
    })
    const newRdv: Rdv = {
      id: `rdv-${Date.now()}`,
      leadId: form.leadId,
      date: form.date,
      heure: form.heure,
      duree: parseInt(form.duree),
      status: 'prevu',
      lienVisio: form.lienVisio,
      notes: form.notes,
    }
    setRdvs(prev => [...prev, newRdv])
    setShowCreate(false)
    setForm({ leadId: '', date: '', heure: '10:00', duree: '30', lienVisio: '', notes: '' })
  }

  // ── Update RDV status ──────────────────────────
  const updateRdvStatus = async (rdv: Rdv, newStatus: RdvStatus) => {
    const leadStatus = newStatus === 'fait' ? 'rdv_fait' : newStatus === 'annule' ? 'contacte' : 'rdv_pris'
    await fetch(`/api/leads/${rdv.leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: leadStatus }),
    })
    setRdvs(prev => prev.map(r => r.id === rdv.id ? { ...r, status: newStatus } : r))
    setSelectedRdv(prev => prev?.id === rdv.id ? { ...prev, status: newStatus } : prev)
  }

  // ── Delete RDV ─────────────────────────────────
  const deleteRdv = (id: string) => {
    setRdvs(prev => prev.filter(r => r.id !== id))
    setSelectedRdv(null)
  }

  // ── Click on date → open create with date pre-filled
  const onDateClick = (dateStr: string) => {
    setSelectedDate(dateStr)
    setForm(f => ({ ...f, date: dateStr }))
    setShowCreate(true)
  }

  const getLeadName = (leadId: string) => {
    const l = leads.find(l => l.id === leadId)
    return l ? `${l.prenom} ${l.nom}` : 'Lead inconnu'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* ── KPIs ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Aujourd'hui", value: stats.today, color: 'text-blue-600' },
          { label: 'Total RDV', value: stats.total, color: 'text-slate-900' },
          { label: 'Prévus', value: stats.prevu, color: 'text-blue-600' },
          { label: 'Faits', value: stats.fait, color: 'text-green-600' },
          { label: 'No show', value: stats.noShow, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Calendar header ────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-3">
          <button onClick={() => nav(-1)} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
          <h2 className="text-sm sm:text-xl font-bold text-slate-900 min-w-[140px] sm:min-w-[200px] text-center">
            {view === 'month'
              ? `${MONTHS_FR[month]} ${year}`
              : `Sem. ${weekDays[0].date.getDate()} ${MONTHS_FR[weekDays[0].date.getMonth()]}`
            }
          </h2>
          <button onClick={() => nav(1)} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="text-[10px] sm:text-xs px-2 sm:px-3">
            Auj.
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'month' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              Mois
            </button>
            <button onClick={() => setView('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'week' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              Semaine
            </button>
          </div>

          {/* Google Calendar */}
          <Button
            variant={googleConnected ? 'secondary' : 'outline'}
            size="sm"
            className="gap-2 text-xs"
            onClick={() => {
              if (!googleConnected) {
                window.open('https://calendar.google.com', '_blank')
                setGoogleConnected(true)
              }
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" opacity=".1"/>
              <path fill="#4285F4" d="M12 2v10l8.5 5L22 12c0-5.52-4.48-10-10-10z" opacity=".3"/>
              <path fill="#34A853" d="M12 22c5.52 0 10-4.48 10-10l-8.5-5L12 12v10z" opacity=".3"/>
              <path fill="#FBBC05" d="M2 12c0 5.52 4.48 10 10 10V12L3.5 7 2 12z" opacity=".3"/>
              <path fill="#EA4335" d="M12 2C6.48 2 2 6.48 2 12l1.5-5L12 12V2z" opacity=".3"/>
            </svg>
            {googleConnected ? 'Google connecté' : 'Connecter Google Calendar'}
          </Button>

          <Button onClick={() => { setForm(f => ({ ...f, date: toDateStr(new Date()) })); setShowCreate(true) }}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <Plus className="w-4 h-4" /> Nouveau RDV
          </Button>
        </div>
      </div>

      {/* ── MONTH VIEW ─────────────────────────────── */}
      {view === 'month' && (
        <Card>
          <CardContent className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200">
              {DAYS_FR.map(d => (
                <div key={d} className="py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {monthDays.map(({ date, str, currentMonth }, i) => {
                const dayRdvs = rdvsByDate[str] || []
                const isToday = str === todayStr
                return (
                  <div
                    key={i}
                    onClick={() => onDateClick(str)}
                    className={`min-h-[60px] sm:min-h-[100px] border-b border-r border-slate-100 p-1 sm:p-1.5 cursor-pointer transition-colors hover:bg-blue-50/50 ${
                      !currentMonth ? 'bg-slate-50/50' : ''
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-blue-600 text-white' : currentMonth ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-0.5">
                      {dayRdvs.slice(0, 3).map(rdv => {
                        const cfg = STATUS_CONFIG[rdv.status]
                        return (
                          <button key={rdv.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedRdv(rdv) }}
                            className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium border truncate ${cfg.bg} ${cfg.color} hover:brightness-95 transition-all`}>
                            <span className="font-bold">{rdv.heure}</span> {getLeadName(rdv.leadId).split(' ')[0]}
                          </button>
                        )
                      })}
                      {dayRdvs.length > 3 && (
                        <p className="text-[10px] text-slate-400 text-center">+{dayRdvs.length - 3} autres</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── WEEK VIEW ──────────────────────────────── */}
      {view === 'week' && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-8 border-b border-slate-200">
                <div className="py-3 px-2 text-xs font-bold text-slate-400"></div>
                {weekDays.map(({ date, str }) => {
                  const isToday = str === todayStr
                  return (
                    <div key={str} className={`py-3 text-center ${isToday ? 'bg-blue-50' : ''}`}>
                      <p className="text-xs text-slate-400">{DAYS_FR[date.getDay() === 0 ? 6 : date.getDay() - 1]}</p>
                      <p className={`text-lg font-black ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>{date.getDate()}</p>
                    </div>
                  )
                })}
              </div>
              {/* Time slots */}
              {HOURS.map(hour => (
                <div key={hour} className="grid grid-cols-8 border-b border-slate-50">
                  <div className="py-3 px-2 text-xs text-slate-400 font-medium text-right pr-3 border-r border-slate-100">{hour}</div>
                  {weekDays.map(({ str }) => {
                    const dayRdvs = (rdvsByDate[str] || []).filter(r => r.heure.startsWith(hour.split(':')[0]))
                    return (
                      <div key={str}
                        onClick={() => { setForm(f => ({ ...f, date: str, heure: hour })); setShowCreate(true) }}
                        className="py-1 px-1 border-r border-slate-50 min-h-[48px] cursor-pointer hover:bg-blue-50/30 transition-colors">
                        {dayRdvs.map(rdv => {
                          const cfg = STATUS_CONFIG[rdv.status]
                          return (
                            <button key={rdv.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedRdv(rdv) }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium border mb-1 ${cfg.bg} ${cfg.color} hover:brightness-95 transition-all`}>
                              <p className="font-bold">{rdv.heure} · {rdv.duree}min</p>
                              <p className="truncate">{getLeadName(rdv.leadId)}</p>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Leads à placer (sans RDV) ──────────────── */}
      {leads.filter(l => !['rdv_pris', 'rdv_fait', 'signe', 'perdu'].includes(l.status)).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" /> Leads à placer sur le calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {leads
                .filter(l => !['rdv_pris', 'rdv_fait', 'signe', 'perdu'].includes(l.status))
                .slice(0, 12)
                .map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => { setForm(f => ({ ...f, leadId: lead.id, date: toDateStr(new Date()) })); setShowCreate(true) }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {lead.prenom[0]}{lead.nom?.[0] || ''}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{lead.prenom} {lead.nom}</p>
                      <p className="text-[10px] text-slate-400 truncate">{lead.telephone || lead.email}</p>
                    </div>
                    <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 ml-1" />
                  </button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── CREATE RDV MODAL ───────────────────────── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Nouveau rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Lead</Label>
              <Select value={form.leadId} onValueChange={v => setForm(f => ({ ...f, leadId: v ?? '' }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner un lead" /></SelectTrigger>
                <SelectContent>
                  {leads.map(l => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.prenom} {l.nom} {l.entreprise ? `· ${l.entreprise}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Heure</Label>
                <Input type="time" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Durée</Label>
              <div className="flex gap-2 mt-1">
                {['15', '30', '45', '60'].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, duree: d }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      form.duree === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}>
                    {d} min
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Lien visio (optionnel)</Label>
              <Input placeholder="https://meet.google.com/..." value={form.lienVisio} onChange={e => setForm(f => ({ ...f, lienVisio: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Notes (optionnel)</Label>
              <Input placeholder="Contexte du RDV..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="mt-1" />
            </div>
            <Button onClick={handleCreate} disabled={!form.leadId || !form.date}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Créer le rendez-vous
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── RDV DETAIL MODAL ───────────────────────── */}
      <Dialog open={!!selectedRdv} onOpenChange={() => setSelectedRdv(null)}>
        <DialogContent className="max-w-md">
          {selectedRdv && (() => {
            const lead = leads.find(l => l.id === selectedRdv.leadId)
            const cfg = STATUS_CONFIG[selectedRdv.status]
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Détail du rendez-vous</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Lead info */}
                  {lead && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {lead.prenom[0]}{lead.nom?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{lead.prenom} {lead.nom}</p>
                        {lead.entreprise && <p className="text-xs text-slate-500">{lead.entreprise}</p>}
                        <div className="flex gap-3 mt-1">
                          {lead.telephone && (
                            <a href={`tel:${lead.telephone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                              <Phone className="w-3 h-3" /> {lead.telephone}
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RDV details */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase">Date</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRdv.date}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase">Heure</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRdv.heure}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase">Durée</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRdv.duree} min</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Statut</p>
                    <Badge className={`${cfg.bg} ${cfg.color} gap-1`}>
                      {cfg.icon} {cfg.label}
                    </Badge>
                  </div>

                  {/* Visio link */}
                  {selectedRdv.lienVisio && (
                    <a href={selectedRdv.lienVisio} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                      <Link2 className="w-4 h-4" /> Rejoindre la visio <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}

                  {/* Notes */}
                  {selectedRdv.notes && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notes</p>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">{selectedRdv.notes}</p>
                    </div>
                  )}

                  {/* Commentaire post-RDV */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Commentaire {selectedRdv.status === 'fait' ? '(compte-rendu)' : ''}
                    </p>
                    <Textarea
                      placeholder={selectedRdv.status === 'fait'
                        ? 'Résumé du RDV : ce qui a été dit, prochaines étapes...'
                        : 'Ajouter un commentaire...'}
                      value={selectedRdv.commentaire || ''}
                      onChange={e => {
                        const val = e.target.value
                        setRdvs(prev => prev.map(r => r.id === selectedRdv.id ? { ...r, commentaire: val } : r))
                        setSelectedRdv(prev => prev ? { ...prev, commentaire: val } : prev)
                      }}
                      rows={3}
                      className="text-sm"
                    />
                    {selectedRdv.commentaire && (
                      <Button size="sm" variant="outline" className="mt-2 gap-1 text-xs" onClick={async () => {
                        // Save comment to lead historique
                        const lead = leads.find(l => l.id === selectedRdv.leadId)
                        if (lead) {
                          const newAction = {
                            id: `h-${Date.now()}`,
                            type: 'note',
                            label: `RDV ${selectedRdv.date} ${selectedRdv.heure} — ${selectedRdv.commentaire}`,
                            date: new Date().toISOString().split('T')[0],
                            agentId: 'agent-1',
                          }
                          await fetch(`/api/leads/${lead.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              historique: [...(lead.historique || []), newAction],
                            }),
                          })
                        }
                      }}>
                        <CheckCircle2 className="w-3 h-3" /> Sauvegarder le commentaire
                      </Button>
                    )}
                  </div>

                  {/* Voir la fiche complète */}
                  {lead && (
                    <a href={`/leads?search=${encodeURIComponent(lead.prenom + ' ' + lead.nom)}`}
                      className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-100 transition-colors font-medium">
                      <FileText className="w-4 h-4" /> Voir la fiche complète du lead <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Changer le statut</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRdv.status !== 'fait' && (
                        <Button size="sm" onClick={() => updateRdvStatus(selectedRdv, 'fait')}
                          className="bg-green-600 hover:bg-green-700 text-white gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fait
                        </Button>
                      )}
                      {selectedRdv.status !== 'no_show' && (
                        <Button size="sm" variant="outline" onClick={() => updateRdvStatus(selectedRdv, 'no_show')}
                          className="text-red-600 border-red-200 hover:bg-red-50 gap-1">
                          <AlertTriangle className="w-3 h-3" /> No show
                        </Button>
                      )}
                      {selectedRdv.status !== 'annule' && (
                        <Button size="sm" variant="outline" onClick={() => updateRdvStatus(selectedRdv, 'annule')}
                          className="text-slate-600 gap-1">
                          <XCircle className="w-3 h-3" /> Annuler
                        </Button>
                      )}
                      {selectedRdv.status !== 'prevu' && (
                        <Button size="sm" variant="outline" onClick={() => updateRdvStatus(selectedRdv, 'prevu')}
                          className="text-blue-600 border-blue-200 gap-1">
                          <Clock className="w-3 h-3" /> Remettre prévu
                        </Button>
                      )}
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => deleteRdv(selectedRdv.id)}
                      className="w-full gap-2 mt-2">
                      <Trash2 className="w-3 h-3" /> Supprimer le RDV
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
