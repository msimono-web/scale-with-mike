'use client'

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
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts'
import { getKPIs, leads, dailyStats, agents } from '@/lib/data'
import { TrendingUp, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const kpis = getKPIs()
  const today = new Date()
  const newLeadsToday = leads.filter(
    (l) => new Date(l.dateEntree).toDateString() === today.toDateString()
  ).length

  // Données pour le gauge
  const gaugeData = [
    { name: 'Leads', value: 42, fill: '#3b82f6' },
    { name: 'Fermer', value: 58, fill: '#8b5cf6' },
    { name: 'Callbacks', value: 35, fill: '#10b981' },
    { name: 'Bounce', value: 22, fill: '#f59e0b' },
    { name: 'Revenue', value: 78, fill: '#ef4444' },
  ]

  // Leads prioritaires
  const priorityLeads = leads
    .filter((l) => l.scoreIA >= 8)
    .sort((a, b) => b.scoreIA - a.scoreIA)
    .slice(0, 5)

  // Callbacks en attente
  const callbacksPending = leads
    .filter((l) => ['pas_de_reponse', 'relance_envoyee'].includes(l.status))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Briefing du jour */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Nouveaux leads</p>
              <p className="text-2xl font-bold">{newLeadsToday}</p>
              <p className="text-xs opacity-75">+12% vs sem. préc.</p>
            </div>
            <div>
              <p className="text-sm opacity-90">En attente</p>
              <p className="text-2xl font-bold">{kpis.enPipeline}</p>
              <p className="text-xs opacity-75">À contacter</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Callbacks</p>
              <p className="text-2xl font-bold">{callbacksPending.length}</p>
              <p className="text-xs opacity-75">À rappeler</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Vélocité CA</p>
              <p className="text-2xl font-bold">+8.5k€</p>
              <p className="text-xs opacity-75">Aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Score journalier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Score Journalier</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart data={gaugeData} innerRadius="60%" outerRadius="100%">
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  angleAxisId={0}
                  cornerRadius={8}
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-semibold text-sm text-slate-700">Closer Operations</h3>
          <div className="grid grid-cols-5 gap-3">
            <StatsCard title="EN PIPELINE" value={kpis.enPipeline} />
            <StatsCard title="NOUVEAUX" value={kpis.nouveaux} />
            <StatsCard title="CONTACTÉS" value={kpis.contactes} />
            <StatsCard title="RDV PLANIFIÉS" value={kpis.rdvPlanifies} />
            <StatsCard title="GAGNÉS" value={kpis.signes} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Leads prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Leads Prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      {lead.prenom} {lead.nom}
                    </p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-blue-600">{lead.caPotentiel.toLocaleString()}€</p>
                    <Badge variant="secondary" className="text-xs">
                      {lead.scoreIA.toFixed(1)}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions requises */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Actions Requises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {callbacksPending.map((lead) => {
                const agent = agents.find((a) => a.id === lead.agentId)
                const daysSince = Math.floor(
                  (Date.now() - new Date(lead.derniereAction).getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {lead.prenom} {lead.nom}
                      </p>
                      <p className="text-xs text-slate-500">Il y a {daysSince} jours</p>
                    </div>
                    <Badge style={{ backgroundColor: agent?.couleur }} className="text-white text-xs">
                      {agent?.nom.split(' ')[0]}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique tendance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tendance 30 Jours</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rdv" stroke="#10b981" name="RDV" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="signes" stroke="#f59e0b" name="Signés" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
