'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StatsCard from '@/components/shared/StatsCard'
import { agents, agentStats as initialAgentStats, leads } from '@/lib/data'
import type { AgentStats } from '@/lib/types'
import { Trophy, Medal, Target } from 'lucide-react'

type Period = 'week' | 'month' | 'all'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('month')

  // Calcul des stats pour chaque agent
  const agentStatsMap = new Map<string, AgentStats>()

  agents.forEach((agent) => {
    const agentLeads = leads.filter((l) => l.agentId === agent.id)
    const signes = agentLeads.filter((l) => l.status === 'signe').length
    const assignes = agentLeads.length
    const tauxConversion = assignes > 0 ? Math.round((signes / assignes) * 100) : 0
    const caGenere = agentLeads
      .filter((l) => l.status === 'signe')
      .reduce((sum, l) => sum + l.caPotentiel, 0)

    agentStatsMap.set(agent.id, {
      agentId: agent.id,
      appels: Math.floor(Math.random() * 50) + 20,
      contacts: assignes,
      rdv: agentLeads.filter((l) => l.status === 'rdv_pris').length,
      signes,
      tauxConversion,
      caGenere,
    })
  })

  const agentStatsArray = Array.from(agentStatsMap.values())
    .sort((a, b) => b.caGenere - a.caGenere)
    .slice(0, 3)

  const allAgentStats = Array.from(agentStatsMap.values()).sort((a, b) => b.caGenere - a.caGenere)

  const totalStats = {
    actifs: agents.filter((a) => a.status === 'actif').length,
    assignes: leads.length,
    gagnes: leads.filter((l) => l.status === 'signe').length,
    revenue: allAgentStats.reduce((sum, s) => sum + s.caGenere, 0),
  }

  return (
    <div className="space-y-6">
      {/* Periode Toggle */}
      <div className="flex gap-2">
        {(['week', 'month', 'all'] as Period[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'outline'}
            onClick={() => setPeriod(p)}
            className="text-sm"
          >
            {p === 'week' ? 'Cette semaine' : p === 'month' ? 'Ce mois' : 'Tout'}
          </Button>
        ))}
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="PARTICIPANTS ACTIFS" value={totalStats.actifs} />
        <StatsCard title="TOTAL ASSIGNÉS" value={totalStats.assignes} />
        <StatsCard title="TOTAL GAGNÉS" value={totalStats.gagnes} />
        <StatsCard title="REVENUE GÉNÉRÉE" value={`${(totalStats.revenue / 1000).toFixed(1)}k€`} />
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4">
        {agentStatsArray.map((stats, index) => {
          const agent = agents.find((a) => a.id === stats.agentId)
          const medals = [<Trophy className="w-6 h-6 text-yellow-500" />, <Medal className="w-6 h-6 text-gray-400" />, <Medal className="w-6 h-6 text-orange-600" />]
          const bgColors = ['border-yellow-200 bg-yellow-50', 'border-gray-200 bg-gray-50', 'border-orange-200 bg-orange-50']

          return (
            <Card key={stats.agentId} className={`${bgColors[index]} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">#{index + 1}</p>
                    <CardTitle className="text-lg">{agent?.nom}</CardTitle>
                  </div>
                  {medals[index]}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Assignés</span>
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
          )
        })}
      </div>

      {/* Table complète */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Classement Complet</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">RANG</TableHead>
                  <TableHead className="text-xs font-semibold">AGENT</TableHead>
                  <TableHead className="text-xs font-semibold">APPELS</TableHead>
                  <TableHead className="text-xs font-semibold">CONTACTS</TableHead>
                  <TableHead className="text-xs font-semibold">RDV</TableHead>
                  <TableHead className="text-xs font-semibold">SIGNÉS</TableHead>
                  <TableHead className="text-xs font-semibold">WIN RATE</TableHead>
                  <TableHead className="text-xs font-semibold">CA GÉNÉRÉ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAgentStats.map((stats, index) => {
                  const agent = agents.find((a) => a.id === stats.agentId)
                  return (
                    <TableRow key={stats.agentId}>
                      <TableCell className="text-sm font-semibold">#{index + 1}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: agent?.couleur }} className="text-white text-xs">
                          {agent?.nom}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{stats.appels}</TableCell>
                      <TableCell className="text-sm">{stats.contacts}</TableCell>
                      <TableCell className="text-sm">{stats.rdv}</TableCell>
                      <TableCell className="text-sm font-semibold text-green-600">{stats.signes}</TableCell>
                      <TableCell className="text-sm font-semibold">{stats.tauxConversion}%</TableCell>
                      <TableCell className="text-sm font-bold text-blue-600">
                        {(stats.caGenere / 1000).toFixed(1)}k€
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
