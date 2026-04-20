'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Lead, LeadReminder } from '@/lib/types'
import { TrendingUp, AlertCircle, Loader2, BellRing, Phone, Mail, RefreshCw, Calendar as CalIcon, FileText, Clock } from 'lucide-react'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))

    const interval = setInterval(() => {
      fetch('/api/leads')
        .then(r => r.ok ? r.json() : [])
        .then(data => setLeads(data))
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  // ── KPIs calculés en temps réel ──────────────────────────────────────────
  const today = new Date().toDateString()
  const newLeadsToday = leads.filter(l => new Date(l.dateEntree).toDateString() === today).length
  const enPipeline = leads.filter(l => !['signe', 'perdu'].includes(l.status)).length
  const contactes = leads.filter(l => !['nouveau', 'a_contacter'].includes(l.status)).length
  const rdvPlanifies = leads.filter(l => ['rdv_pris', 'rdv_fait'].includes(l.status)).length
  const signes = leads.filter(l => l.status === 'signe').length
  const callbacks = leads.filter(l => ['pas_de_reponse', 'relance_envoyee'].includes(l.status))

  const priorityLeads = leads
    .filter(l => l.scoreIA >= 7)
    .sort((a, b) => b.scoreIA - a.scoreIA)
    .slice(0, 5)

  // ── Graphique tendance 30 jours ──────────────────────────────────────────
  const dailyMap: Record<string, { leads: number; rdv: number; signes: number }> = {}
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    dailyMap[key] = { leads: 0, rdv: 0, signes: 0 }
  }
  leads.forEach(l => {
    const d = new Date(l.dateEntree)
    const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    if (dailyMap[key]) {
      dailyMap[key].leads++
      if (['rdv_pris','rdv_fait'].includes(l.status)) dailyMap[key].rdv++
      if (l.status === 'signe') dailyMap[key].signes++
    }
  })
  const chartData = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }))

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Chargement des données…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Briefing du jour */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Nouveaux leads</p>
              <p className="text-3xl font-bold">{newLeadsToday}</p>
              <p className="text-xs opacity-75">Aujourd'hui</p>
            </div>
            <div>
              <p className="text-sm opacity-90">En pipeline</p>
              <p className="text-3xl font-bold">{enPipeline}</p>
              <p className="text-xs opacity-75">À traiter</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Callbacks</p>
              <p className="text-3xl font-bold">{callbacks.length}</p>
              <p className="text-xs opacity-75">À rappeler</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total leads</p>
              <p className="text-3xl font-bold">{leads.length}</p>
              <p className="text-xs opacity-75">Tous statuts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div>
        <h3 className="font-semibold text-sm text-slate-700 mb-3">Pipeline complet</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatsCard title="EN PIPELINE" value={enPipeline} />
          <StatsCard title="NOUVEAUX" value={leads.filter(l => l.status === 'nouveau').length} />
          <StatsCard title="CONTACTÉS" value={contactes} />
          <StatsCard title="RDV PLANIFIÉS" value={rdvPlanifies} />
          <StatsCard title="GAGNÉS" value={signes} />
        </div>
      </div>

      {/* ── Rappels du jour ──────────────────────────────────────────── */}
      {(() => {
        const todayStr = new Date().toISOString().split('T')[0]
        const nowDate = new Date()
        type RItem = { rappel: LeadReminder; lead: Lead }
        const items: RItem[] = []
        leads.forEach(lead => {
          (lead.rappels || []).forEach(r => {
            if (!r.done) items.push({ rappel: r, lead })
          })
        })
        items.sort((a, b) => `${a.rappel.date}T${a.rappel.heure}`.localeCompare(`${b.rappel.date}T${b.rappel.heure}`))
        const overdue = items.filter(i => new Date(`${i.rappel.date}T${i.rappel.heure}`) < nowDate)
        const todayItems = items.filter(i => i.rappel.date === todayStr && new Date(`${i.rappel.date}T${i.rappel.heure}`) >= nowDate)
        const upcoming = items.filter(i => i.rappel.date > todayStr).slice(0, 3)
        const all = [...overdue, ...todayItems, ...upcoming]
        if (all.length === 0) return null

        const typeIcons: Record<string, React.ReactNode> = {
          appel: <Phone className="w-3.5 h-3.5" />,
          email: <Mail className="w-3.5 h-3.5" />,
          relance: <RefreshCw className="w-3.5 h-3.5" />,
          rdv: <CalIcon className="w-3.5 h-3.5" />,
          autre: <BellRing className="w-3.5 h-3.5" />,
        }

        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-600" />
                Rappels
                {overdue.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] ml-1">{overdue.length} en retard</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {all.map(({ rappel, lead }) => {
                  const isPast = new Date(`${rappel.date}T${rappel.heure}`) < nowDate
                  const isToday = rappel.date === todayStr
                  return (
                    <div key={rappel.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isPast ? 'bg-red-50 border border-red-200' :
                      isToday ? 'bg-amber-50 border border-amber-200' :
                      'bg-slate-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isPast ? 'bg-red-100 text-red-600' :
                        isToday ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {typeIcons[rappel.type] || typeIcons.autre}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{rappel.label}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {lead.prenom} {lead.nom} · {rappel.date === todayStr ? `à ${rappel.heure}` : `${rappel.date} ${rappel.heure}`}
                          {isPast && <span className="text-red-500 font-bold ml-1">EN RETARD</span>}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Leads Prioritaires
              {priorityLeads.length === 0 && (
                <span className="text-xs text-slate-400 font-normal ml-1">— aucun pour l'instant</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityLeads.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Les leads avec un score ≥ 7 apparaîtront ici
              </p>
            ) : (
              <div className="space-y-3">
                {priorityLeads.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{lead.prenom} {lead.nom}</p>
                      <p className="text-xs text-slate-500">{lead.email || lead.telephone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-blue-600">
                        {lead.caPotentiel > 0 ? `${lead.caPotentiel.toLocaleString()}€` : '—'}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {lead.scoreIA}/10
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Callbacks en attente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              À rappeler
              {callbacks.length === 0 && (
                <span className="text-xs text-slate-400 font-normal ml-1">— rien pour l'instant</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {callbacks.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Les leads sans réponse apparaîtront ici
              </p>
            ) : (
              <div className="space-y-3">
                {callbacks.slice(0, 5).map(lead => {
                  const daysSince = Math.floor(
                    (Date.now() - new Date(lead.derniereAction).getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{lead.prenom} {lead.nom}</p>
                        <p className="text-xs text-slate-500">
                          {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince} jour${daysSince > 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {lead.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphique tendance 30 jours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tendance 30 Jours</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {leads.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Le graphique se remplira au fur et à mesure des leads
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} interval={4} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rdv" stroke="#10b981" name="RDV" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="signes" stroke="#f59e0b" name="Signés" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
