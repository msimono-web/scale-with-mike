'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Lead } from '@/lib/types'
import { Loader2, BarChart3 } from 'lucide-react'

type Period = '7j' | '30j' | '90j' | 'all'

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30j')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filtrer par période
  const now = Date.now()
  const daysMap: Record<Period, number> = { '7j': 7, '30j': 30, '90j': 90, all: 99999 }
  const filtered = leads.filter(l =>
    (now - new Date(l.dateEntree).getTime()) < daysMap[period] * 86400000
  )

  // KPIs
  const total = filtered.length
  const contactes = filtered.filter(l => !['nouveau', 'a_contacter'].includes(l.status)).length
  const rdv = filtered.filter(l => ['rdv_pris', 'rdv_fait'].includes(l.status)).length
  const signes = filtered.filter(l => l.status === 'signe').length
  const caTotal = filtered.filter(l => l.status === 'signe').reduce((s, l) => s + l.caPotentiel, 0)

  // Attribution par source
  const sourceMap = new Map<string, { leads: number; contactes: number; rdv: number; signes: number }>()
  filtered.forEach(l => {
    const src = l.source || 'Manuel'
    if (!sourceMap.has(src)) sourceMap.set(src, { leads: 0, contactes: 0, rdv: 0, signes: 0 })
    const s = sourceMap.get(src)!
    s.leads++
    if (!['nouveau', 'a_contacter'].includes(l.status)) s.contactes++
    if (['rdv_pris', 'rdv_fait'].includes(l.status)) s.rdv++
    if (l.status === 'signe') s.signes++
  })
  const sourceStats = Array.from(sourceMap.entries())
    .map(([source, s]) => ({ source, ...s, taux: s.leads > 0 ? (s.signes / s.leads) * 100 : 0 }))
    .sort((a, b) => b.leads - a.leads)

  // Graphique tendance
  const days = daysMap[period] === 99999 ? 90 : daysMap[period]
  const dailyMap: Record<string, { leads: number; rdv: number; signes: number }> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    dailyMap[key] = { leads: 0, rdv: 0, signes: 0 }
  }
  filtered.forEach(l => {
    const d = new Date(l.dateEntree)
    const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
    if (dailyMap[key]) {
      dailyMap[key].leads++
      if (['rdv_pris','rdv_fait'].includes(l.status)) dailyMap[key].rdv++
      if (l.status === 'signe') dailyMap[key].signes++
    }
  })
  const chartData = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }))

  // Funnel
  const funnelData = [
    { name: 'Leads total', value: total, pct: 100 },
    { name: 'Contactés', value: contactes, pct: total > 0 ? Math.round((contactes / total) * 100) : 0 },
    { name: 'RDV', value: rdv, pct: total > 0 ? Math.round((rdv / total) * 100) : 0 },
    { name: 'Signés', value: signes, pct: total > 0 ? Math.round((signes / total) * 100) : 0 },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Période */}
      <div className="flex gap-2 flex-wrap">
        {(['7j', '30j', '90j', 'all'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              period === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}>
            {p === '7j' ? '7 jours' : p === '30j' ? '30 jours' : p === '90j' ? '90 jours' : 'Tout'}
          </button>
        ))}
      </div>

      {leads.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-200" />
          <p className="text-lg font-semibold mb-2">Aucune donnée</p>
          <p className="text-sm">Les analytics s'alimenteront automatiquement avec les leads</p>
        </Card>
      ) : (
        <Tabs defaultValue="funnel" className="w-full">
          <TabsList>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="tendance">Tendance</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'LEADS', value: total },
                { label: 'CONTACTÉS', value: contactes },
                { label: 'RDV', value: rdv },
                { label: 'SIGNÉS', value: signes },
                { label: 'CA SIGNÉ', value: `${(caTotal/1000).toFixed(1)}k€` },
              ].map(k => (
                <Card key={k.label}>
                  <CardContent className="pt-5 pb-4">
                    <p className="text-xs font-semibold text-slate-500">{k.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Funnel de Conversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {funnelData.map(stage => (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-xs font-semibold text-slate-600">{stage.value} ({stage.pct}%)</span>
                    </div>
                    <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-3 transition-all"
                        style={{ width: `${Math.max(stage.pct, 2)}%` }}
                      >
                        {stage.pct > 10 && <span className="text-xs font-bold text-white">{stage.pct}%</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Évolution des leads</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} interval={Math.floor(days / 10)} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="rdv" stroke="#10b981" name="RDV" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="signes" stroke="#f59e0b" name="Signés" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Attribution par Source</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {sourceStats.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Aucune donnée</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          {['SOURCE', 'LEADS', 'CONTACTÉS', 'RDV', 'SIGNÉS', 'TAUX'].map(h => (
                            <TableHead key={h} className="text-xs font-semibold">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sourceStats.map(s => (
                          <TableRow key={s.source}>
                            <TableCell className="text-sm font-medium">{s.source}</TableCell>
                            <TableCell className="text-sm">{s.leads}</TableCell>
                            <TableCell className="text-sm">{s.contactes}</TableCell>
                            <TableCell className="text-sm">{s.rdv}</TableCell>
                            <TableCell className="text-sm font-semibold text-green-600">{s.signes}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{s.taux.toFixed(1)}%</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
