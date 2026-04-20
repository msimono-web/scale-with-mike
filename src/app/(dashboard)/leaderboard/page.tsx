'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import StatsCard from '@/components/shared/StatsCard'
import type { Lead } from '@/lib/types'
import { Trophy, Medal, Loader2, Users } from 'lucide-react'

type Period = 'week' | 'month' | 'all'

interface AgentStat {
  agentId: string
  nom: string
  contacts: number
  rdv: number
  signes: number
  tauxConversion: number
  caGenere: number
}

export default function LeaderboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('month')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filtrer par période
  const now = Date.now()
  const filteredLeads = leads.filter(l => {
    if (period === 'all') return true
    const days = period === 'week' ? 7 : 30
    return (now - new Date(l.dateEntree).getTime()) < days * 86400000
  })

  // Grouper par agentId
  const agentMap = new Map<string, AgentStat>()
  filteredLeads.forEach(l => {
    const key = l.agentId || 'non-assigne'
    if (!agentMap.has(key)) {
      agentMap.set(key, { agentId: key, nom: l.agentId ? `Agent ${l.agentId.slice(0, 6)}` : 'Non assigné', contacts: 0, rdv: 0, signes: 0, tauxConversion: 0, caGenere: 0 })
    }
    const s = agentMap.get(key)!
    s.contacts++
    if (['rdv_pris', 'rdv_fait'].includes(l.status)) s.rdv++
    if (l.status === 'signe') { s.signes++; s.caGenere += l.caPotentiel }
  })
  agentMap.forEach(s => {
    s.tauxConversion = s.contacts > 0 ? Math.round((s.signes / s.contacts) * 100) : 0
  })

  const allStats = Array.from(agentMap.values()).sort((a, b) => b.caGenere - a.caGenere)
  const podium = allStats.slice(0, 3)

  const totalStats = {
    agents: agentMap.size,
    assignes: filteredLeads.length,
    gagnes: filteredLeads.filter(l => l.status === 'signe').length,
    revenue: allStats.reduce((sum, s) => sum + s.caGenere, 0),
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  if (leads.length === 0) return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['week', 'month', 'all'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium border transition-colors ${period === p ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            {p === 'week' ? 'Cette semaine' : p === 'month' ? 'Ce mois' : 'Tout'}
          </button>
        ))}
      </div>
      <Card className="p-12 text-center text-slate-400">
        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-semibold mb-2">Aucune donnée pour l'instant</p>
        <p className="text-sm">Le classement s'alimentera automatiquement dès que des leads seront assignés à des agents.</p>
      </Card>
    </div>
  )

  const medalColors = ['border-yellow-200 bg-yellow-50', 'border-gray-200 bg-gray-50', 'border-orange-200 bg-orange-50']
  const medalIcons = [
    <Trophy key="1" className="w-6 h-6 text-yellow-500" />,
    <Medal key="2" className="w-6 h-6 text-gray-400" />,
    <Medal key="3" className="w-6 h-6 text-orange-600" />,
  ]

  return (
    <div className="space-y-6">
      {/* Période */}
      <div className="flex gap-2">
        {(['week', 'month', 'all'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium border transition-colors ${period === p ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            {p === 'week' ? 'Cette semaine' : p === 'month' ? 'Ce mois' : 'Tout'}
          </button>
        ))}
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="AGENTS ACTIFS" value={totalStats.agents} />
        <StatsCard title="LEADS ASSIGNÉS" value={totalStats.assignes} />
        <StatsCard title="TOTAL GAGNÉS" value={totalStats.gagnes} />
        <StatsCard title="REVENUE GÉNÉRÉE" value={`${(totalStats.revenue / 1000).toFixed(1)}k€`} />
      </div>

      {/* Podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {podium.map((stats, index) => (
            <Card key={stats.agentId} className={`${medalColors[index]} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">#{index + 1}</p>
                    <CardTitle className="text-lg">{stats.nom}</CardTitle>
                  </div>
                  {medalIcons[index]}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Contacts</span>
                  <span className="font-semibold">{stats.contacts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gagnés</span>
                  <span className="font-semibold text-green-600">{stats.signes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Win Rate</span>
                  <span className="font-semibold">{stats.tauxConversion}%</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-slate-600 font-semibold">CA Généré</span>
                  <span className="font-bold text-blue-600">{(stats.caGenere / 1000).toFixed(1)}k€</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Classement complet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Classement Complet</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {['RANG', 'AGENT', 'CONTACTS', 'RDV', 'SIGNÉS', 'WIN RATE', 'CA GÉNÉRÉ'].map(h => (
                    <TableHead key={h} className="text-xs font-semibold">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allStats.map((stats, index) => (
                  <TableRow key={stats.agentId}>
                    <TableCell className="text-sm font-semibold">#{index + 1}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{stats.nom}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{stats.contacts}</TableCell>
                    <TableCell className="text-sm">{stats.rdv}</TableCell>
                    <TableCell className="text-sm font-semibold text-green-600">{stats.signes}</TableCell>
                    <TableCell className="text-sm font-semibold">{stats.tauxConversion}%</TableCell>
                    <TableCell className="text-sm font-bold text-blue-600">
                      {(stats.caGenere / 1000).toFixed(1)}k€
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
